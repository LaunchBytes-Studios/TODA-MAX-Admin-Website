import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterModalProps {
  title: string;
  description?: string;
  triggerLabel?: string;
  options: FilterOption[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  disabled?: boolean;
}

export function FilterModal({
  title,
  description,
  triggerLabel = 'Filter',
  options,
  selectedValues,
  onApply,
  disabled = false,
}: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<string[]>(selectedValues);

  const selectedCount = useMemo(() => selectedValues.length, [selectedValues]);

  const toggleValue = (value: string) => {
    setDraftValues((previousValues) =>
      previousValues.includes(value)
        ? previousValues.filter((currentValue) => currentValue !== value)
        : [...previousValues, value],
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        setIsOpen(nextOpen);
        if (nextOpen) {
          setDraftValues(selectedValues);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {triggerLabel}
          {selectedCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-semibold text-blue-700">
              {selectedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-3">
          {options.map((option) => {
            const isChecked = draftValues.includes(option.id);

            return (
              <label
                key={option.id}
                htmlFor={`filter-option-${option.id}`}
                className="flex items-center gap-3 rounded-md border p-3 cursor-pointer"
              >
                <input
                  id={`filter-option-${option.id}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleValue(option.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDraftValues([]);
            }}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              onApply(draftValues);
              setIsOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
