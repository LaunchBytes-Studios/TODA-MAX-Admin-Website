import { useMemo, useState } from 'react';
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

const GROUP_ALL_PREFIX = 'all:';

const getGroupAllId = (groupId: string) => `${GROUP_ALL_PREFIX}${groupId}`;

const isGroupAllValue = (value: string) => value.startsWith(GROUP_ALL_PREFIX);

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

  const selectedCount = useMemo(() => {
    const expandedValues = new Set<string>();

    selectedValues.forEach((value) => {
      if (!isGroupAllValue(value)) {
        expandedValues.add(value);
        return;
      }

      const groupId = value.slice(GROUP_ALL_PREFIX.length);
      const group = optionGroups.find(
        (optionGroup) => optionGroup.id === groupId,
      );

      group?.options.forEach((option) => expandedValues.add(option.id));
    });

    return expandedValues.size;
  }, [optionGroups, selectedValues]);

  const toggleGroupAll = (group: FilterOptionGroup) => {
    const groupOptionIds = group.options.map((option) => option.id);
    const groupAllId = getGroupAllId(group.id);

    setDraftValues((previousValues) => {
      const otherValues = previousValues.filter(
        (value) => value !== groupAllId && !groupOptionIds.includes(value),
      );
      const isAllSelected = previousValues.includes(groupAllId);

      return isAllSelected ? otherValues : [...otherValues, groupAllId];
    });
  };

  const toggleValue = (group: FilterOptionGroup, value: string) => {
    const groupOptionIds = group.options.map((option) => option.id);
    const groupAllId = getGroupAllId(group.id);

    setDraftValues((previousValues) => {
      const otherValues = previousValues.filter(
        (currentValue) =>
          currentValue !== groupAllId && !groupOptionIds.includes(currentValue),
      );

      const currentGroupValues = previousValues.includes(groupAllId)
        ? [...groupOptionIds]
        : previousValues.filter((currentValue) =>
            groupOptionIds.includes(currentValue),
          );

      const nextGroupValues = currentGroupValues.includes(value)
        ? currentGroupValues.filter((currentValue) => currentValue !== value)
        : [...currentGroupValues, value];

      if (nextGroupValues.length === groupOptionIds.length) {
        return [...otherValues, groupAllId];
      }

      return [...otherValues, ...nextGroupValues];
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
          className="border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
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

        <div className="space-y-4">
          {optionGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleGroupAll(group)}
                  aria-pressed={draftValues.includes(getGroupAllId(group.id))}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${getBadgeClasses(
                    draftValues.includes(getGroupAllId(group.id)),
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
                      onClick={() => toggleValue(group, option.id)}
                      aria-pressed={isChecked}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${getBadgeClasses(isChecked)}`}
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
