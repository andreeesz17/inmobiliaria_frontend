import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import PropertiesPage from "./PropertiesPage";

import * as propertiesApi from "../../api/properties.api";
import * as imagesApi from "../../api/images.api";

const mockProperties = [
  {
    id: 1,
    title: "Casa Centro",
    address: "Av Principal",
    type: "Venta",
    price: 120000,
    description: "Bonita casa",
  },
];

vi.mock("../../api/properties.api");
vi.mock("../../api/images.api");

const renderPage = () => {
  render(
    <BrowserRouter>
      <PropertiesPage />
    </BrowserRouter>
  );
};

describe("PropertiesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (propertiesApi.getProperties as any).mockResolvedValue({
      data: mockProperties,
      meta: { totalPages: 1 },
    });

    (propertiesApi.createProperty as any).mockResolvedValue({
      id: 2,
    });

    (propertiesApi.updateProperty as any).mockResolvedValue({});
    (propertiesApi.deleteProperty as any).mockResolvedValue({});
    (imagesApi.uploadImage as any).mockResolvedValue({});
  });

  test("muestra propiedades al cargar", async () => {
    renderPage();

    expect(await screen.findByText(/Casa Centro/i)).toBeInTheDocument();
    expect(screen.getByText(/Venta/i)).toBeInTheDocument();

    expect(
      screen.getByText((content) =>
        /\$?\s*120[\s.,\u202f\u00a0]000/.test(content)
      )
    ).toBeInTheDocument();
  });

  test("muestra formulario vacío al iniciar", async () => {
    renderPage();

    await screen.findByText(/Casa Centro/i);

    expect(screen.getByPlaceholderText(/Casa en el centro/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Calle Principal/i)).toHaveValue("");
  });

  test("crea una nueva propiedad", async () => {
    renderPage();

    await screen.findByText(/Casa Centro/i);

    fireEvent.change(screen.getByPlaceholderText(/Casa en el centro/i), {
      target: { value: "Nueva Casa" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Calle Principal/i), {
      target: { value: "Av Nueva" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Venta, Alquiler/i), {
      target: { value: "Alquiler" },
    });

    fireEvent.change(screen.getByPlaceholderText(/250000/i), {
      target: { value: "50000" },
    });

    fireEvent.change(screen.getByPlaceholderText(/Describe la propiedad/i), {
      target: { value: "Casa moderna" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear propiedad/i }));

    await waitFor(() => {
      expect(propertiesApi.createProperty).toHaveBeenCalled();
    });
  });

  test("edita una propiedad", async () => {
    renderPage();

    await screen.findByText(/Casa Centro/i);

    fireEvent.click(screen.getByText(/Editar/i));

    const titleInput = screen.getByPlaceholderText(/Casa en el centro/i);

    fireEvent.change(titleInput, {
      target: { value: "Casa Editada" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Guardar cambios/i }));

    await waitFor(() => {
      expect(propertiesApi.updateProperty).toHaveBeenCalled();
    });
  });

  test("elimina una propiedad", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();

    await screen.findByText(/Casa Centro/i);

    fireEvent.click(screen.getByText(/Eliminar/i));

    await waitFor(() => {
      expect(propertiesApi.deleteProperty).toHaveBeenCalled();
    });
  });

  test("cancela edición", async () => {
    renderPage();

    await screen.findByText(/Casa Centro/i);

    fireEvent.click(screen.getByText(/Editar/i));

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(
      screen.getByRole("button", { name: /Crear propiedad/i })
    ).toBeInTheDocument();
  });
});
