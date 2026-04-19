export interface Patient {
  patientId: string;
  contact: string;
  address: string;
  diagnosis: {
    diabetes: boolean;
    hypertension: boolean;
  };
  birthday: Date;
  firstname: string;
  surname: string;
  sex: string;
  philhealth_num: string;
  avatar_url: string;
}
