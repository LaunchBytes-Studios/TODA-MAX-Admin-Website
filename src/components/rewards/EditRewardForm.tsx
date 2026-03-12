import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  REWARD_CATEGORIES,
  rewardSchema,
  type RewardFormValues,
} from '@/components/zod/rewardSchema';
import { useUpdateReward } from '@/hooks/rewards/useUpdateReward';
import type { FrontendReward } from '@/types/reward';

interface EditRewardFormProps {
  isOpen: boolean;
  onClose: () => void;
  reward: FrontendReward | null;
  onUpdateReward: () => void;
}

const parseNumberInput = (value: string) =>
  value === '' ? undefined : Number(value);

function EditRewardForm({
  isOpen,
  onClose,
  reward,
  onUpdateReward,
}: EditRewardFormProps) {
  const { updateReward } = useUpdateReward();

  const form = useForm<RewardFormValues>({
    resolver: zodResolver(rewardSchema),
    defaultValues: {
      rewardName: '',
      description: '',
      category: 'Discount',
      pointsCost: 0,
      stockAvailable: 0,
      lowStockThreshold: 10,
      activeStatus: 'active',
    },
  });

  useEffect(() => {
    if (reward) {
      form.reset({
        rewardName: reward.rewardName,
        description: reward.description,
        category: REWARD_CATEGORIES.includes(
          reward.category as (typeof REWARD_CATEGORIES)[number],
        )
          ? (reward.category as (typeof REWARD_CATEGORIES)[number])
          : 'Discount',
        pointsCost: reward.pointsCost,
        stockAvailable: reward.stockAvailable,
        lowStockThreshold: reward.lowStockThreshold,
        activeStatus: reward.isActive ? 'active' : 'inactive',
      });
    }
  }, [form, reward]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: RewardFormValues) => {
    if (!reward) {
      toast.error('No reward selected');
      return;
    }

    try {
      const result = await updateReward(reward.id, {
        rewardName: values.rewardName,
        description: values.description,
        category: values.category,
        pointsCost: values.pointsCost,
        stockAvailable: values.stockAvailable,
        lowStockThreshold: values.lowStockThreshold,
        isActive: values.activeStatus === 'active',
      });

      if (result.success) {
        onUpdateReward();
        onClose();
      }
    } catch {
      toast.error('Failed to update reward');
    }
  };

  if (!isOpen || !reward) return null;

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
            Edit Reward
          </DialogTitle>
          <DialogDescription>
            Update the reward details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="rewardName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Reward Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g P50 Medication Discount"
                      {...field}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting}
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
                      placeholder="Enter reward description"
                      {...field}
                      className={
                        fieldState.invalid
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }
                      disabled={isSubmitting}
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
                      {REWARD_CATEGORIES.map((category) => (
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
                name="pointsCost"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Points Cost *</FormLabel>
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockAvailable"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Stock Available *</FormLabel>
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
                        disabled={isSubmitting}
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
                    <FormLabel>Low Stock Threshold *</FormLabel>
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
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activeStatus"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Active Status *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger
                          className={
                            fieldState.invalid
                              ? 'border-red-500 focus:ring-red-500'
                              : ''
                          }
                        >
                          <SelectValue placeholder="Select active status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditRewardForm;
