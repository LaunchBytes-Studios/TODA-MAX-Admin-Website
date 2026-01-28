import { RegistrationCodeItem } from './RegistrationCodeItem';
import { cn } from '@/lib/utils';
import type { RegistrationCodesTableProps } from '@/components/RegistrationCodes/types';

export function RegistrationCodesTable({
  codes,
  showAll = false,
  className,
}: RegistrationCodesTableProps) {
  // Show only first 5 codes unless showAll is true
  const displayedCodes = showAll ? codes : codes.slice(0, 5);

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiry Date
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              {/* Copy action column */}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayedCodes.map((code) => (
            <RegistrationCodeItem key={code.id} code={code} />
          ))}
        </tbody>
      </table>
      {!showAll && codes.length > 5 && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Showing 5 of {codes.length} codes
        </p>
      )}
    </div>
  );
}
