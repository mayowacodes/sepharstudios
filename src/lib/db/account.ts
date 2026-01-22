import { db } from '$lib/db/drizzle';
import { account } from '$lib/db/schema';
import { onError, onSuccess } from '$lib/fxns';
import { eq } from 'drizzle-orm';

type Account = typeof account.$inferSelect;

export async function updateAccount(
  userId: string,
  updates: Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const updateData = Object.fromEntries(
    Object.entries(updates).filter(([key, value]) =>
      value !== undefined && !['id', 'createdAt', 'updatedAt'].includes(key)
    )
  );
  if (Object.keys(updateData).length === 0) throw new Error('No valid fields to update');
  return await db.update(account).set(updateData).where(eq(account.userId, userId)).returning();
}

export const getAccountByUserId = async (userId: string) => {
  try {
    const userAccount = await db.select().from(account).where(eq(account.userId, userId)).limit(1).then(res => res[0]);
    return onSuccess(userAccount);
  } catch (error: any) {
    return onError(error.message);
  }
};
