export interface Contract {
  id: string;
  contractNumber: string;
  transactionId: string;
  totalAmount: number;
  duration?: number | null;
  terms: string;
  startDate: string;
  endDate?: string | null;
  digitalHash: string;
  status: string;
  createdAt: string;
}
