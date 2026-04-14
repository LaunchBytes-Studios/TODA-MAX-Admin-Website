import type { Patient } from '@/types/patient';

interface ExpandedPatientDetailsProps {
  selectedPatient: Patient;
}

export function ExpandedPatientDetails({
  selectedPatient,
}: ExpandedPatientDetailsProps) {
  return (
    <div className="px-4 pb-4 pt-2 bg-gray-50 border-t text-sm space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <p>
          <span className="text-gray-500">Contact:</span>{' '}
          {selectedPatient.contact}
        </p>
        <p>
          <span className="text-gray-500">Sex:</span> {selectedPatient.sex}
        </p>
        <p>
          <span className="text-gray-500">Address:</span>{' '}
          {selectedPatient.address}
        </p>
        <p>
          <span className="text-gray-500">PhilHealth:</span>{' '}
          {selectedPatient.philhealth_num}
        </p>
        <p>
          <span className="text-gray-500">Birthday:</span>{' '}
          {new Date(selectedPatient.birthday).toLocaleDateString()}
        </p>
      </div>

      {/* Diagnosis */}
      <div className="flex flex-row gap-6">
        <p className="text-gray-500 mb-1 text-center">Diagnosis:</p>
        <div className="flex gap-2 items-center justify-center">
          {selectedPatient.diagnosis.hypertension && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full items-center justify-center flex-1 text-center">
              Hypertension
            </span>
          )}
          {selectedPatient.diagnosis.diabetes && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
              Diabetes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
