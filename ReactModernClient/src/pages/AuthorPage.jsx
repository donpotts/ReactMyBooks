// src/pages/AuthorPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor, getBooks } from '../api/auth.js';

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

function AuthorForm({ author, mode, authToken, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: author?.name || '',
    birthDate: author?.birthDate || '',
    shortBio: author?.shortBio || '',
    book: author?.book?.map(({ id }) => ({ id })) || [],
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setFormData({
      name: author?.name || '',
      birthDate: author?.birthDate || '',
      shortBio: author?.shortBio || '',
      book: author?.book?.map(({ id }) => ({ id })) || [],
    });
    setFormError(null);
  }, [author, mode]);

  useEffect(() => {
    const fetchBooks = async () => {
      const result = await getBooks(authToken);
      if (result.success) {
        setBooks(result.data);
      }
    };
  
    if (authToken) {
      fetchBooks();
    }
  }, [authToken]);

  const handleChange = (e) => {
    const name = e.target.name;
    let newValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    if (name === 'book') {
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
      console.log("Attempting to add new author with data:", formData);
      result = await createAuthor(authToken, formData);
    } else if (mode === 'edit') {
      const { id: _id, ...dataToUpdate } = formData;
      console.log("Attempting to update author ID:", author.id);
      console.log("Payload dataToUpdate:", dataToUpdate);
      result = await updateAuthor(authToken, author.id, dataToUpdate);
      console.log("Result from update API call:", result);
    }

    if (result.success) {
      onSave();
    } else {
      setFormError(result.message);
      console.error("Failed to save author:", result.message || "An unknown error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mt-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'add' ? 'Add New Author' : 'Edit Author'}
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
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Birth Date</label>
          <input
            type="text"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="shortBio" className="block text-sm font-medium text-gray-700">Short Bio</label>
          <input
            type="text"
            id="shortBio"
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">Book</label>
          <select
            id="book"
            name="book"
            multiple
            value={formData.book.map(x => x.id.toString()) || []}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
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
            {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Author' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, author, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-auto transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete author: {author.name}?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(author.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AuthorPage({ authToken, onGoToHome }) {
  const [authorsData, setAuthorsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [authorsPerPage, setAuthorsPerPage] = useState(5);

  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = authorsData.slice(indexOfFirstAuthor, indexOfLastAuthor);

  const totalPages = Math.ceil(authorsData.length / authorsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAuthorsPerPageChange = (e) => {
    setAuthorsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAuthors(authToken);

    if (result.success) {
      setAuthorsData(result.data);
      console.log("Authors fetched successfully:", result.data);
      setCurrentPage(1);
    } else {
      setError(result.message);
      console.error("Failed to fetch authors:", result.message);
      setAuthorsData([]);
    }
    setLoading(false);
  }, [authToken, setCurrentPage, setAuthorsData, setLoading, setError]);

  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchAuthors();
    } else if (!authToken) {
      setError("Please log in to view authors.");
      setAuthorsData([]);
    }
  }, [authToken, viewMode, fetchAuthors]);

  const handleAddClick = () => {
    setViewMode('add');
    setSelectedAuthor(null);
  };

  const handleEditClick = (author) => {
    setViewMode('edit');
    setSelectedAuthor(author);
  };

  const handleDeleteClick = (author) => {
    setAuthorToDelete(author);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (authorId) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    const result = await deleteAuthor(authToken, authorId);
    if (result.success) {
      console.log("Author deleted successfully.");
      fetchAuthors();
    } else {
      setError(result.message || "Failed to delete author.");
      console.error("Failed to delete author:", result.message);
    }
    setLoading(false);
    setAuthorToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAuthorToDelete(null);
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchAuthors();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedAuthor(null);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      <style>{modalAnimations}</style>

      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Authors</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Add Author
              </button>
            </div>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchAuthors}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Authors'}
          </button>

          {showSuccessMessage && (
            <p className="text-green-400 text-center mb-4 animate-fade-in">
              Author saved successfully!
            </p>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {authorsData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentAuthors.map((author, index) => (
                  <div key={author.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{author.name}</h3>
                      <p className="text-gray-600 text-sm">Birth Date: {author.birthDate}</p>
                      <p className="text-gray-600 text-sm">Short Bio: {author.shortBio}</p>
                      <p className="text-gray-600 text-sm">Book: {author.book?.map(x => x.name).join(', ')}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(author)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(author)}
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
                  <label htmlFor="authorsPerPage" className="text-sm font-medium">Authors per page:</label>
                  <select
                    id="authorsPerPage"
                    value={authorsPerPage}
                    onChange={handleAuthorsPerPageChange}
                    className="bg-indigo-700 text-white rounded-lg shadow-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value={authorsData.length}>All</option>
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
              <p className="text-indigo-200 text-center mt-8">No authors to display. Click "Add Author" to create one.</p>
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
        <AuthorForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'edit' && selectedAuthor && (
        <AuthorForm
          author={selectedAuthor}
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        author={authorToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default AuthorPage;
