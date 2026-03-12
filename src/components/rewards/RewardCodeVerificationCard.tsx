import { useMemo, useState } from 'react';
import { ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useRewardCodeVerification } from '@/hooks/rewards/useRewardCodeVerification';

const formatStatusLabel = (status?: string) => {
  if (!status) {
    return 'Unknown';
  }

  return status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function RewardCodeVerificationCard() {
  const [codeInput, setCodeInput] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const {
    verification,
    isVerifying,
    isRedeeming,
    verifyCode,
    finalizeCode,
    clearVerification,
  } = useRewardCodeVerification();

  const normalizedCode = useMemo(() => codeInput.trim(), [codeInput]);
  const canSubmit = normalizedCode.length > 0;
  const canConfirmRedeem =
    !!verification && verification.isValid && !verification.isFinalized;

  const handleVerify = async () => {
    if (!canSubmit) {
      return;
    }
    const result = await verifyCode(normalizedCode);
    if (result?.isValid) {
      setIsDetailsOpen(true);
    }
  };

  const handleConfirmRedeem = async () => {
    if (!canConfirmRedeem) {
      return;
    }

    const result = await finalizeCode(verification.code);
    if (result) {
      setIsDetailsOpen(false);
      setCodeInput('');
      clearVerification();
    }
  };

  const handleCodeChange = (value: string) => {
    setCodeInput(value);
    if (verification && value.trim() !== verification.code) {
      clearVerification();
    }
  };

  return (
    <DashboardCard
      title={
        <span className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" />
          Reward Code Verification
        </span>
      }
      headerActions={
        <div className="flex items-center gap-2">
          {verification ? (
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="min-w-30 justify-end text-blue-600"
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Reward Verification Details</DialogTitle>
                  <DialogDescription>
                    Review verified reward transaction information
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    {formatStatusLabel(verification.status)}
                  </p>
                  <p>
                    <span className="font-medium">Code:</span>{' '}
                    {verification.code}
                  </p>
                  <p>
                    <span className="font-medium">Transaction ID:</span>{' '}
                    {verification.transId}
                  </p>
                  <p>
                    <span className="font-medium">Patient:</span>{' '}
                    {verification.patientName}
                  </p>
                  <p>
                    <span className="font-medium">Reward:</span>{' '}
                    {verification.rewardName}
                  </p>
                  <p>
                    <span className="font-medium">Points:</span>{' '}
                    {verification.points}
                  </p>
                  <p>
                    <span className="font-medium">Validated By:</span>{' '}
                    {verification.validatedByEnavId
                      ? 'Assigned eNavigator'
                      : 'Not yet assigned'}
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDetailsOpen(false)}
                    disabled={isRedeeming}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleConfirmRedeem}
                    disabled={!canConfirmRedeem || isRedeeming}
                  >
                    {isRedeeming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="min-w-30 justify-end text-blue-600"
              disabled
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            placeholder="Enter reward code"
            value={codeInput}
            onChange={(event) => handleCodeChange(event.target.value)}
            className="md:flex-1"
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleVerify}
            disabled={!canSubmit || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redeeming...
              </>
            ) : (
              'Redeem Code'
            )}
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
