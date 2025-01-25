import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../src/LoadingSpinner'; // Adjust the path to your LoadingSpinner component
import { QRCodeSVG } from 'qrcode.react'; // Corrected import

const backendUrl = 'https://bonus-back.vercel.app';

function AboutPage() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false); // State for logout confirmation
  const [showPasswordChange, setShowPasswordChange] = useState(false); // State for password change modal
  const [currentPassword, setCurrentPassword] = useState(''); // Current password input
  const [newPassword, setNewPassword] = useState(''); // New password input
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // New password confirmation input
  const [passwordChangeError, setPasswordChangeError] = useState(''); // Error message for password change
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(''); // Success message for password change
  const [showQRCode, setShowQRCode] = useState(false); // State to toggle QR code display
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle for current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle for new password visibility
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false); // Toggle for confirm new password visibility
  const [isChangingPassword, setIsChangingPassword] = useState(false); // State for loading animation during password change
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const sessionKey = localStorage.getItem('sessionKey'); // Retrieve the session key from local storage

      if (!sessionKey) {
        setError('No session key found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        // Fetch user data using the session key
        const response = await axios.post(`${backendUrl}/user-data`, {
          sessionKey,
        });
        setUserData(response.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('sessionKey'); // Clear the session key
    navigate('/login'); // Redirect to the login page
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordChangeError('All fields are required.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordChangeError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }

    setIsChangingPassword(true); // Start loading animation
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    try {
      const response = await axios.post(`${backendUrl}/users/update-password`, {
        username: userData.username, // Use the username from userData
        currentPassword,
        newPassword,
      });

      setPasswordChangeSuccess(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setPasswordChangeError(error.response?.data?.error || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false); // Stop loading animation
    }
  };

  // Handle back button click
  const handleBackButtonClick = () => {
    navigate('/balance'); // Redirect to the balance page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6 flex items-center justify-center">
        <LoadingSpinner /> {/* Display the loading animation */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Responsive Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-8 text-gray-100">
          About Me
        </h1>

        {/* Responsive Back Button */}
        <button
          onClick={handleBackButtonClick}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200 mb-4 sm:mb-6 text-sm sm:text-base md:py-3 md:px-6 lg:text-lg"
        >
          Back to Balance
        </button>

        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* User Data Section */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-100">
            User Details
          </h2>
          {userData ? (
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-gray-300 text-sm sm:text-base">
                  <strong>Display Name:</strong> {userData.displayName}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm sm:text-base">
                  <strong>Username:</strong> {userData.username}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm sm:text-base">
                  <strong>Phone Number:</strong> {userData.phoneNumber}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 text-sm sm:text-base">No user data available.</p>
          )}
        </div>

        {/* QR Code Button */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => setShowQRCode(true)}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 mr-2 sm:mr-4 text-sm sm:text-base md:py-3 md:px-6 lg:text-lg"
          >
            Generate QR Code
          </button>
        </div>

        {/* QR Code Modal */}
        {showQRCode && userData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
              <div className="mb-4">
                <QRCodeSVG value={userData.username} size={200} /> {/* Use QRCodeSVG here */}
              </div>
              <button
                onClick={() => setShowQRCode(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Change Password and Logout Buttons */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => setShowPasswordChange(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 mr-2 sm:mr-4 text-sm sm:text-base md:py-3 md:px-6 lg:text-lg"
          >
            Change Password
          </button>

          {/* Always show the logout button */}
          <button
            onClick={() => setShowLogoutConfirmation(true)}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base md:py-3 md:px-6 lg:text-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md mx-4 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-100">
              Change Password
            </h3>

            {/* Error and Success Messages */}
            {passwordChangeError && (
              <div className="bg-red-500 text-white p-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
                {passwordChangeError}
              </div>
            )}
            {passwordChangeSuccess && (
              <div className="bg-green-500 text-white p-3 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base">
                {passwordChangeSuccess}
              </div>
            )}

            {/* Current Password Input */}
            <div className="mb-4 relative">
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Current Password
              </label>
              <input
                type={showCurrentPassword ? 'text' : 'password'} // Toggle input type
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 text-sm sm:text-base"
                placeholder="Enter current password"
                required
              />
              {/* Toggle button for current password */}
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300 mt-7"
              >
                {showCurrentPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* New Password Input */}
            <div className="mb-4 relative">
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'} // Toggle input type
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 text-sm sm:text-base"
                placeholder="Enter new password"
                required
              />
              {/* Toggle button for new password */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300 mt-7"
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Confirm New Password Input */}
            <div className="mb-6 relative">
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Confirm New Password
              </label>
              <input
                type={showConfirmNewPassword ? 'text' : 'password'} // Toggle input type
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-500 text-gray-200 text-sm sm:text-base"
                placeholder="Confirm new password"
                required
              />
              {/* Toggle button for confirm new password */}
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-300 mt-7"
              >
                {showConfirmNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePasswordChange}
                className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 text-sm sm:text-base flex items-center justify-center"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <LoadingSpinner /> // Show loading spinner while changing password
                ) : (
                  'Update Password'
                )}
              </button>
              <button
                onClick={() => setShowPasswordChange(false)}
                className="w-1/2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md mx-4 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-gray-100">
              Are you sure?
            </h3>
            <p className="mb-6 text-gray-300 text-sm sm:text-base">
              You are about to log out. Are you sure you want to continue?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleLogout}
                className="w-1/2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 text-sm sm:text-base"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="w-1/2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutPage;