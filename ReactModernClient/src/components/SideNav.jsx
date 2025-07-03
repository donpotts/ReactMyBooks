import React from 'react';
import { Book, Users, Grid3x3, X } from 'lucide-react';

function SideNav({ isOpen, onClose, onNavigateToBookContent, onNavigateToAuthorContent, onNavigateToCategoryContent }) {
  
  const handleBooksClick = () => {
    onNavigateToBookContent({ contentType: 'books' });
    onClose();
  };

  const handleAuthorsClick = () => {
    onNavigateToAuthorContent({ contentType: 'authors' });
    onClose();
  };

  const handleCategoriesClick = () => {
    onNavigateToCategoryContent({ contentType: 'categories' });
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-indigo-300">Menu</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-4">
            <button
              onClick={handleBooksClick}
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg w-full text-left transition-colors duration-200"
            >
              <Book size={20} className="mr-3" />
              Books
            </button>
            <button
              onClick={handleAuthorsClick}
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg w-full text-left transition-colors duration-200"
            >
              <Users size={20} className="mr-3" />
              Authors
            </button>
            <button
              onClick={handleCategoriesClick}
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg w-full text-left transition-colors duration-200"
            >
              <Grid3x3 size={20} className="mr-3" />
              Categories
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default SideNav;