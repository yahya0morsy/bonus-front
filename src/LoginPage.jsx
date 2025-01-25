import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

const backendUrl = 'https://bonus-back.vercel.app';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false); // Add showPassword state
  const navigate = useNavigate();

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      const sessionKey = localStorage.getItem('sessionKey');

      if (sessionKey) {
        setLoading(true); // Start loading
        try {
          // Check if the session key is valid
          const response = await axios.post(`${backendUrl}/validate-session`, {
            key: sessionKey,
          });

          if (response.data.isValid) {
            // Redirect to the balance page if the session is valid
            navigate('/balance');
          } else {
            // Clear the invalid session key
            localStorage.removeItem('sessionKey');
          }
        } catch (error) {
          console.error('Error checking session:', error);
          localStorage.removeItem('sessionKey'); // Clear the session key on error
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the username and password are both "admin"
    if (username === 'admin' && password === 'admin') {
      // Redirect to the Master Page
      navigate('/master');
      return; // Exit the function early
    }

    setLoading(true); // Start loading
    setError(''); // Clear any previous errors

    try {
      const response = await axios.post(`${backendUrl}/login`, {
        username,
        password,
      });

      // Save session key (for future requests)
      localStorage.setItem('sessionKey', response.data.key);

      // Redirect to the balance page
      navigate('/balance');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      {/* Show LoadingSpinner when loading is true */}
      {loading && <LoadingSpinner />}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${loading ? 'opacity-50' : ''}`} // Dim the label during loading
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              required
              disabled={loading} // Disable input during loading
            />
          </div>
          <div className="mb-6 relative">
            <label
              className={`block text-sm font-medium mb-2 ${loading ? 'opacity-50' : ''}`} // Dim the label during loading
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle input type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
              required
              disabled={loading} // Disable input during loading
            />
            {/* Toggle button to show/hide password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300 mt-7 disabled:opacity-50"
              disabled={loading} // Disable button during loading
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 mb-4 disabled:opacity-50"
            disabled={loading} // Disable the button when loading
          >
            {loading ? 'Logging in...' : 'Login'} {/* Change button text when loading */}
          </button>

          {/* Register Button */}
          <button
            onClick={() => navigate('/register')} // Redirect to the Register page
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
            disabled={loading} // Disable the button when loading
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;