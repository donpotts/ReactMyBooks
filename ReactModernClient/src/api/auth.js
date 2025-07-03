// src/api/auth.js
const API_BASE_URL = 'https://localhost:5026';

export async function loginUser(email, password) {
  const RADENDPOINT_LOGIN_URL = `${API_BASE_URL}/identity/login`;

  try {
    const response = await fetch(RADENDPOINT_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Login Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Login failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Login successful!',
        token: data?.accessToken,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Login failed. Please check credentials.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during login call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the login server. Ensure it is running and accessible.'
    };
  }
}

export async function validateToken(token) {
  const RADENDPOINT_VALIDATE_TOKEN_URL = `${API_BASE_URL}/identity/validate-token`;

  if (!token) {
    return { success: false, message: "No token provided for validation." };
  }

  try {
    const response = await fetch(RADENDPOINT_VALIDATE_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Token validation succeeded but response was not valid JSON: ${parseError.message}` };
            }
        } else {
            return { success: true, message: "Token validated successfully (empty response)." };
        }
    } else {
      let errorMessage = `Token validation failed with status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during token validation call:', error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the validation server.'}` };
  }
}

export async function registerUser(email, password) {
  const RADENDPOINT_REGISTER_URL = `${API_BASE_URL}/identity/register`;

  try {
    const response = await fetch(RADENDPOINT_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Register User Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Registration failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Registration successful!',
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Registration failed.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during registration call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the registration server. Ensure it is running and accessible.'
    };
  }
}

export async function getBooks(token) {
  const BOOKS_API_URL = `${API_BASE_URL}/api/book`;
  console.log('API: Fetching books with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(BOOKS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse books data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch books: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch books. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during books call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the books server.'}`
    };
  }
}

export async function getBookById(token, bookId) {
  const BOOK_BY_ID_API_URL = `${API_BASE_URL}/api/book/${bookId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!bookId) {
    return { success: false, message: "No book ID provided." };
  }

  try {
    const response = await fetch(BOOK_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse book data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch book: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch book with ID ${bookId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get book by ID (${bookId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the book server.'}` };
  }
}

export async function createBook(authToken, bookData) {
  const BOOKS_API_URL = `${API_BASE_URL}/api/book`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(BOOKS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(bookData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Book created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Book Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create book: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Book created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create book.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create book call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the book creation server.'}`
    };
  }
}

export async function updateBook(token, bookId, updatedBookData) {
  const BOOK_UPDATE_URL = `${API_BASE_URL}/api/book/${bookId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', BOOK_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedBookData, null, 2));

  try {
    const getResult = await getBookById(token, bookId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing book for update: ${getResult.message}` };
    }
    const existingBook = getResult.data;

    const finalUpdatePayload = {
      ...existingBook,
      ...updatedBookData,
      id: bookId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(BOOK_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Book updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Book Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Book updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Book updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update book. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update book call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the book update server.'}`
    };
  }
}

export async function deleteBook(token, bookId) {
  const BOOK_DELETE_URL = `${API_BASE_URL}/api/book/${bookId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(BOOK_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Book deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Book Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Book deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Book deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete book. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete book call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the book delete server.'}`
    };
  }
}
export async function getAuthors(token) {
  const AUTHORS_API_URL = `${API_BASE_URL}/api/author`;
  console.log('API: Fetching authors with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(AUTHORS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse authors data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch authors: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch authors. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during authors call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the authors server.'}`
    };
  }
}

export async function getAuthorById(token, authorId) {
  const AUTHOR_BY_ID_API_URL = `${API_BASE_URL}/api/author/${authorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!authorId) {
    return { success: false, message: "No author ID provided." };
  }

  try {
    const response = await fetch(AUTHOR_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse author data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch author: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch author with ID ${authorId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get author by ID (${authorId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the author server.'}` };
  }
}

export async function createAuthor(authToken, authorData) {
  const AUTHORS_API_URL = `${API_BASE_URL}/api/author`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(AUTHORS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(authorData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Author created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Author Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create author: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Author created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create author.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create author call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the author creation server.'}`
    };
  }
}

export async function updateAuthor(token, authorId, updatedAuthorData) {
  const AUTHOR_UPDATE_URL = `${API_BASE_URL}/api/author/${authorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', AUTHOR_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedAuthorData, null, 2));

  try {
    const getResult = await getAuthorById(token, authorId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing author for update: ${getResult.message}` };
    }
    const existingAuthor = getResult.data;

    const finalUpdatePayload = {
      ...existingAuthor,
      ...updatedAuthorData,
      id: authorId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(AUTHOR_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Author updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Author Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Author updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Author updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update author. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update author call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the author update server.'}`
    };
  }
}

export async function deleteAuthor(token, authorId) {
  const AUTHOR_DELETE_URL = `${API_BASE_URL}/api/author/${authorId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(AUTHOR_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Author deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Author Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Author deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Author deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete author. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete author call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the author delete server.'}`
    };
  }
}
export async function getCategories(token) {
  const CATEGORIES_API_URL = `${API_BASE_URL}/api/category`;
  console.log('API: Fetching categories with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse categories data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch categories: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch categories. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during categories call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the categories server.'}`
    };
  }
}

export async function getCategoryById(token, categoryId) {
  const CATEGORY_BY_ID_API_URL = `${API_BASE_URL}/api/category/${categoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!categoryId) {
    return { success: false, message: "No category ID provided." };
  }

  try {
    const response = await fetch(CATEGORY_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse category data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch category: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch category with ID ${categoryId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get category by ID (${categoryId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the category server.'}` };
  }
}

export async function createCategory(authToken, categoryData) {
  const CATEGORIES_API_URL = `${API_BASE_URL}/api/category`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CATEGORIES_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Category created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Category Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create category: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Category created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create category.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the category creation server.'}`
    };
  }
}

export async function updateCategory(token, categoryId, updatedCategoryData) {
  const CATEGORY_UPDATE_URL = `${API_BASE_URL}/api/category/${categoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', CATEGORY_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedCategoryData, null, 2));

  try {
    const getResult = await getCategoryById(token, categoryId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing category for update: ${getResult.message}` };
    }
    const existingCategory = getResult.data;

    const finalUpdatePayload = {
      ...existingCategory,
      ...updatedCategoryData,
      id: categoryId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(CATEGORY_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Category updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Category updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Category updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the category update server.'}`
    };
  }
}

export async function deleteCategory(token, categoryId) {
  const CATEGORY_DELETE_URL = `${API_BASE_URL}/api/category/${categoryId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CATEGORY_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Category deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Category Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Category deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Category deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete category. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete category call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the category delete server.'}`
    };
  }
}
