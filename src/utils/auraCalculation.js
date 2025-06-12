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

export function findCurrentAuraDate(userCurrentDate, auraDates) {
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  // Find the most appropriate aura date for the user's current date
  let currentAuraDate = null;
  
  for (let i = 0; i < auraDates.length; i++) {
    const auraDate = new Date(auraDates[i]);
    auraDate.setHours(0, 0, 0, 0);
    
    if (auraDate.getTime() === userDate.getTime()) {
      // Exact match - this is today's task
      return auraDate;
    } else if (auraDate <= userDate) {
      // This aura date is before or equal to user date
      currentAuraDate = auraDate;
    } else {
      // This aura date is after user date
      // If we have a previous date that's <= user date, use it
      // Otherwise use this future date
      return currentAuraDate || auraDate;
    }
  }
  
  // If we've gone through all dates and they're all <= user date,
  // return the last one (task should be completed)
  return currentAuraDate || (auraDates.length > 0 ? new Date(auraDates[auraDates.length - 1]) : null);
}

export function shouldUpdateTaskDate(taskCurrentDate, userCurrentDate, auraDates) {
  const userDate = new Date(userCurrentDate);
  userDate.setHours(0, 0, 0, 0);
  
  const taskDate = new Date(taskCurrentDate);
  taskDate.setHours(0, 0, 0, 0);
  
  // If user date is after task date, we need to find the appropriate aura date
  if (userDate > taskDate) {
    const newAuraDate = findCurrentAuraDate(userCurrentDate, auraDates);
    return newAuraDate && newAuraDate.getTime() !== taskDate.getTime();
  }
  
  return false;
}