import { useState } from 'react';
import { Funnel } from 'lucide-react';
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

export interface FilterOptionGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterModalProps {
  title: string;
  description?: string;
  triggerLabel?: string;
  optionGroups: FilterOptionGroup[];
  selectedValues: string[];
  onApply: (values: string[]) => void;
  disabled?: boolean;
}

export function FilterModal({
  title,
  description,
  triggerLabel = 'Filter',
  optionGroups,
  selectedValues,
  onApply,
  disabled = false,
}: FilterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draftValues, setDraftValues] = useState<string[]>(selectedValues);

  const selectedCount = new Set(selectedValues).size;

  const toggleGroupAll = (group: FilterOptionGroup) => {
    const groupOptionIds = group.options.map((option) => option.id);
    const allSelected = groupOptionIds.every((optionId) =>
      draftValues.includes(optionId),
    );

    setDraftValues((previousValues) => {
      if (allSelected) {
        return previousValues.filter(
          (value) => !groupOptionIds.includes(value),
        );
      }

      return Array.from(new Set([...previousValues, ...groupOptionIds]));
    });
  };

  const toggleValue = (value: string) => {
    setDraftValues((previousValues) => {
      if (previousValues.includes(value)) {
        return previousValues.filter((currentValue) => currentValue !== value);
      }

      return [...previousValues, value];
    });
  };

  const getBadgeClasses = (isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }

    return 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200';
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
          className="h-10 border-blue-600 bg-blue-600 px-4 text-white hover:bg-blue-700 hover:text-white"
          disabled={disabled}
        >
          <Funnel className="h-4 w-4" />
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

        <div className="space-y-5">
          {optionGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleGroupAll(group)}
                  aria-pressed={group.options.every((option) =>
                    draftValues.includes(option.id),
                  )}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${getBadgeClasses(
                    group.options.every((option) =>
                      draftValues.includes(option.id),
                    ),
                  )}`}
                >
                  All
                </button>
                {group.options.map((option) => {
                  const isChecked = draftValues.includes(option.id);

                  return (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => toggleValue(option.id)}
                      aria-pressed={isChecked}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${getBadgeClasses(isChecked)}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
