import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequestsPage from "./RequestsPage";

vi.mock("../../api/requests.api", () => {
  return {
    getRequests: vi.fn(),
    updateRequestStatus: vi.fn(),
  };
});

vi.mock("../../auth/useAuth", () => {
  return {
    useAuth: vi.fn(),
  };
});

vi.mock("../../components/Notifications", () => {
  return {
    showNotification: vi.fn(),
  };
});

import { getRequests, updateRequestStatus } from "../../api/requests.api";
import { useAuth } from "../../auth/useAuth";
import { showNotification } from "../../components/Notifications";

const renderPage = () =>
  render(
    <MemoryRouter>
      <RequestsPage />
    </MemoryRouter>
  );

const mockRequests = [
  {
    _id: "r1",
    nombre_cliente: "Juan Perez",
    email_cliente: "juan@mail.com",
    direccion: "Av. Amazonas 123",
    tipo_operacion: "Venta",
    precio: 120000,
    num_habitaciones: 3,
    status: "pending",
    createdAt: "2026-01-29T10:00:00.000Z",
    notes: "",
  },
  {
    _id: "r2",
    nombre_cliente: "Maria Lopez",
    email_cliente: "maria@mail.com",
    direccion: "Calle 10 #20",
    tipo_operacion: "Alquiler",
    precio: 450,
    num_habitaciones: 2,
    status: "approved",
    createdAt: "2026-01-28T10:00:00.000Z",
    notes: "Ok",
  },
  {
    _id: "r3",
    nombre_cliente: "Pedro Ruiz",
    email_cliente: "pedro@mail.com",
    direccion: "Centro",
    tipo_operacion: "Venta",
    precio: 99000,
    num_habitaciones: 1,
    status: "declined",
    createdAt: "2026-01-27T10:00:00.000Z",
    notes: "No cumple",
  },
];

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("29/01/2026");
  vi.spyOn(console, "error").mockImplementation(() => {});

  (useAuth as any).mockReturnValue({
    username: "admin@mail.com",
    isAdmin: true,
    isAgent: false,
  });

  (getRequests as any).mockResolvedValue(mockRequests);
  (updateRequestStatus as any).mockResolvedValue({ ok: true });
});

describe("RequestsPage", () => {
  test("renderiza el título y carga solicitudes", async () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: /Solicitudes/i })
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/Listado de solicitudes/i)
    ).toBeInTheDocument();

    expect(getRequests).toHaveBeenCalledTimes(1);

    expect(await screen.findByText(/Juan Perez/i)).toBeInTheDocument();
    expect(screen.getByText(/Maria Lopez/i)).toBeInTheDocument();
    expect(screen.getByText(/Pedro Ruiz/i)).toBeInTheDocument();
  });

  test("muestra contadores correctos (pendientes/aprobadas/rechazadas)", async () => {
    renderPage();

    await screen.findByText(/Juan Perez/i);

    const pendientes = screen.getByText(/Pendientes/i).closest("div");
    const aprobadas = screen.getByText(/Aprobadas/i).closest("div");
    const rechazadas = screen.getByText(/Rechazadas/i).closest("div");

    expect(pendientes).toBeTruthy();
    expect(aprobadas).toBeTruthy();
    expect(rechazadas).toBeTruthy();

    expect(pendientes as HTMLElement).toHaveTextContent("1");
    expect(aprobadas as HTMLElement).toHaveTextContent("1");
    expect(rechazadas as HTMLElement).toHaveTextContent("1");
  });

  test("si no hay solicitudes muestra estado vacío", async () => {
    (getRequests as any).mockResolvedValueOnce([]);

    renderPage();

    expect(await screen.findByText(/No hay solicitudes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Las nuevas solicitudes aparecerán aquí/i)
    ).toBeInTheDocument();
  });

  test("admin/agent ve botones de aprobar/rechazar en pending", async () => {
    renderPage();

    await screen.findByText(/Juan Perez/i);

    expect(screen.getByRole("button", { name: /Aprobar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Rechazar/i })).toBeInTheDocument();
  });

  test("usuario normal NO ve botones de aprobar/rechazar", async () => {
    (useAuth as any).mockReturnValue({
      username: "user@mail.com",
      isAdmin: false,
      isAgent: false,
    });

    renderPage();

    await screen.findByText(/Juan Perez/i);

    expect(
      screen.queryByRole("button", { name: /Aprobar/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Rechazar/i })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(/Pendiente de aprobación por administrador\/agent/i)
    ).toBeInTheDocument();
  });

  test("aprobar llama updateRequestStatus, recarga y notifica éxito", async () => {
    renderPage();

    await screen.findByText(/Juan Perez/i);

    fireEvent.click(screen.getByRole("button", { name: /Aprobar/i }));

    await waitFor(() => {
      expect(updateRequestStatus).toHaveBeenCalledWith("r1", "approved");
    });

    await waitFor(() => {
      expect(getRequests).toHaveBeenCalledTimes(2);
    });

    expect(showNotification).toHaveBeenCalledWith(
      "Solicitud aprobada exitosamente",
      "success"
    );
  });

  test("rechazar llama updateRequestStatus, recarga y notifica éxito", async () => {
    renderPage();

    await screen.findByText(/Juan Perez/i);

    fireEvent.click(screen.getByRole("button", { name: /Rechazar/i }));

    await waitFor(() => {
      expect(updateRequestStatus).toHaveBeenCalledWith("r1", "declined");
    });

    await waitFor(() => {
      expect(getRequests).toHaveBeenCalledTimes(2);
    });

    expect(showNotification).toHaveBeenCalledWith(
      "Solicitud rechazada exitosamente",
      "success"
    );
  });

  test("si updateRequestStatus falla, muestra mensaje del backend (message)", async () => {
    (updateRequestStatus as any).mockRejectedValueOnce({
      response: { data: { message: "No autorizado" } },
    });

    renderPage();

    await screen.findByText(/Juan Perez/i);

    fireEvent.click(screen.getByRole("button", { name: /Aprobar/i }));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith("No autorizado", "error");
    });
  });

  test("si updateRequestStatus falla, muestra message o error o fallback", async () => {
    (updateRequestStatus as any).mockRejectedValueOnce({
      response: { data: { error: "Error interno" } },
    });

    renderPage();

    await screen.findByText(/Juan Perez/i);

    fireEvent.click(screen.getByRole("button", { name: /Rechazar/i }));

    await waitFor(() => {
      expect(showNotification).toHaveBeenCalledWith("Error interno", "error");
    });
  });

  test("botón Actualizar vuelve a llamar getRequests", async () => {
    renderPage();

    await screen.findByText(/Juan Perez/i);

    fireEvent.click(screen.getByRole("button", { name: /Actualizar/i }));

    await waitFor(() => {
      expect(getRequests).toHaveBeenCalledTimes(2);
    });
  });
});
