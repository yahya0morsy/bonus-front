import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

const backendUrl = 'https://bonus-back.vercel.app';

function MasterPage() {
  const [masterKey, setMasterKey] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [balance, setBalance] = useState(null);
  const [grade, setGrade] = useState(null);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('add'); // 'add' or 'subtract'
  const [newGrade, setNewGrade] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false); // Toggle for master key visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for new password visibility

  // Fetch user balance and grade
  const fetchBalance = async () => {
    if (!masterKey || (!username && !phoneNumber)) {
      setError('Master key and username/phone number are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/users/view-balance`, {
        masterKey,
        username,
        phoneNumber,
      });
      setBalance(response.data.accountBalance);
      setGrade(response.data.grade);
      setError('');
      setSuccess('Balance fetched successfully.');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch balance.');
      setBalance(null);
      setGrade(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user balance
  const updateBalance = async () => {
    if (!masterKey || (!username && !phoneNumber) || !amount || !action) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/users/update-balance`, {
        masterKey,
        username,
        phoneNumber,
        amount: parseFloat(amount),
        action,
      });
      setSuccess(`Balance updated successfully. New balance: $${response.data.accountBalance}`);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update balance.');
    } finally {
      setLoading(false);
    }
  };

  // Update user grade
  const updateGrade = async () => {
    if (!masterKey || (!username && !phoneNumber) || !newGrade) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/users/update-grade`, {
        masterKey,
        username,
        phoneNumber,
        grade: newGrade,
      });
      setGrade(response.data.account.grade);
      setError('');
      setSuccess('Grade updated successfully.');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update grade.');
    } finally {
      setLoading(false);
    }
  };

  // Update user password (admin)
  const updatePasswordAdmin = async () => {
    if (!masterKey || !username || !newPassword) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/users/admin/update-password`, {
        masterKey,
        username,
        newPassword,
      });
      setError('');
      setSuccess('Password updated successfully.');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Show the LoadingSpinner when loading is true */}
      {loading && <LoadingSpinner />}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-100">Master Dashboard</h1>

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

        {/* Master Key Input */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Master Key</h2>
          <div className="relative">
            <input
              type={showMasterKey ? 'text' : 'password'} // Toggle input type
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
              placeholder="Enter master key"
              required
            />
            {/* Toggle button for master key */}
            <button
              type="button"
              onClick={() => setShowMasterKey(!showMasterKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300"
            >
              {showMasterKey ? (
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
        </div>

        {/* User Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">User Details</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 mb-4"
              placeholder="Enter username"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
              placeholder="Enter phone number"
            />
          </div>

          {/* Fetch Balance Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Fetch Balance</h2>
            <button
              onClick={fetchBalance}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Balance'}
            </button>
            {balance !== null && (
              <div className="mt-4">
                <p className="text-gray-300">Balance: <span className="font-semibold text-gray-100">${balance}</span></p>
                <p className="text-gray-300">Grade: <span className="font-semibold text-gray-100">{grade}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Update Balance Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Update Balance</h2>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 mb-4"
            placeholder="Enter amount"
            required
          />
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setAction('add')}
              className={`w-1/2 py-2 px-4 rounded-lg transition duration-200 ${
                action === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Add
            </button>
            <button
              onClick={() => setAction('subtract')}
              className={`w-1/2 py-2 px-4 rounded-lg transition duration-200 ${
                action === 'subtract' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Subtract
            </button>
          </div>
          <button
            onClick={updateBalance}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Balance'}
          </button>
        </div>

        {/* Update Grade Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Update Grade</h2>
          <input
            type="text"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 mb-4"
            placeholder="Enter new grade"
            required
          />
          <button
            onClick={updateGrade}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Grade'}
          </button>
        </div>

        {/* Update Password Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">Update Password</h2>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'} // Toggle input type
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 mb-4"
              placeholder="Enter new password"
              required
            />
            {/* Toggle button for new password */}
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? (
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
            onClick={updatePasswordAdmin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MasterPage;