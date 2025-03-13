"use client"

// Re-export all skeleton components from their respective files
export * from './MainSkeletons'
export * from './ScheduleSkeletons'
export * from './PageSkeletons'

// Constants for consistent loading timeouts
export const LOADING_TIMEOUT = 800
export const CONTENT_LOADING_TIMEOUT = LOADING_TIMEOUT / 2 