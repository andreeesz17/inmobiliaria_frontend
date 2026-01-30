import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MailPage from "./MailPage";

vi.mock("../../components/Card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../../components/Button", () => ({
  Button: ({ children, loading, ...props }: any) => (
    <button {...props} disabled={props.disabled || loading}>
      {children}
    </button>
  ),
}));

const mockSendMail = vi.fn();
vi.mock("../../api/mail.api", () => ({
  sendMail: (...args: any[]) => mockSendMail(...args),
}));

const renderPage = () => render(<MailPage />);

const getToInput = () => screen.getByPlaceholderText(/direccion@ejemplo\.com/i);
const getSubjectInput = () => screen.getByPlaceholderText(/Asunto del mensaje/i);
const getMessageInput = () => screen.getByPlaceholderText(/Escribe tu mensaje aquí/i);

describe("MailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("debe renderizar el header y el formulario de redacción por defecto", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: /Sistema de Correos/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Redactar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Historial/i })).toBeInTheDocument();

    expect(getToInput()).toBeInTheDocument();
    expect(getSubjectInput()).toBeInTheDocument();
    expect(getMessageInput()).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Enviar Correo/i })
    ).toBeInTheDocument();
  });

  test("debe permitir escribir en los campos", () => {
    renderPage();

    fireEvent.change(getToInput(), { target: { value: "cliente@ejemplo.com" } });
    fireEvent.change(getSubjectInput(), { target: { value: "Hola" } });
    fireEvent.change(getMessageInput(), { target: { value: "Mensaje" } });

    expect(getToInput()).toHaveValue("cliente@ejemplo.com");
    expect(getSubjectInput()).toHaveValue("Hola");
    expect(getMessageInput()).toHaveValue("Mensaje");
  });

  test("debe mostrar error si el email no es válido", async () => {
    renderPage();

    fireEvent.change(getToInput(), { target: { value: "correo-malo" } });
    fireEvent.change(getSubjectInput(), { target: { value: "Asunto" } });
    fireEvent.change(getMessageInput(), { target: { value: "Mensaje" } });

    const form = getToInput().closest("form") as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(/Ingresa una dirección de correo válida\./i)
      ).toBeInTheDocument();
    });

    expect(mockSendMail).not.toHaveBeenCalled();
  });

  test("debe enviar correo correctamente, limpiar formulario y mostrar success", async () => {
    mockSendMail.mockResolvedValueOnce({ ok: true });

    renderPage();

    fireEvent.change(getToInput(), { target: { value: "cliente@ejemplo.com" } });
    fireEvent.change(getSubjectInput(), { target: { value: "Asunto" } });
    fireEvent.change(getMessageInput(), { target: { value: "Mensaje" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar Correo/i }));

    await waitFor(() => {
      expect(mockSendMail).toHaveBeenCalledWith({
        to: "cliente@ejemplo.com",
        subject: "Asunto",
        message: "Mensaje",
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Correo enviado correctamente\./i)).toBeInTheDocument();
    });

    expect(getToInput()).toHaveValue("");
    expect(getSubjectInput()).toHaveValue("");
    expect(getMessageInput()).toHaveValue("");
  });

  test("debe mostrar error si falla el envío", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("fail"));

    renderPage();

    fireEvent.change(getToInput(), { target: { value: "cliente@ejemplo.com" } });
    fireEvent.change(getSubjectInput(), { target: { value: "Asunto" } });
    fireEvent.change(getMessageInput(), { target: { value: "Mensaje" } });

    fireEvent.click(screen.getByRole("button", { name: /Enviar Correo/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/No se pudo enviar el correo\. Verifica los datos\./i)
      ).toBeInTheDocument();
    });

    expect(getToInput()).toHaveValue("cliente@ejemplo.com");
    expect(getSubjectInput()).toHaveValue("Asunto");
    expect(getMessageInput()).toHaveValue("Mensaje");
  });

  test("debe cambiar a Historial y mostrar registros", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /Historial/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Historial de Correos/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Confirmación de cita/i)).toBeInTheDocument();
    expect(screen.getByText(/Información de propiedad/i)).toBeInTheDocument();
    expect(screen.getByText(/Oferta especial/i)).toBeInTheDocument();
  });

  test("debe filtrar historial por Fallidos", async () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /Historial/i }));

    const select = await screen.findByRole("combobox");
    fireEvent.change(select, { target: { value: "failed" } });

    expect(screen.getByText(/Oferta especial/i)).toBeInTheDocument();
    expect(screen.queryByText(/Confirmación de cita/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Información de propiedad/i)).not.toBeInTheDocument();
  });
});
