import React from 'react';

export function LoadingGlitch() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="glitch-text text-red-600 animate-pulse">
        LOADING...
      </div>
    </div>
  );
}
