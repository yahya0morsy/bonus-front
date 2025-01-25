import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component
import QRCodeScanner from '../src/qr.jsx'; // Import the QRCodeScanner component

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
  const [showScanner, setShowScanner] = useState(false); // State to toggle QR scanner

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

  // Handle QR code scan
  const handleScan = (data) => {
    setUsername(data); // Set the scanned data as the username
    setShowScanner(false); // Hide the scanner after successful scan
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
              {showMasterKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">User Details</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200"
              placeholder="Enter username"
            />
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200"
            >
              Scan QR
            </button>
          </div>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 mt-4"
            placeholder="Enter phone number"
          />
        </div>

        {/* QR Code Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg mx-4 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">Scan QR Code</h3>
              <div className="w-full h-auto max-w-sm mx-auto">
                <QRCodeScanner onScan={handleScan} />
              </div>
              <button
                onClick={() => setShowScanner(false)}
                className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-500 active:scale-95 transition-all duration-200"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}

        {/* Fetch Balance Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
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
              {showNewPassword ? 'Hide' : 'Show'}
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