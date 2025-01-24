import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after registration
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

const backendUrl = 'https://bonus-back.vercel.app';

function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !phoneNumber) {
      setError('Username, password, and phone number are required.');
      return;
    }

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
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Show the LoadingSpinner when loading is true */}
      {loading && <LoadingSpinner />}

      <div className="max-w-md mx-auto">
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
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
              placeholder="Enter password"
              required
            />
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
  );
}

export default RegisterPage;