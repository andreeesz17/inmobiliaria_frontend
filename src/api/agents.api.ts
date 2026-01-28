import api from "./axios";
import { unwrapData } from "./unwrap";

export const getAgents = async () => {
  const { data } = await api.get("/users", { params: { page: 1, limit: 100 } });
  const payload = unwrapData<any>(data);
  const items = Array.isArray(payload?.items) ? payload.items : payload?.data ?? payload ?? [];
  return items.filter((u: any) => (u.role ?? "").toLowerCase() === "agent");
};
