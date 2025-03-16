import { useState, useCallback, useRef, useEffect } from "react";
import { SHARE_SUCCESS_TIMEOUT } from "./constants";

// Custom hooks for sharing event
export const useShareEvent = (event) => {
  const [shareSuccess, setShareSuccess] = useState(false);

  // Improved clipboard handling with error feedback
  const copyToClipboard = useCallback((title, url) => {
    const shareText = `${title} - ${url}`;
    
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
        })
        .catch((err) => {
          console.error("Could not copy text:", err);
          // Fallback for clipboard API failure
          fallbackCopyToClipboard(shareText);
        });
    } else {
      // Fallback for browsers without clipboard API
      fallbackCopyToClipboard(shareText);
    }
  }, []);

  // Fallback clipboard method using document.execCommand
  const fallbackCopyToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      
      if (successful) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
      }
    } catch (err) {
      console.error("Fallback clipboard copy failed:", err);
    }
  };

  // Enhanced share handler with better error handling
  const handleShare = useCallback(() => {
    if (!event) return;

    const shareUrl = `${window.location.origin}/techelonsregistration?eventId=${event.id}`;
    const shareTitle = `Check out this event: ${event.name} at Techelons 2025`;

    if (navigator.share) {
      navigator
        .share({
          title: event.name,
          text: shareTitle,
          url: shareUrl,
        })
        .then(() => {
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), SHARE_SUCCESS_TIMEOUT);
        })
        .catch((err) => {
          // Only use clipboard fallback for AbortError (user cancelled)
          // or if the share API is not available
          if (err.name !== "AbortError") {
            copyToClipboard(shareTitle, shareUrl);
          }
        });
    } else {
      copyToClipboard(shareTitle, shareUrl);
    }
  }, [event, copyToClipboard]);

  return { handleShare, shareSuccess };
};

// Custom hook for responsive image handling
export const useImageHandling = () => {
  const [imageState, setImageState] = useState({
    error: false,
    loading: true,
    height: "auto",
  });

  // Use ResizeObserver for more efficient resize handling
  const resizeObserverRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    // Use ResizeObserver for better performance
    if (typeof window !== "undefined" && typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(
        // Use debounce to limit updates
        debounce((entries) => {
          const width = entries[0]?.contentRect.width || window.innerWidth;
          setWindowWidth(width);
        }, 100)
      );
      
      resizeObserver.observe(document.body);
      resizeObserverRef.current = resizeObserver;
      
      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
      };
    } else {
      // Fallback to window resize event
      const handleResize = debounce(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
      
      window.addEventListener("resize", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Debounce function to limit execution frequency
  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  // Improved image load handler with better responsive sizing
  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    const aspectRatio = naturalWidth / naturalHeight;
    
    // Responsive height calculation based on screen size and aspect ratio
    let maxHeight;
    
    if (windowWidth < 640) {
      // Mobile
      maxHeight = aspectRatio > 1.5 ? "12rem" : "14rem";
    } else if (windowWidth < 768) {
      // Small tablets
      maxHeight = aspectRatio > 1.5 ? "14rem" : "16rem";
    } else if (windowWidth < 1024) {
      // Tablets
      maxHeight = aspectRatio > 1.5 ? "16rem" : "18rem";
    } else if (windowWidth < 1280) {
      // Small desktops
      maxHeight = aspectRatio > 1.5 ? "18rem" : "20rem";
    } else {
      // Large desktops
      maxHeight = aspectRatio > 1.5 ? "20rem" : "24rem";
    }

    setImageState({
      error: false,
      loading: false,
      height: maxHeight,
    });
  }, [windowWidth]);

  const handleImageError = useCallback(() => {
    setImageState((prev) => ({
      ...prev,
      error: true,
      loading: false,
      height: windowWidth < 640 ? "12rem" : windowWidth < 1024 ? "16rem" : "20rem",
    }));
  }, [windowWidth]);

  const resetImage = useCallback(() => {
    setImageState({
      error: false,
      loading: true,
      height: "auto",
    });
  }, []);

  return {
    imageError: imageState.error,
    imageLoading: imageState.loading,
    imageHeight: imageState.height,
    handleImageLoad,
    handleImageError,
    resetImage,
  };
}; 