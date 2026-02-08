import { DashboardCard } from './DashboardCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ChevronRight } from 'lucide-react';
import type { LowStockItem } from './LowStock.type';
import { useAlertMedication } from '@/hooks/medication/useAlertMedication';

interface Medication {
  name: string;
  price: number;
  type: string;
  stock_qty: number;
  threshold_qty: number;
  category?: string;
}

function getStatusBadgeStyles(status: LowStockItem['status']) {
  if (status === 'Very Low') {
    return 'bg-red-100 text-red-700 hover:bg-red-100';
  }
  return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
}

function LowStockTableContent({ items }: { items: LowStockItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medicine</TableHead>
          <TableHead className="text-right">Current</TableHead>
          <TableHead className="text-right">Min Stock</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.medicine}>
            <TableCell>
              <div>
                <div className="font-medium">{item.medicine}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
              </div>
            </TableCell>
            <TableCell className="text-right">{item.current}</TableCell>
            <TableCell className="text-right text-gray-500">
              {item.minStock}
            </TableCell>
            <TableCell className="text-right">
              <Badge
                variant="secondary"
                className={getStatusBadgeStyles(item.status)}
              >
                {item.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function LowStockCard() {
  const { medications, loading, error } = useAlertMedication();

  // Map medications to LowStockItem[]
  const lowStockItems: LowStockItem[] = medications.map((med: Medication) => ({
    medicine: med.name ?? '',
    category: med.category ?? '',
    current: med.stock_qty ?? 0,
    minStock: med.threshold_qty ?? 0,
    status: med.stock_qty <= (med.threshold_qty ?? 0) / 2 ? 'Very Low' : 'Low',
  }));

  // Show only first 5 items in the card
  const previewItems = lowStockItems.slice(0, 5);
  const veryLowCount = lowStockItems.filter(
    (item: LowStockItem) => item.status === 'Very Low',
  ).length;

  return (
    <DashboardCard
      title={
        <div className="flex items-center gap-2">
          Low Stock Items
          {veryLowCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {veryLowCount} Very Low
            </Badge>
          )}
        </div>
      }
      headerActions={
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All ({lowStockItems.length})
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Low Stock Items
                <Badge variant="outline">{lowStockItems.length} items</Badge>
                {veryLowCount > 0 && (
                  <Badge variant="destructive">{veryLowCount} Very Low</Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Detailed list of all medications that are low in stock. Consider
                restocking soon.
              </DialogDescription>
            </DialogHeader>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : lowStockItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No low stock items.
              </div>
            ) : (
              <LowStockTableContent items={lowStockItems} />
            )}
          </DialogContent>
        </Dialog>
      }
    >
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : previewItems.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No low stock items.
        </div>
      ) : (
        <>
          <LowStockTableContent items={previewItems} />
          {lowStockItems.length > 5 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Showing 5 of {lowStockItems.length} items
            </p>
          )}
        </>
      )}
    </DashboardCard>
  );
}
