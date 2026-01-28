import api from "./axios";
import { unwrapData } from "./unwrap";
import type { Appointment } from "../types/appointment.types";

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data } = await api.get("/appointments");
  return unwrapData<Appointment[]>(data);
};

export const createAppointment = async (payload: {
  clientName: string;
  email: string;
  appointmentDate: string;
  description: string;
}) => {
  const { data } = await api.post("/appointments", payload);
  return unwrapData(data);
};
