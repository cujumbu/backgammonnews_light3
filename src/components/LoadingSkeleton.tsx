import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <Skeleton height={200} />
      </div>
      <Skeleton width={100} className="mb-4" />
      <Skeleton height={24} className="mb-2" />
      <Skeleton height={24} width="80%" className="mb-4" />
      <Skeleton count={3} className="mb-2" />
      <div className="flex justify-between mt-4">
        <Skeleton width={100} />
        <Skeleton width={80} />
      </div>
    </div>
  );
}

export function FeaturedNewsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton height={400} />
        <div>
          <Skeleton width={150} className="mb-4" />
          <Skeleton height={36} className="mb-2" />
          <Skeleton height={36} width="90%" className="mb-4" />
          <Skeleton count={4} className="mb-2" />
          <div className="flex justify-between mt-6">
            <Skeleton width={120} />
            <Skeleton width={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
