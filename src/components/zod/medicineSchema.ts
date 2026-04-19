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

export const addMedicineSchema = z.object({
  name: z
    .string()
    .min(1, 'Medicine name is required')
    .max(100, 'Medicine name must be 100 characters or less'),
  description: z
    .string()
    .max(300, 'Description must be at most 300 characters')
    .optional(),
  category: z.string().min(1, 'Category is required'),
  price: requiredNumber('Price').pipe(
    z
      .number()
      .positive('Price must be greater than 0')
      .max(100000, 'Price is too high'),
  ),
  stock: requiredNumber('Stock').pipe(
    z
      .number()
      .min(0, 'Stock quantity cannot be negative')
      .max(100000, 'Stock quantity is too high'),
  ),
  lowStockThreshold: requiredNumber('Low stock threshold').pipe(
    z
      .number()
      .min(5, 'Low stock threshold must be at least 5')
      .max(10000, 'Low stock threshold is too high'),
  ),
  dosage: requiredNumber('Dosage').pipe(
    z
      .number()
      .min(1, 'Dosage must be greater than 0')
      .max(10000, 'Dosage is too high'),
  ),
});

export type AddMedicineFormValues = z.infer<typeof addMedicineSchema>;
