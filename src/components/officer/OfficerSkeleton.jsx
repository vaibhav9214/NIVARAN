import React from 'react';

export default function OfficerSkeleton() {
  return (
    <div className="flex flex-col gap-space-lg w-full" id="skeleton-view">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm animate-pulse border border-outline-variant/30">
            <div className="h-6 bg-surface-container-high rounded w-48 mb-4"></div>
            <div className="h-10 bg-surface-container-low rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-surface-container-low rounded"></div>
              <div className="h-12 bg-surface-container-low rounded"></div>
              <div className="h-12 bg-surface-container-low rounded"></div>
              <div className="h-12 bg-surface-container-low rounded"></div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm animate-pulse h-72 border border-outline-variant/30"></div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm animate-pulse h-64 border border-outline-variant/30"></div>
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm animate-pulse h-80 border border-outline-variant/30"></div>
        </div>
      </div>
    </div>
  );
}
