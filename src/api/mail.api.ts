import api from "./axios";
import { unwrapData } from "./unwrap";

export const sendMail = async (data: any) => {
  const res = await api.post("/mail/send", data);
  return unwrapData(res.data);
};
