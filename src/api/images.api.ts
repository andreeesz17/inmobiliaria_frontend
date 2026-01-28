import api from "./axios";
import { unwrapData } from "./unwrap";

export const getImages = async () => {
  const { data } = await api.get("/images");
  return unwrapData(data);
};

export const uploadImage = async (file: File, idCasa: number) => {
  const form = new FormData();
  form.append("image", file);
  form.append("id_casa", String(idCasa));

  const { data } = await api.post("/images/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapData(data);
};
