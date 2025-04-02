"use client"

// Re-export all skeleton components for PastEvent
export * from './PastEventSkeletons'
export { EventSwiper } from './EventSwiper'

// Constants for consistent loading timeouts
export const LOADING_TIMEOUT = 800
export const CONTENT_LOADING_TIMEOUT = LOADING_TIMEOUT / 2