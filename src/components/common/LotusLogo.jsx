import React from 'react';

export default function LotusLogo({ className = "w-8 h-8", primaryColor = "#003F2B", petalColor = "#21845B", accentColor = "#AAF1D0", baseColor = "#006C47" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        className="w-full h-full drop-shadow-sm overflow-visible"
        fill="none"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Central Apex Beacon Point */}
        <circle className="animate-pulse" cx="50" cy="27" fill={accentColor} r="2.8" />
        
        {/* Central Spire Petal */}
        <path
          d="M50 14 C48 24, 44 38, 44 54 C44 68, 50 74, 50 74 C50 74, 56 68, 56 54 C56 38, 52 24, 50 14 Z"
          fill={primaryColor}
        />
        
        {/* Inner Left Petal */}
        <path
          d="M44 38 C39 42, 35 50, 36 64 C37 70, 42 75, 47 78 C44 72, 42 62, 43 50 C43 45, 44 41, 44 38 Z"
          fill={petalColor}
          opacity="0.95"
        />
        
        {/* Inner Right Petal */}
        <path
          d="M56 38 C61 42, 65 50, 64 64 C63 70, 58 75, 53 78 C56 72, 58 62, 57 50 C57 45, 56 41, 56 38 Z"
          fill={petalColor}
          opacity="0.95"
        />
        
        {/* Outer Left Shield Petal */}
        <path
          d="M40 48 C30 50, 22 58, 23 71 C24 81, 33 85, 42 85 C34 81, 30 73, 33 63 C35 56, 38 52, 40 48 Z"
          fill={primaryColor}
        />
        
        {/* Outer Right Shield Petal */}
        <path
          d="M60 48 C70 50, 78 58, 77 71 C76 81, 67 85, 58 85 C66 81, 70 73, 67 63 C65 56, 62 52, 60 48 Z"
          fill={primaryColor}
        />
        
        {/* Bottom Foundation Base Arc */}
        <path
          d="M36 83 C45 89, 55 89, 64 83 C59 87, 41 87, 36 83 Z"
          fill={baseColor}
        />
        <path
          d="M43 89 C48 93, 52 93, 57 89 C54 91.5, 46 91.5, 43 89 Z"
          fill={primaryColor}
        />
      </svg>
    </div>
  );
}
