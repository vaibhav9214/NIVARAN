import React from 'react';

export default function DetailsSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      <div className="h-6 w-48 bg-surface-container-high rounded"></div>
      <div className="h-10 w-3/4 bg-surface-container-high rounded"></div>
      <div className="h-32 bg-surface-container-lowest rounded-xl p-6 space-y-4 border border-outline-variant/30">
        <div className="h-4 bg-surface-container-high rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-12 bg-surface-container-high rounded"></div>
          <div className="h-12 bg-surface-container-high rounded"></div>
          <div className="h-12 bg-surface-container-high rounded"></div>
          <div className="h-12 bg-surface-container-high rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="h-64 bg-surface-container-lowest rounded-xl border border-outline-variant/30"></div>
          <div className="h-96 bg-surface-container-lowest rounded-xl border border-outline-variant/30"></div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="h-48 bg-surface-container-lowest rounded-xl border border-outline-variant/30"></div>
          <div className="h-56 bg-surface-container-lowest rounded-xl border border-outline-variant/30"></div>
        </div>
      </div>
    </div>
  );
}
