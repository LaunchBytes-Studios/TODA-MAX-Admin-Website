/**
 * Determines if an order should be displayed as "new" based on its creation time
 * Orders less than 2 hours old are "new", others are "pending"
 */
export function getOrderDisplayStatus(createdAt: string): 'new' | 'pending' {
  const orderTime = new Date(createdAt).getTime();
  const currentTime = new Date().getTime();
  const twoHoursInMs = 2 * 60 * 60 * 1000;

  return currentTime - orderTime < twoHoursInMs ? 'new' : 'pending';
}

/**
 * Checks if an order is truly "new" (less than 2 hours old)
 */
export function isNewOrder(createdAt: string): boolean {
  return getOrderDisplayStatus(createdAt) === 'new';
}
