import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRCodeScanner = ({ onScan }) => {
  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner('qr-scanner', {
      qrbox: 250, // Size of the scanning box
      fps: 5, // Frames per second
    });

    // Render the scanner
    scanner.render((data) => {
      onScan(data); // Pass the scanned data to the parent component
      scanner.clear(); // Stop the scanner after a successful scan
    });

    // Cleanup function
    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return <div id="qr-scanner" style={{ width: '100%' }} />;
};

export default QRCodeScanner;