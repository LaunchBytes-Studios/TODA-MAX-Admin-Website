import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import type { FrontendMedicine } from '@/types/medication';
import {
  addMedicineSchema,
  type AddMedicineFormValues,
} from '@/components/zod/addMedicineSchema';
import { useUpdateMedication } from '@/hooks/medications/useUpdateMedication';

interface EditMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: FrontendMedicine | null;
  onUpdateMedicine: (
    id: number,
    updatedData: Partial<FrontendMedicine>,
  ) => void;
}

const CATEGORIES = ['Hypertension', 'Diabetes'];

function EditMedicineForm({
  isOpen,
  onClose,
  medicine,
  onUpdateMedicine,
}: EditMedicineFormProps) {
  const { updateMedication, loading } = useUpdateMedication();

  const form = useForm<AddMedicineFormValues>({
    resolver: zodResolver(addMedicineSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Hypertension',
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      dosage: 0,
    },
  });

  useEffect(() => {
    if (medicine) {
      form.reset({
        name: medicine.name,
        description: medicine.description,
        category: medicine.category,
        price: medicine.price || 0,
        stock: medicine.stock,
        lowStockThreshold: medicine.lowStockThreshold,
        dosage: medicine.dosage,
      });
    }
  }, [form, medicine]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: AddMedicineFormValues) => {
    if (!medicine) {
      toast.error('No medicine selected');
      return;
    }

    try {
      const result = await updateMedication(medicine.id, {
        name: values.name,
        category: values.category,
        stock: values.stock,
        lowStockThreshold: values.lowStockThreshold,
        dosage: values.dosage,
        price: values.price,
        description: values.description,
      });

      if (result.success) {
        toast.success('Medicine updated successfully');
        onUpdateMedicine(medicine.id, {
          name: values.name,
          description: values.description ?? '',
          category: values.category,
          stock: values.stock,
          lowStockThreshold: values.lowStockThreshold,
          dosage: values.dosage,
          price: values.price,
        });
        onClose();
      } else {
        toast.error(result.error || 'Failed to update medicine');
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast.error('Failed to update medicine');
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        className="
          w-full
          max-w-md
          max-h-[90vh]
          overflow-y-auto
          rounded-lg
          p-0
          gap-0
        "
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Medicine</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter medicine name"
                      {...field}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Enter description"
                      {...field}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Price (PHP) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Dosage (mg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting || loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMedicineForm;
