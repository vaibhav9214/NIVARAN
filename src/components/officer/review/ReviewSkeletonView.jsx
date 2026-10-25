import React from 'react';

export default function ReviewSkeletonView() {
  return (
    <div className="flex flex-col gap-space-lg animate-pulse w-full">
      <div className="h-24 bg-surface-container rounded-lg w-full"></div>
      <div className="grid grid-cols-12 gap-space-lg">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-space-lg">
          <div className="h-64 bg-surface-container rounded-lg w-full"></div>
          <div className="h-44 bg-surface-container rounded-lg w-full"></div>
          <div className="h-72 bg-surface-container rounded-lg w-full"></div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-space-lg">
          <div className="h-96 bg-surface-container rounded-lg w-full"></div>
          <div className="h-48 bg-surface-container rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
}
