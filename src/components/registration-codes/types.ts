export interface RegistrationCode {
  id: string;
  code: string;
  expiryDate: string;
  expiryTime: string;
  isExpired: boolean;
}

export interface RegistrationCodesTableProps {
  codes: RegistrationCode[];
  showAll?: boolean;
  className?: string;
}

export interface RegistrationCodeItemProps {
  code: RegistrationCode;
}
