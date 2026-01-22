import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { registrationCodes } from '@/data/registrationCodes';
import { RegistrationCodesTable } from './RegistrationCodeTable';
import { calculateTimeRemaining, isExpiringSoon } from '@/lib/time-utils';
import type { RegistrationCode } from './types';

// Get end of day for countdown
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

export function RegistrationCodes() {
  const [codes, setCodes] = useState<RegistrationCode[]>(registrationCodes);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const { date, time } = getEndOfDayExpiry();
    return calculateTimeRemaining(date, time);
  });

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const { date, time } = getEndOfDayExpiry();
      setTimeRemaining(calculateTimeRemaining(date, time));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateCode = () => {
    // Set expiry to end of today (23:59:59)
    const today = new Date();
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    const newCode: RegistrationCode = {
      id: Date.now().toString(),
      code: `CODE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      expiryDate: endOfDay.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      expiryTime: '23:59:59',
      isExpired: false,
    };
    setCodes([newCode, ...codes]);
    toast.success('New registration code generated!');
  };

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
              <RegistrationCodesTable codes={codes} showAll />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RegistrationCodesTable codes={codes} />

        <Button
          onClick={generateCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          GENERATE CODE
        </Button>
      </CardContent>
    </Card>
  );
}
