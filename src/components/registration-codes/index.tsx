import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronRight, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { RegistrationCodesTable } from './RegistrationCodeTable';
import { calculateTimeRemaining, isExpiringSoon } from '@/lib/time-utils';
import { Loader2 } from 'lucide-react';
import { useRegistrationCodes } from '@/hooks/useRegistrationCodes';

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

  // Countdown logic can be kept or adjusted as needed
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Registration codes</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">Expires in:</span>
            <span
              className={`font-medium ${
                expiringSoon ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {timeRemaining}
            </span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <DialogHeader>
                <DialogTitle>All Registration Codes</DialogTitle>
              </DialogHeader>
              <RegistrationCodesTable
                codes={Array.isArray(codes) ? codes : []}
                showAll
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">
              Loading registration codes...
            </span>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && (
          <RegistrationCodesTable codes={Array.isArray(codes) ? codes : []} />
        )}
        <Button
          onClick={generateRegistrationCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          GENERATE CODE
        </Button>
      </CardContent>
    </Card>
  );
}
