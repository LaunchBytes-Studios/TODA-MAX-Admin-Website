import * as z from 'zod';

export const addMedicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().min(0),
  lowStockThreshold: z.number().min(0),
  dosage: z.number().min(0),
});

export type AddMedicineFormValues = z.infer<typeof addMedicineSchema>;
