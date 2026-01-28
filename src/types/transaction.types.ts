export interface Transaction {
  id: string;
  id_casa: number;
  direccion: string;
  id_cliente: number;
  nombre_cliente: string;
  monto: number;
  tipo_transaccion: string;
  email_cliente: string;
  estado: string;
  fecha_transaccion?: string;
  createdAt?: string;
}
