/**
 * Calculates the time remaining until expiry and returns a formatted string.
 * @param expiryDate - Date string in MM-DD-YYYY or MM/DD/YYYY format
 * @param expiryTime - Time string in HH:MM:SS format (24-hour)
 * @returns Formatted string like "23h 59m", "45m 30s", or "Expired"
 */
export function calculateTimeRemaining(
  expiryDate: string,
  expiryTime: string,
): string {
  // Parse the expiry date and time (supports both - and / separators)
  const dateParts = expiryDate.includes('-')
    ? expiryDate.split('-').map(Number)
    : expiryDate.split('/').map(Number);
  const [month, day, year] = dateParts;
  const [hours, minutes, seconds] = expiryTime.split(':').map(Number);

  const expiryDateTime = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds,
  );
  const now = new Date();

  const diffMs = expiryDateTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays}d ${remainingHours}h`;
  } else if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}mins`;
  } else if (diffMinutes > 0) {
    const remainingSeconds = diffSeconds % 60;
    return `${diffMinutes}mins ${remainingSeconds}s`;
  } else {
    return `${diffSeconds}s`;
  }
}

/**
 * Checks if the time remaining indicates the code is expiring soon (less than 1 hour).
 * @param timeRemaining - The formatted time remaining string
 * @returns true if expiring soon, false otherwise
 */
export function isExpiringSoon(timeRemaining: string): boolean {
  if (timeRemaining === 'Expired') return false;

  // Expiring soon if only minutes or seconds remain (no days or hours)
  const hasOnlyMinutes =
    timeRemaining.includes('m') &&
    !timeRemaining.includes('d') &&
    !timeRemaining.includes('h');
  const hasOnlySeconds =
    timeRemaining.includes('s') && !timeRemaining.includes('m');

  return hasOnlyMinutes || hasOnlySeconds;
}

/**
 * Parses a date and time string into a Date object.
 * @param dateStr - Date string in MM-DD-YYYY or MM/DD/YYYY format
 * @param timeStr - Time string in HH:MM:SS format (24-hour)
 * @returns Date object
 */
export function parseExpiryDateTime(dateStr: string, timeStr: string): Date {
  const dateParts = dateStr.includes('-')
    ? dateStr.split('-').map(Number)
    : dateStr.split('/').map(Number);
  const [month, day, year] = dateParts;
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Checks if a given expiry date and time has passed.
 * @param expiryDate - Date string in MM-DD-YYYY or MM/DD/YYYY format
 * @param expiryTime - Time string in HH:MM:SS format (24-hour)
 * @returns true if expired, false otherwise
 */
export function isExpired(expiryDate: string, expiryTime: string): boolean {
  const expiryDateTime = parseExpiryDateTime(expiryDate, expiryTime);
  return expiryDateTime.getTime() <= Date.now();
}
