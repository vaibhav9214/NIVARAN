import React from 'react';

export default function FilterEmptyState({ onResetFilters }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 border border-outline-variant/20 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
        <span className="material-symbols-outlined text-[36px]">manage_search</span>
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          No grievances match your selected filters
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          We couldn't find any grievance filings matching your keyword query or dropdown combination.
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-all cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          <span>Clear All Filters</span>
        </button>
      </div>
    </div>
  );
}
