import React from 'react';

export function VHSOverlay() {
  return (
    <>
      <div className="vhs-overlay pointer-events-none fixed inset-0 z-50 opacity-10"></div>
      <div className="scanlines pointer-events-none fixed inset-0 z-40"></div>
      <div className="chromatic-aberration pointer-events-none fixed inset-0 z-30"></div>
    </>
  );
}
