export interface Request {
  _id: string;
  direccion: string;
  precio: number;
  num_habitaciones: number;
  tipo_operacion: string;
  nombre_cliente: string;
  email_cliente: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  status: 'pending' | 'approved' | 'declined';
  approvedBy?: string;
  declinedBy?: string;
  approvedAt?: string;
  declinedAt?: string;
  notes?: string;
}

export interface CreateRequestPayload {
  direccion: string;
  precio: number;
  num_habitaciones: number;
  tipo_operacion: string;
  nombre_cliente: string;
  email_cliente: string;
}

// Simplified - not currently used since we're passing status directly
// export interface UpdateRequestStatusPayload {
//   status: 'approved' | 'declined';
//   notes?: string;
//   userId?: string;
//   userName?: string;
//   approvedBy?: string;
//   declinedBy?: string;
// }
