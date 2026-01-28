import api from "./axios";
import { unwrapData } from "./unwrap";

export const getTransactions = async () => {
  const { data } = await api.get("/transactions");
  return unwrapData(data);
};
