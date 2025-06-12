// Date manager to handle user-provided current date
class DateManager {
  constructor() {
    this.currentDate = null;
    this.isInitialized = false;
  }

  setCurrentDate(date) {
    this.currentDate = new Date(date);
    this.currentDate.setHours(0, 0, 0, 0);
    this.isInitialized = true;
    localStorage.setItem('userCurrentDate', this.currentDate.toISOString());
    localStorage.setItem('dateManagerInitialized', 'true');
  }

  getCurrentDate() {
    if (!this.currentDate && !this.isInitialized) {
      const stored = localStorage.getItem('userCurrentDate');
      const initialized = localStorage.getItem('dateManagerInitialized');
      
      if (stored && initialized === 'true') {
        this.currentDate = new Date(stored);
        this.currentDate.setHours(0, 0, 0, 0);
        this.isInitialized = true;
      }
    }
    return this.currentDate;
  }

  clearCurrentDate() {
    this.currentDate = null;
    this.isInitialized = false;
    localStorage.removeItem('userCurrentDate');
    localStorage.removeItem('dateManagerInitialized');
  }

  isDateSet() {
    return this.getCurrentDate() !== null && this.isInitialized;
  }

  // Force re-initialization (useful for testing or manual reset)
  forceReset() {
    this.clearCurrentDate();
  }
}

export const dateManager = new DateManager();