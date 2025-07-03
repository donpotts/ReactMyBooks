// src/App.jsx
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import LoginSuccessPage from './pages/LoginSuccessPage.jsx';
import GridContentPage from './pages/GridContentPage.jsx';
import BookPage from './pages/BookPage.jsx';
import AuthorPage from './pages/AuthorPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Navbar from './components/Navbar.jsx';
import SideNav from './components/SideNav.jsx';
import { validateToken } from './api/auth.js';
import { getHomeGridData } from './data/homedata.js';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!authToken);
  }, [authToken]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authToken) {
        try {
          console.log("App: Attempting to validate existing token...");
          const validationResult = await validateToken(authToken);

          if (validationResult.success) {
            console.log("App: Token validated successfully. Auto-logging in.");
            setIsAuthenticated(true);
            setCurrentPage('home');
          } else {
            console.log("App: Token validation failed or expired:", validationResult.message);
            setCurrentPage('home');
          }
        } catch (error) {
          console.error("App: Error during token validation check:", error);
          localStorage.removeItem('authToken');
          setAuthToken(null);
          setIsAuthenticated(false);
          setCurrentPage('home');
        }
      }
      setAppLoading(false);
    };

    checkAuthStatus();
  }, []);

  const goToLogin = () => {
    setCurrentPage('login');
    setIsSideNavOpen(false);
  };

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setCurrentPage('success');
  };

  const handleOkAndOpenSideNav = () => {
    setIsSideNavOpen(true);
    setCurrentPage('home');
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    setIsSideNavOpen(false);
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsSideNavOpen(false);
  };

  const goToGridContent = () => {
    setCurrentPage('grid');
    setIsSideNavOpen(false);
  };

  const goToBookContent = () => {
    setCurrentPage('books');
    setIsSideNavOpen(false);
  };

  const goToAuthorContent = () => {
    setCurrentPage('authors');
    setIsSideNavOpen(false);
  };

  const goToCategoryContent = () => {
    setCurrentPage('categories');
    setIsSideNavOpen(false);
  };

  const goToHome = () => {
    setCurrentPage('home');
    setIsSideNavOpen(false);
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleGoToHomeFromBook = () => {
    setCurrentPage('home');
    console.log('Navigated to Home from Book Page (from BookContentPage).');
  };

  const handleGoToHomeFromAuthor = () => {
    setCurrentPage('home');
    console.log('Navigated to Home from Author Page (from AuthorContentPage).');
  };

  const handleGoToHomeFromCategory = () => {
    setCurrentPage('home');
    console.log('Navigated to Home from Category Page (from CategoryContentPage).');
  };

  const renderContent = () => {
    if (appLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen text-white text-2xl animate-pulse">
          Loading application...
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onGoToLogin={goToLogin} />;
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onGoToHome={handleLogout} />;
      case 'success':
        return <LoginSuccessPage onOpenSideNavAndNavigate={handleOkAndOpenSideNav} />;
      case 'grid':
        return <GridContentPage data={getHomeGridData} />;
      case 'books':
        return (
          <BookPage // Changed from BookContentPage to BookPage
            authToken={authToken}
            onGoToHome={handleGoToHomeFromBook}
          />
        );
      case 'authors':
        return (
          <AuthorPage // Changed from AuthorContentPage to AuthorPage
            authToken={authToken}
            onGoToHome={handleGoToHomeFromAuthor}
          />
        );
      case 'categories':
        return (
          <CategoryPage // Changed from CategoryContentPage to CategoryPage
            authToken={authToken}
            onGoToHome={handleGoToHomeFromCategory}
          />
        );
      default:
        return <HomePage onGoToLogin={goToLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col items-center p-4 font-sans antialiased">
      <Navbar
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        onGoToLogin={goToLogin}
        onLogout={handleLogout}
        onToggleSideNav={toggleSideNav}
        onGoToHome={goToHome}
      />

      {/* Side Navigation */}
      {isAuthenticated && (
        <SideNav
          isOpen={isSideNavOpen}
          onClose={() => setIsSideNavOpen(false)}
          onNavigateToGridContent={goToGridContent}
          onNavigateToBookContent={goToBookContent}
          onNavigateToAuthorContent={goToAuthorContent}
          onNavigateToCategoryContent={goToCategoryContent}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center w-full">
        {renderContent()} {/* Renders the appropriate page content */}
      </div>
    </div>
  );
}

export default App;
