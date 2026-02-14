// src/lib/utils/RewardsSystem.ts
export type Badge = {
  id: string;
  name: string;
  icon: string;
};

const STORAGE_KEY_PREFIX = 'unlockedBadges';

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export function unlockBadge(userId: string, badge: Badge, persist = true) {
  console.log(`User ${userId} unlocked badge: ${badge.name}`);

  if (persist && typeof localStorage !== 'undefined') {
    const key = getStorageKey(userId);
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    if (!current.some((b: Badge) => b.id === badge.id)) {
      current.push(badge);
      localStorage.setItem(key, JSON.stringify(current));
    }
  }
}

export function getUnlockedBadges(userId: string): Badge[] {
  if (typeof localStorage === 'undefined') return [];
  const key = getStorageKey(userId);
  return JSON.parse(localStorage.getItem(key) || '[]');
}
