// Date manager to handle user-provided current date
class DateManager {
  constructor() {
    this.currentDate = null;
    this.isInitialized = false;
    this.sessionId = null;
  }

  setCurrentDate(date) {
    this.currentDate = new Date(date);
    this.currentDate.setHours(0, 0, 0, 0);
    this.isInitialized = true;
    
    // Create a new session ID when date is set
    this.sessionId = Date.now().toString();
    
    // Store in sessionStorage instead of localStorage to ensure fresh prompt on each session
    sessionStorage.setItem('userCurrentDate', this.currentDate.toISOString());
    sessionStorage.setItem('dateManagerInitialized', 'true');
    sessionStorage.setItem('sessionId', this.sessionId);
  }

  getCurrentDate() {
    if (!this.currentDate && !this.isInitialized) {
      const stored = sessionStorage.getItem('userCurrentDate');
      const initialized = sessionStorage.getItem('dateManagerInitialized');
      const storedSessionId = sessionStorage.getItem('sessionId');
      
      if (stored && initialized === 'true' && storedSessionId) {
        this.currentDate = new Date(stored);
        this.currentDate.setHours(0, 0, 0, 0);
        this.isInitialized = true;
        this.sessionId = storedSessionId;
      }
    }
    return this.currentDate;
  }

  clearCurrentDate() {
    this.currentDate = null;
    this.isInitialized = false;
    this.sessionId = null;
    sessionStorage.removeItem('userCurrentDate');
    sessionStorage.removeItem('dateManagerInitialized');
    sessionStorage.removeItem('sessionId');
  }

  isDateSet() {
    return this.getCurrentDate() !== null && this.isInitialized;
  }

  // Force re-initialization (useful for testing or manual reset)
  forceReset() {
    this.clearCurrentDate();
  }

  // Check if this is a new session (page refresh/new tab)
  isNewSession() {
    const storedSessionId = sessionStorage.getItem('sessionId');
    return !storedSessionId || storedSessionId !== this.sessionId;
  }

  // Get current date formatted for input field (YYYY-MM-DD)
  getCurrentDateForInput() {
    const date = this.getCurrentDate();
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}

export const dateManager = new DateManager();