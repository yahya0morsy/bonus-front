import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after registration
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

const backendUrl = 'https://bonus-back.vercel.app';

function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!username || !password || !phoneNumber) {
      setError('Username, password, and phone number are required.');
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Show confirmation modal
    setShowConfirmationModal(true);
  };

  // Handle confirmation for registration
  const confirmRegistration = async () => {
    setShowConfirmationModal(false); // Close the modal
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/users`, {
        displayName,
        username,
        password,
        phoneNumber,
      });

      setSuccess('Registration successful! Redirecting to login...');
      setError('');

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 relative">
      {/* Show the LoadingSpinner when loading is true */}
      {loading && <LoadingSpinner />}

      {/* Semi-transparent overlay when loading */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      <div className="max-w-md mx-auto relative">
        {/* Disable all interactions when loading */}
        <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-100">Register</h1>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center">
              {success}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
                placeholder="Enter display name (optional)"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300"
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
                  placeholder="Confirm password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300"
                  disabled={loading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
                placeholder="Enter phone number"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Link to Login Page */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <a
                href="/"
                className="text-blue-500 hover:text-blue-400 transition duration-200"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-100">Important Notice</h3>
            <p className="text-gray-300 mb-6">
              By proceeding, you acknowledge that:
              <br />
              - You cannot change your data after signing up.
              <br />
              - You cannot recover your password if you forget it.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmRegistration}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={loading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;