import { OrderCard } from './OrderCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Order } from '@/hooks/ordering/useOrders';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

interface OrdersListProps {
  orders: Order[];
  activeTab: string;
  searchTerm: string;
  onViewDetails: (order: Order) => void;
  pagination?: PaginationInfo;
}

export function OrdersList({
  orders,
  activeTab,
  searchTerm,
  onViewDetails,
  pagination,
}: OrdersListProps) {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
          <p className="text-lg">No orders found</p>
          <p className="text-sm mt-1">
            {searchTerm
              ? 'Try different search terms'
              : `No ${activeTab} orders at the moment`}
          </p>
        </div>
      ) : (
        <>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
            />
          ))}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems,
                )}{' '}
                of {pagination.totalItems} orders
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage - 1)
                  }
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={
                        page === pagination.currentPage ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => pagination.onPageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage + 1)
                  }
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
