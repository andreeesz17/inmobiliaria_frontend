import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockRegisterApi = vi.fn();
vi.mock("../../api/auth.api", () => ({
  register: (...args: any[]) => mockRegisterApi(...args),
}));

const mockSetToken = vi.fn();
vi.mock("../../auth/auth.storage", () => ({
  authStorage: {
    setToken: (...args: any[]) => mockSetToken(...args),
  },
}));

const renderWithRouter = (ui: React.ReactNode) =>
  render(<BrowserRouter>{ui}</BrowserRouter>);

const getEmailInput = () =>
  screen.getByPlaceholderText(/nombre@ejemplo\.com/i);

const getPasswordInput = () =>
  screen.getByPlaceholderText("••••••••");

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("debe renderizar el formulario correctamente", () => {
    renderWithRouter(<Register />);

    expect(
      screen.getByRole("heading", { name: /Crear cuenta/i })
    ).toBeInTheDocument();

    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Crear cuenta gratuita/i })
    ).toBeInTheDocument();
  });

  test("debe permitir escribir en email y contraseña", () => {
    renderWithRouter(<Register />);

    const emailInput = getEmailInput();
    const passwordInput = getPasswordInput();

    fireEvent.change(emailInput, { target: { value: "TEST@MAIL.COM" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(emailInput).toHaveValue("TEST@MAIL.COM");
    expect(passwordInput).toHaveValue("123456");
  });

  test("debe llamar registerApi, guardar token y navegar a /dashboard", async () => {
    mockRegisterApi.mockResolvedValueOnce({ access_token: "token123" });

    renderWithRouter(<Register />);

    fireEvent.change(getEmailInput(), {
      target: { value: "  TEST@MAIL.COM  " },
    });

    fireEvent.change(getPasswordInput(), {
      target: { value: "123456" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Crear cuenta gratuita/i })
    );

    await waitFor(() => {
      expect(mockRegisterApi).toHaveBeenCalledWith({
        username: "test@mail.com",
        password: "123456",
      });
    });

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith("token123");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("debe mostrar error si no viene token", async () => {
    mockRegisterApi.mockResolvedValueOnce({});

    renderWithRouter(<Register />);

    fireEvent.change(getEmailInput(), { target: { value: "a@a.com" } });
    fireEvent.change(getPasswordInput(), { target: { value: "123456" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Crear cuenta gratuita/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No se pudo registrar\. Puede que el usuario ya exista\./i)
      ).toBeInTheDocument();
    });

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("debe mostrar error si registerApi falla", async () => {
    mockRegisterApi.mockRejectedValueOnce(new Error("fail"));

    renderWithRouter(<Register />);

    fireEvent.change(getEmailInput(), { target: { value: "a@a.com" } });
    fireEvent.change(getPasswordInput(), { target: { value: "123456" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Crear cuenta gratuita/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No se pudo registrar\. Puede que el usuario ya exista\./i)
      ).toBeInTheDocument();
    });

    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("debe alternar mostrar y ocultar contraseña", () => {
    renderWithRouter(<Register />);

    const passwordInput = getPasswordInput();
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButtons = screen
      .getAllByRole("button")
      .filter((b) => b.getAttribute("type") === "button");

    const toggleButton = toggleButtons[0];

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("debe deshabilitar el botón y mostrar 'Procesando...'", async () => {
    mockRegisterApi.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ access_token: "t" }), 50)
        )
    );

    renderWithRouter(<Register />);

    fireEvent.change(getEmailInput(), { target: { value: "a@a.com" } });
    fireEvent.change(getPasswordInput(), { target: { value: "123456" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Crear cuenta gratuita/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Procesando/i })
      ).toBeDisabled();
    });
  });

  test("al dar click en 'Inicia sesión' debe navegar a /login", () => {
    renderWithRouter(<Register />);

    fireEvent.click(screen.getByRole("button", { name: /Inicia sesión/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
