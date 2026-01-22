import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ChevronRight } from 'lucide-react';
import type { LowStockItem } from './type';
import { lowStockItems } from '@/data/lowStock';

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

export function LowStockTable() {
  // Show only first 5 items in the card
  const previewItems = lowStockItems.slice(0, 5);
  const veryLowCount = lowStockItems.filter(
    (item: LowStockItem) => item.status === 'Very Low',
  ).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Low Stock Items</CardTitle>
            {veryLowCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {veryLowCount} Very Low
              </Badge>
            )}
          </div>
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
              </DialogHeader>
              <LowStockTableContent items={lowStockItems} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <LowStockTableContent items={previewItems} />
      </CardContent>
    </Card>
  );
}
