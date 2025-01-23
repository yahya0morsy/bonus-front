import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

function LoadingSpinner() {
  const spinnerRef = useRef(null);

  useEffect(() => {
    // Anime.js animation
    anime({
      targets: spinnerRef.current,
      rotate: '360deg',
      duration: 1000,
      loop: true,
      easing: 'linear',
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={spinnerRef}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      ></div>
    </div>
  );
}

export default LoadingSpinner;