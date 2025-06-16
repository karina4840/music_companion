import React from "react";

const PlaylistCardSkeleton = () => (
  <div className="bg-surface rounded-lg border border-border overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="aspect-square bg-surface-alt"></div>

    {/* Content Skeleton */}
    <div className="p-4 space-y-3">
      {/* Title */}
      <div className="h-4 bg-surface-alt rounded w-3/4"></div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-surface-alt rounded w-full"></div>
        <div className="h-3 bg-surface-alt rounded w-2/3"></div>
      </div>

      {/* Metadata */}
      <div className="flex justify-between">
        <div className="h-3 bg-surface-alt rounded w-16"></div>
        <div className="h-3 bg-surface-alt rounded w-12"></div>
      </div>
    </div>
  </div>
);

const LoadingState = () => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="h-12 bg-surface rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-surface rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-surface rounded w-20 animate-pulse"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <PlaylistCardSkeleton key={index} />
        ))}
      </div>

      {/* Loading Message */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-3 text-text-secondary">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading your playlists...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
