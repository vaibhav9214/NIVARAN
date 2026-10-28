import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 space-y-4 border border-outline-variant/20 shadow-sm">
      <div className="h-6 bg-surface-container rounded-md w-1/4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-12 bg-surface-container-low rounded-lg w-full animate-pulse"></div>
        <div className="h-12 bg-surface-container rounded-lg w-full animate-pulse"></div>
        <div className="h-12 bg-surface-container-low rounded-lg w-full animate-pulse"></div>
        <div className="h-12 bg-surface-container rounded-lg w-full animate-pulse"></div>
        <div className="h-12 bg-surface-container-low rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  );
}
