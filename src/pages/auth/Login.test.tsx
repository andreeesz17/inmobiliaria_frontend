import { describe, test, expect, beforeEach, vi } from "vitest";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

import Login from "./Login";

const mockLogin = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("../../auth/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  test("debe renderizar el formulario correctamente", () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Correo Electrónico/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Entrar al Panel/i })
    ).toBeInTheDocument();
  });

  test("debe permitir escribir en los campos", () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(emailInput, {
      target: { value: "admin@inmocore.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "123456" },
    });

    expect(emailInput).toHaveValue("admin@inmocore.com");
    expect(passwordInput).toHaveValue("123456");
  });

  test("debe llamar login y navegar al dashboard", async () => {
    mockLogin.mockResolvedValueOnce(true);

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /Entrar al Panel/i,
    });

    fireEvent.change(emailInput, {
      target: { value: "admin@inmocore.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "123456" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "admin@inmocore.com",
        password: "123456",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("debe mostrar error si las credenciales son incorrectas", async () => {
    mockLogin.mockRejectedValueOnce(new Error("error"));

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole("button", {
      name: /Entrar al Panel/i,
    });

    fireEvent.change(emailInput, {
      target: { value: "x@x.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "wrong" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Las credenciales introducidas son incorrectas/i)
      ).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("debe alternar mostrar y ocultar contraseña", () => {
    renderWithRouter(<Login />);

    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    expect(passwordInput).toHaveAttribute("type", "password");

    // Buscar el botón por su posición relativa al input
    const toggleButton = passwordInput.parentElement!.querySelector('button');
    
    fireEvent.click(toggleButton!);

    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton!);

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("debe deshabilitar el botón cuando loading es true", () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: true,
    });

    renderWithRouter(<Login />);

    const submitButton = screen.getByRole("button", {
      name: /Autenticando/i,
    });

    expect(submitButton).toBeDisabled();
  });
});
