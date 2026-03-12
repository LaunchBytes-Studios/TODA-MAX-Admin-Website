import { Badge } from '@/components/ui/badge';
import { formatDiagnosis } from '@/lib/utils';
import type { Order } from '@/hooks/ordering/useOrders';

interface PatientDetailsProps {
  order: Order;
}

export function PatientDetails({ order }: PatientDetailsProps) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-xs font-bold text-slate-500 uppercase mb-2">
        Patient Details
      </p>
      <p className="text-lg font-bold text-slate-900">{order.patient_name}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
          {formatDiagnosis(order.patient_diagnosis)}
        </Badge>
      </div>
    </div>
  );
}
