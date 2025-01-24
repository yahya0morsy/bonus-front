import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../src/LoadingSpinner';
import QRCodeScanner from '../src/qr.jsx'; // Import the QRCodeScanner component

const backendUrl = 'https://bonus-back.vercel.app';

function BalancePage() {
  const [balance, setBalance] = useState(null);
  const [grade, setGrade] = useState(null);
  const [showTransferFields, setShowTransferFields] = useState(false);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false); // State to toggle QR scanner
  const [messages, setMessages] = useState([]); // State to store user messages
  const navigate = useNavigate();

  // Fetch user balance, grade, and messages
  const fetchUserData = async () => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Fetch balance and grade
      const balanceResponse = await axios.post(`${backendUrl}/users/balance`, {
        key: sessionKey,
      });
      setBalance(balanceResponse.data.accountBalance);
      setGrade(balanceResponse.data.grade);

      // Fetch user messages
      const messagesResponse = await axios.post(`${backendUrl}/users/messages`, {
        key: sessionKey,
      });
      setMessages(messagesResponse.data.messages);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  // Handle balance transfer
  const handleTransfer = async () => {
    const sessionKey = localStorage.getItem('sessionKey');
    if (!sessionKey) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/users/transfer-balance`, {
        senderKey: sessionKey,
        recipientUsername,
        amount: parseFloat(amount),
      });

      setSuccess(`Successfully transferred ${amount} bonus points to ${recipientUsername}.`);
      setError('');
      setRecipientUsername('');
      setAmount('');
      setShowTransferFields(false);
      setShowConfirmation(false);

      // Refresh user data after transfer
      await fetchUserData();
    } catch (error) {
      setError(error.response?.data?.error || 'Transfer failed. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    await fetchUserData();
  };

  // Handle QR code scan
  const handleScan = (data) => {
    setRecipientUsername(data); // Set the scanned data as the recipient username
    setShowScanner(false); // Hide the scanner after successful scan
  };

  // Format time in 12-hour format
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  // Format date in a readable format (e.g., "Oct 5, 2023")
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
      {/* Center Box */}
      <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md mx-4 text-center relative">
        {/* Profile Button */}
        <button
          onClick={() => navigate('/about')}
          className="absolute top-4 right-4 bg-blue-600 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all duration-200 text-sm sm:text-md"
        >
          Profile
        </button>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-100">Your Balance</h2>
        {error && <p className="text-red-500 text-xs sm:text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-xs sm:text-sm mb-4">{success}</p>}
        <div className="space-y-4 mb-6">
          <p className="text-lg md:text-xl text-gray-300">
            Balance: <span className="font-semibold text-green-400">{balance} <span className="text-sm md:text-md text-white">Bonus points</span></span>
          </p>
          <p className="text-lg md:text-xl text-gray-300">
            Grade: <span className="font-semibold text-gray-100">{grade}</span>
          </p>
        </div>

        {!showTransferFields ? (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowTransferFields(true)}
              className="w-auto bg-gray-700 text-white py-2 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200 text-sm sm:text-md md:text-lg"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Send Bonus'}
            </button>
            <button
              onClick={handleRefresh}
              className="w-auto bg-gray-700 text-white py-2 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200 text-sm sm:text-md md:text-lg"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmation(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">Recipient Username or phoneNumber</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  className="w-full px-3 py-1 md:py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-gray-500 text-gray-200 text-xs sm:text-sm"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-gray-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
                  disabled={loading}
                >
                  Scan QR
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-1 md:py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:border-gray-500 text-gray-200 text-xs sm:text-sm"
                required
                disabled={loading}
              />
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="submit"
                className="w-1/2 md:w-auto bg-gray-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Confirm Transfer'}
              </button>
              <button
                type="button"
                onClick={() => setShowTransferFields(false)}
                className="w-1/2 md:w-auto bg-gray-600 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-500 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

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
                className="mt-4 bg-gray-600 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-500 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}

        {/* Transfer Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md mx-4 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">Are you sure?</h3>
              <p className="mb-6 text-gray-300 text-xs sm:text-sm">
                You are about to transfer <strong className="text-gray-100">{amount} bonus</strong> to{' '}
                <strong className="text-gray-100">{recipientUsername}</strong>. This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleTransfer}
                  className="w-1/2 md:w-auto bg-gray-700 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Yes, Transfer'
                  )}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="w-1/2 md:w-auto bg-gray-600 text-white py-1 px-3 md:py-2 md:px-4 rounded-xl shadow-md hover:bg-gray-500 active:scale-95 transition-all duration-200 text-xs sm:text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && <LoadingSpinner />}
      </div>

      {/* Messages Section (Under the Balance Box) */}
      <div className="w-full max-w-md mx-4 mt-6">
        <h3 className="text-md md:text-lg mb-4 text-gray-100 text-center">Messages</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} className="bg-transparent p-3 rounded-xl text-left text-xs sm:text-sm">
                <p className="text-gray-200">{message.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {formatDate(message.date)} at {formatTime(message.date)} {/* Display date and time */}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm text-center">No messages found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalancePage;