// components/SkeletonLoader.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SkeletonLoader: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-amber-100 flex items-center justify-center z-50">
      <div className="w-32 h-32 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>,
    document.body
  );
};

export default SkeletonLoader;
