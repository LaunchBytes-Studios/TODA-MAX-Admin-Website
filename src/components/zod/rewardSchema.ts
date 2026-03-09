import { z } from 'zod';

export const REWARD_CATEGORIES = [
  'Discount',
  'Gift',
  'Service',
  'Health',
] as const;

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
  pointsCost: z
    .number({ message: 'Points cost is required' })
    .min(0, 'Points cost cannot be negative'),
  stockAvailable: z
    .number({ message: 'Stock available is required' })
    .min(0, 'Stock available cannot be negative'),
  lowStockThreshold: z
    .number({ message: 'Low stock threshold is required' })
    .min(0, 'Low stock threshold cannot be negative'),
  activeStatus: z.enum(['active', 'inactive'], {
    message: 'Please select active status',
  }),
});

export type RewardFormValues = z.infer<typeof rewardSchema>;
