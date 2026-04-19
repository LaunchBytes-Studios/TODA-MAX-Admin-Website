import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/zod/medicineSchema';

interface AddMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine: (
    medicine: Omit<FrontendMedicine, 'id' | 'isLowStock'>,
  ) => Promise<void>;
}

const CATEGORIES = ['Hypertension', 'Diabetes'];

const parseNumberInput = (value: string) =>
  value === '' ? undefined : Number(value);

function AddMedicineForm({
  isOpen,
  onClose,
  onAddMedicine,
}: AddMedicineFormProps) {
  const form = useForm<AddMedicineFormValues>({
    resolver: zodResolver(addMedicineSchema),
    defaultValues: {
      name: '',
      description: '',
      category: 'Hypertension',
      price: undefined,
      stock: undefined,
      lowStockThreshold: undefined,
      dosage: undefined,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: AddMedicineFormValues) => {
    try {
      await onAddMedicine({
        ...values,
        description: values.description ?? '',
      });
      form.reset();
      onClose();
    } catch {
      toast.error('Failed to add medicine');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent
        className="
          w-full
          max-w-xl
          max-h-[92vh]
          overflow-y-auto
          rounded-lg
          p-0
          gap-0
        "
      >
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Medicine
          </DialogTitle>
          <DialogDescription>
            Fill in the medicine details to add a new inventory item.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            {/* Name */}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        placeholder="0"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseNumberInput(e.target.value))
                        }
                        className={
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
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
                        placeholder="0"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseNumberInput(e.target.value))
                        }
                        className={
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
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
                        placeholder="10"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseNumberInput(e.target.value))
                        }
                        className={
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
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
                        placeholder="0"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(parseNumberInput(e.target.value))
                        }
                        className={
                          fieldState.invalid
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Add'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMedicineForm;
