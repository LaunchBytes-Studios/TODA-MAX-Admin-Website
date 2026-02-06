import { useEffect, useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ChevronRight, Clock, Copy, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { calculateTimeRemaining, isExpiringSoon } from '@/lib/time-utils';
import { toast } from 'sonner';
import { useRegistrationCodes } from '@/hooks/useRegistrationCodes';
import { cn } from '@/lib/utils';

export interface RegistrationCodesProps {
  id: string;
  code: string;
  status: string;
  expires_at: Date;
  created_at: Date;
  used_at: Date | null;
}

export function RegistrationCodes() {
  const {
    codes,
    loading,
    error,
    generateRegistrationCode,
    fetchRegistrationCodes,
  } = useRegistrationCodes();

  useEffect(() => {
    fetchRegistrationCodes();
  }, [fetchRegistrationCodes]);

  function getEndOfDayExpiry() {
    const today = new Date();
    return {
      date: today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      time: '23:59:59',
    };
  }

  const [timeRemaining, setTimeRemaining] = useState(() => {
    const { date, time } = getEndOfDayExpiry();
    return calculateTimeRemaining(date, time);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const { date, time } = getEndOfDayExpiry();
      setTimeRemaining(calculateTimeRemaining(date, time));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const expiringSoon = isExpiringSoon(timeRemaining);

  const handleCopyCode = (code: RegistrationCodesProps) => {
    navigator.clipboard.writeText(code.code);
    toast.success('Code copied to clipboard!');
  };

  const renderTable = (showAll = false) => {
    const displayedCodes = showAll ? codes : codes.slice(0, 5);

    // Helper to determine if a code is expired
    const isCodeExpired = (expires_at: Date) => {
      const expiry = new Date(expires_at);
      return expiry.getTime() < Date.now();
    };

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedCodes.map((code) => {
              const expired = isCodeExpired(code.expires_at);
              return (
                <TableRow key={code.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-medium',
                          expired && 'line-through text-gray-400',
                        )}
                      >
                        {code.code}
                      </span>
                      {expired && (
                        <Badge variant="destructive" className="text-xs">
                          Expired
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn('text-sm', expired && 'text-gray-400')}>
                      {new Date(code.expires_at).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(code)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy code</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy code</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!showAll && codes.length > 5 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing 5 of {codes.length} codes
          </p>
        )}
      </>
    );
  };

  return (
    <DashboardCard
      title="Registration codes"
      headerActions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expires in:</span>
            <Badge
              variant={expiringSoon ? 'destructive' : 'secondary'}
              className={cn(!expiringSoon && 'bg-green-100 text-green-800')}
            >
              {timeRemaining}
            </Badge>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Registration Codes</DialogTitle>
                <DialogDescription>
                  View all registration codes and their status
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-x-auto">{renderTable(true)}</div>
            </DialogContent>
          </Dialog>
        </div>
      }
      footer={
        <Button
          onClick={generateRegistrationCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'GENERATE CODE'
          )}
        </Button>
      }
    >
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Loading registration codes...
          </span>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto">{renderTable(false)}</div>
      )}
    </DashboardCard>
  );
}
