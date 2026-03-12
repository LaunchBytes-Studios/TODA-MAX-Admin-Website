import * as z from 'zod';

const requiredNumber = (fieldName: string) =>
  z
    .any()
    .refine((value) => value !== undefined, `${fieldName} is required`)
    .refine(
      (value) => typeof value === 'number' && !Number.isNaN(value),
      `${fieldName} must be a number`,
    )
    .transform((value) => value as number);

export const REWARD_CATEGORIES = ['Discount', 'Gift', 'Service'] as const;

export const rewardSchema = z.object({
  rewardName: z
    .string()
    .min(1, 'Reward name is required')
    .max(100, 'Reward name must be at most 100 characters'),
  description: z
    .string()
    .max(300, 'Description must be at most 300 characters')
    .optional(),
  category: z.enum(REWARD_CATEGORIES, {
    message: 'Please select a valid category',
  }),
  pointsCost: requiredNumber('Points cost').pipe(
    z
      .number()
      .min(0, 'Points cost cannot be negative')
      .max(10000, 'Points cost is too high'),
  ),
  stockAvailable: requiredNumber('Stock available').pipe(
    z
      .number()
      .min(0, 'Stock available cannot be negative')
      .max(100000, 'Stock available is too high'),
  ),
  lowStockThreshold: requiredNumber('Low stock threshold').pipe(
    z
      .number()
      .min(5, 'Low stock threshold must be at least 5')
      .max(10000, 'Low stock threshold is too high'),
  ),
  activeStatus: z.enum(['active', 'inactive'], {
    message: 'Please select active status',
  }),
});

export type RewardFormValues = z.infer<typeof rewardSchema>;
