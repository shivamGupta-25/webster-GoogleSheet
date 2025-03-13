"use client"

import dynamic from 'next/dynamic'
import { memo } from 'react'

// Dynamically import the EventModal component with SSR disabled
const EventModal = dynamic(
  () => import('./EventDialog'),
  { 
    ssr: false, 
    loading: () => <LoadingDialog />
  }
)

// Separate loading component for better organization
const LoadingDialog = memo(() => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-background rounded-lg p-4 sm:p-6 shadow-lg w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] max-w-[800px] max-h-[90vh] overflow-hidden">
      <div className="animate-pulse space-y-4">
        {/* Image placeholder */}
        <div className="h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        
        {/* Title placeholder */}
        <div className="h-6 sm:h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        
        {/* Subtitle placeholder */}
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        
        {/* Content placeholders */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        
        {/* Button placeholders */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="h-10 sm:h-11 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-10 sm:h-11 flex-1 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
))

LoadingDialog.displayName = "LoadingDialog"

export default EventModal;