import { describe, test, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

const renderPage = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe("Home", () => {
  test("renderiza el hero y la sección de propiedades", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { level: 1, name: /Tu hogar ideal/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /Propiedades Destacadas/i })
    ).toBeInTheDocument();
  });

  test("muestra 3 propiedades iniciales", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: /Departamento Moderno Centro/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).toBeInTheDocument();
  });

  test("filtra por búsqueda (input ¿Qué buscas?)", () => {
    renderPage();

    const searchInput = screen.getByPlaceholderText("¿Qué buscas?");
    fireEvent.change(searchInput, { target: { value: "Oficina" } });

    expect(
      screen.getByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Departamento Moderno Centro/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).not.toBeInTheDocument();
  });

  test("filtra por ubicación (input Ubicación)", () => {
    renderPage();

    const locationInput = screen.getByPlaceholderText("Ubicación");
    fireEvent.change(locationInput, { target: { value: "Quito" } });

    expect(
      screen.getByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Departamento Moderno Centro/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).not.toBeInTheDocument();
  });

  test("filtra por tipo desde el select (Venta)", () => {
    renderPage();

    const select = screen.getByDisplayValue("Tipo: Todos");
    fireEvent.change(select, { target: { value: "Venta" } });

    expect(
      screen.getByRole("heading", { name: /Departamento Moderno Centro/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).not.toBeInTheDocument();
  });

  test("chips rápidos: Alquiler filtra la lista", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "Alquiler" }));

    expect(
      screen.getByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Departamento Moderno Centro/i })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).not.toBeInTheDocument();
  });

  test("cuando no hay resultados muestra mensaje y permite limpiar filtros", () => {
    renderPage();

    fireEvent.change(screen.getByPlaceholderText("¿Qué buscas?"), {
      target: { value: "zzzzzz" },
    });

    expect(screen.getByText(/No encontramos coincidencias/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Limpiar filtros/i }));

    expect(
      screen.getByRole("heading", { name: /Departamento Moderno Centro/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Casa Familiar Las Terrazas/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Oficina Ejecutiva Piso 15/i })
    ).toBeInTheDocument();
  });

  test("toggle favorito incrementa el contador 'Mis Favoritos'", () => {
    renderPage();

    const favoritesLabel = screen.getByText(/Mis Favoritos/i);
    const favoritesBox = favoritesLabel.closest("div") as HTMLElement;

    expect(within(favoritesBox).getByText("0")).toBeInTheDocument();

    const favoriteButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.querySelector("svg"));

    fireEvent.click(favoriteButtons[0]);

    expect(within(favoritesBox).getByText("1")).toBeInTheDocument();
  });

  test("existe el link a dashboard", () => {
    renderPage();

    const link = screen.getByRole("link", { name: /DASHBOARD/i });
    expect(link).toHaveAttribute("href", "/dashboard/properties");
  });

  test("cada tarjeta tiene link 'Ver Propiedad' con ruta correcta", () => {
    renderPage();

    const links = screen.getAllByRole("link", { name: /Ver Propiedad/i });
    expect(links.length).toBeGreaterThan(0);

    expect(links[0].getAttribute("href")).toMatch(/^\/property\/\d+$/);
  });
});
