import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeModal = ({ username }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Button to open the modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Show QR Code
      </button>

      {/* Modal for displaying the QR code */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Scan QR Code</h2>
            <div className="mb-4">
              <QRCode value={username} size={200} /> {/* Generate QR code for the username */}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeModal;