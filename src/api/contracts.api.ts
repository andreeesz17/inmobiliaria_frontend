import api from "./axios";
import { unwrapData } from "./unwrap";

export const getContracts = async () => {
  const { data } = await api.get("/contracts");
  return unwrapData(data);
};
