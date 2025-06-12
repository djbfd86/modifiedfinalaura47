export function generateAuraDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate total days between start and end
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) return [start];
  
  const dates = [start];
  let current = new Date(start);
  let gap = 1;
  
  while (current < end) {
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + gap);
    
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
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function updateTaskCurrentDate(task, userCurrentDate, auraDates) {
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  const taskCurrentDate = new Date(task.currentDate);
  taskCurrentDate.setHours(0, 0, 0, 0);
  
  // If user's current date is after the task's current date, update to the appropriate aura date
  if (userDate > taskCurrentDate) {
    // Find the appropriate aura date that matches or is closest to user's current date
    let newCurrentDate = taskCurrentDate;
    
    for (let i = 0; i < auraDates.length; i++) {
      const auraDate = new Date(auraDates[i]);
      auraDate.setHours(0, 0, 0, 0);
      
      if (auraDate.getTime() === userDate.getTime()) {
        // Exact match - use this date
        newCurrentDate = auraDate;
        break;
      } else if (auraDate <= userDate) {
        // This aura date is before or equal to user date, keep it as potential candidate
        newCurrentDate = auraDate;
      } else {
        // This aura date is after user date, stop here
        break;
      }
    }
    
    return newCurrentDate;
  }
  
  // If user's current date is before or equal to task's current date, keep the task's current date
  return taskCurrentDate;
}

export function getNextAuraDate(currentDate, auraDates) {
  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);
  
  // Find current date in aura dates and return the next one
  for (let i = 0; i < auraDates.length; i++) {
    const auraDate = new Date(auraDates[i]);
    auraDate.setHours(0, 0, 0, 0);
    
    if (auraDate.getTime() === current.getTime() && i + 1 < auraDates.length) {
      return new Date(auraDates[i + 1]);
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