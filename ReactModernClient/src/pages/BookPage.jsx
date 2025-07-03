// src/pages/BookPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getBooks, createBook, updateBook, deleteBook, getAuthors, getCategories } from '../api/auth.js';

const modalAnimations = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in-fade-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  .animate-scale-in-fade-in {
    animation: scale-in-fade-in 0.3s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out forwards;
  }
`;

function BookForm({ book, mode, authToken, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: book?.name || '',
    publishDate: book?.publishDate || '',
    price: book?.price || 0,
    author: book?.author?.map(({ id }) => ({ id })) || [],
    category: book?.category?.map(({ id }) => ({ id })) || [],
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setFormData({
      name: book?.name || '',
      publishDate: book?.publishDate || '',
      price: book?.price || 0,
      author: book?.author?.map(({ id }) => ({ id })) || [],
      category: book?.category?.map(({ id }) => ({ id })) || [],
    });
    setFormError(null);
  }, [book, mode]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const result = await getAuthors(authToken);
      if (result.success) {
        setAuthors(result.data);
      }
    };
    const fetchCategories = async () => {
      const result = await getCategories(authToken);
      if (result.success) {
        setCategories(result.data);
      }
    };
  
    if (authToken) {
      fetchAuthors();
      fetchCategories();
    }
  }, [authToken]);

  const handleChange = (e) => {
    const name = e.target.name;
    let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'price') {
      newValue = parseFloat(e.target.value);
    }

    if (name === 'author') {
      newValue = Array.from(e.target.selectedOptions, option => ({ id: parseInt(option.value) }));
    }

    if (name === 'category') {
      newValue = Array.from(e.target.selectedOptions, option => ({ id: parseInt(option.value) }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    let result;
    if (mode === 'add') {
      console.log("Attempting to add new book with data:", formData);
      result = await createBook(authToken, formData);
    } else if (mode === 'edit') {
      const { id: _id, ...dataToUpdate } = formData;
      console.log("Attempting to update book ID:", book.id);
      console.log("Payload dataToUpdate:", dataToUpdate);
      result = await updateBook(authToken, book.id, dataToUpdate);
      console.log("Result from update API call:", result);
    }

    if (result.success) {
      onSave();
    } else {
      setFormError(result.message);
      console.error("Failed to save book:", result.message || "An unknown error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mt-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'add' ? 'Add New Book' : 'Edit Book'}
      </h3>
      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">Publish Date</label>
          <input
            type="text"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">Author</label>
          <select
            id="author"
            name="author"
            multiple
            value={formData.author.map(x => x.id.toString()) || []}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            multiple
            value={formData.category.map(x => x.id.toString()) || []}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Book' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, book, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-auto transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete book: {book.name}?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(book.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function BookPage({ authToken, onGoToHome }) {
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = booksData.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(booksData.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBooksPerPageChange = (e) => {
    setBooksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getBooks(authToken);

    if (result.success) {
      setBooksData(result.data);
      console.log("Books fetched successfully:", result.data);
      setCurrentPage(1);
    } else {
      setError(result.message);
      console.error("Failed to fetch books:", result.message);
      setBooksData([]);
    }
    setLoading(false);
  }, [authToken, setCurrentPage, setBooksData, setLoading, setError]);

  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchBooks();
    } else if (!authToken) {
      setError("Please log in to view books.");
      setBooksData([]);
    }
  }, [authToken, viewMode, fetchBooks]);

  const handleAddClick = () => {
    setViewMode('add');
    setSelectedBook(null);
  };

  const handleEditClick = (book) => {
    setViewMode('edit');
    setSelectedBook(book);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (bookId) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    const result = await deleteBook(authToken, bookId);
    if (result.success) {
      console.log("Book deleted successfully.");
      fetchBooks();
    } else {
      setError(result.message || "Failed to delete book.");
      console.error("Failed to delete book:", result.message);
    }
    setLoading(false);
    setBookToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchBooks();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedBook(null);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      <style>{modalAnimations}</style>

      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Books</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Add Book
              </button>
            </div>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchBooks}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Books'}
          </button>

          {showSuccessMessage && (
            <p className="text-green-400 text-center mb-4 animate-fade-in">
              Book saved successfully!
            </p>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {booksData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentBooks.map((book, index) => (
                  <div key={book.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{book.name}</h3>
                      <p className="text-gray-600 text-sm">Publish Date: {book.publishDate}</p>
                      <p className="text-gray-600 text-sm">Price: {book.price}</p>
                      <p className="text-gray-600 text-sm">Author: {book.author?.map(x => x.name).join(', ')}</p>
                      <p className="text-gray-600 text-sm">Category: {book.category?.map(x => x.name).join(', ')}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(book)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 text-white">
                <div className="flex items-center space-x-2">
                  <label htmlFor="booksPerPage" className="text-sm font-medium">Books per page:</label>
                  <select
                    id="booksPerPage"
                    value={booksPerPage}
                    onChange={handleBooksPerPageChange}
                    className="bg-indigo-700 text-white rounded-lg shadow-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value={booksData.length}>All</option>
                  </select>
                </div>
                {totalPages > 1 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                          currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            !loading && !error && authToken && (
              <p className="text-indigo-200 text-center mt-8">No books to display. Click "Add Book" to create one.</p>
            )
          )}

          {!authToken && !loading && !error && (
            <div className="text-center mt-8">
              <button
                onClick={onGoToHome}
                className="text-sm text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          )}
        </>
      )}

      {viewMode === 'add' && (
        <BookForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'edit' && selectedBook && (
        <BookForm
          book={selectedBook}
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        book={bookToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default BookPage;
