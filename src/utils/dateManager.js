// Date manager to handle user-provided current date
class DateManager {
  constructor() {
    this.currentDate = null;
  }

  setCurrentDate(date) {
    this.currentDate = new Date(date);
    this.currentDate.setHours(0, 0, 0, 0);
    localStorage.setItem('userCurrentDate', this.currentDate.toISOString());
  }

  getCurrentDate() {
    if (!this.currentDate) {
      const stored = localStorage.getItem('userCurrentDate');
      if (stored) {
        this.currentDate = new Date(stored);
        this.currentDate.setHours(0, 0, 0, 0);
      }
    }
    return this.currentDate;
  }

  clearCurrentDate() {
    this.currentDate = null;
    localStorage.removeItem('userCurrentDate');
  }

  isDateSet() {
    return this.getCurrentDate() !== null;
  }
}

export const dateManager = new DateManager();