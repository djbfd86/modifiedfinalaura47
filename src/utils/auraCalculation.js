export function generateAuraDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set hours to avoid timezone issues
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate total days between start and end
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) return [new Date(start)];
  
  const dates = [new Date(start)];
  let current = new Date(start);
  let gap = 1;
  
  while (current < end) {
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + gap);
    nextDate.setHours(0, 0, 0, 0);
    
    if (nextDate >= end) {
      if (dates[dates.length - 1].getTime() !== end.getTime()) {
        dates.push(new Date(end));
      }
      break;
    }
    
    dates.push(new Date(nextDate));
    current = nextDate;
    
    // Progressive gap increase - flexible based on total duration
    if (totalDays <= 10) {
      gap = Math.min(gap + 1, 3); // For short durations, keep gaps smaller
    } else if (totalDays <= 30) {
      gap = Math.min(gap + 1, Math.floor(totalDays / 5));
    } else {
      gap = Math.min(gap + 2, Math.floor(totalDays / 4));
    }
  }
  
  return dates;
}

export function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export function getNextAuraDate(currentDate, auraDates) {
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  
  // Find current date in aura dates and return the next one
  for (let i = 0; i < auraDates.length; i++) {
    const auraDate = new Date(auraDates[i]);
    auraDate.setHours(0, 0, 0, 0);
    
    if (auraDate.getTime() === current.getTime() && i + 1 < auraDates.length) {
      const nextDate = new Date(auraDates[i + 1]);
      nextDate.setHours(0, 0, 0, 0);
      return nextDate;
    }
  }
  
  return null; // No next date available
}

export function isTodaysTask(taskCurrentDate, userCurrentDate) {
  const taskDate = new Date(taskCurrentDate);
  taskDate.setHours(0, 0, 0, 0);
  
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  return taskDate.getTime() === userDate.getTime();
}

// Get the second aura date for initial task display
export function getSecondAuraDate(auraDates) {
  if (auraDates.length >= 2) {
    return new Date(auraDates[1]); // Return the second date (index 1)
  } else if (auraDates.length === 1) {
    return new Date(auraDates[0]); // If only one date, return it
  }
  return null;
}

// Get the appropriate display date based on user's current date and task's aura dates
export function getTaskDisplayDate(userCurrentDate, auraDates, taskCreatedDate) {
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  const createdDate = new Date(taskCreatedDate);
  createdDate.setHours(0, 0, 0, 0);
  
  // If user is visiting on the same day the task was created, show second aura date
  if (userDate.getTime() === createdDate.getTime()) {
    return getSecondAuraDate(auraDates);
  }
  
  // Find the appropriate aura date based on user's current date
  let appropriateDate = null;
  
  for (let i = 0; i < auraDates.length; i++) {
    const auraDate = new Date(auraDates[i]);
    auraDate.setHours(0, 0, 0, 0);
    
    if (auraDate.getTime() === userDate.getTime()) {
      // Exact match - this is today's task
      return auraDate;
    } else if (auraDate <= userDate) {
      // This aura date is before or equal to user date
      appropriateDate = auraDate;
    } else {
      // This aura date is after user date
      // Return the most recent past date or this future date if no past date exists
      return appropriateDate || auraDate;
    }
  }
  
  // If all dates are in the past, return the last one
  return appropriateDate || (auraDates.length > 0 ? new Date(auraDates[auraDates.length - 1]) : null);
}

export function shouldUpdateTaskDate(taskCurrentDate, userCurrentDate, auraDates) {
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  const taskDate = new Date(taskCurrentDate);
  taskDate.setHours(0, 0, 0, 0);
  
  // Check if we need to update to a more appropriate aura date
  const newAuraDate = getTaskDisplayDate(userCurrentDate, auraDates, auraDates[0]);
  return newAuraDate && newAuraDate.getTime() !== taskDate.getTime();
}