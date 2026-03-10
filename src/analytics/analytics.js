/**
 * Google Analytics 4 - Event Tracking Helper
 * Reusable utility for tracking custom events in GA4
 */

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - The name of the event to track
 * @param {Object} parameters - Additional parameters for the event (optional)
 * 
 * Example usage:
 * trackEvent('timer_started', { duration: 25 });
 * trackEvent('quiz_completed', { score: 95, topic: 'vocabulary' });
 */
export const trackEvent = (eventName, parameters = {}) => {
  // Check if gtag is available (will be loaded from GA4 script)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  } else {
    console.warn('GA4 gtag not yet available. Event tracking skipped:', eventName);
  }
};

/**
 * Track a page view
 * This is typically called automatically by the GA4 script,
 * but can be used for manual page view tracking
 * @param {string} pageTitle - The title of the page
 * @param {string} pagePath - The path of the page (optional)
 */
export const trackPageView = (pageTitle, pagePath = window.location.pathname) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', window.GA_MEASUREMENT_ID, {
      page_title: pageTitle,
      page_path: pagePath,
    });
  }
};

/**
 * Initialize GA4 analytics
 * This is called automatically when the gtag.js script loads,
 * but can be used for additional initialization if needed
 */
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('GA4 Analytics initialized successfully');
  }
};

export default {
  trackEvent,
  trackPageView,
  initializeAnalytics,
};
