import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import ListaTareas from "./ListaTareas";

const { mockGetUser, mockFrom, mockUpdate } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("../supabase", () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}));

function crearConsulta(respuesta) {
  const consulta = {
    select: vi.fn(() => consulta),
    eq: vi.fn(() => consulta),
    order: vi.fn(() => consulta),
    insert: vi.fn(() => consulta),
    update: vi.fn((datos) => {
      mockUpdate(datos);
      return consulta;
    }),
    delete: vi.fn(() => consulta),
    single: vi.fn(() => Promise.resolve(respuesta)),
    then: (resolve, reject) =>
      Promise.resolve(respuesta).then(resolve, reject),
  };

  return consulta;
}

const categorias = [
  { id: 1, nombre: "Laboral" },
  { id: 2, nombre: "Académico" },
  { id: 3, nombre: "Personal" },
];

const tareas = [
  {
    id: 10,
    texto: "Estudiar para el parcial",
    categoria_id: 2,
    completada: false,
    creado_en: "2026-10-30T10:00:00",
    completada_en: null,
  },
  {
    id: 11,
    texto: "Comprar materiales",
    categoria_id: 1,
    completada: false,
    creado_en: "2026-10-29T10:00:00",
    completada_en: null,
  },
];

beforeEach(() => {
  mockGetUser.mockResolvedValue({
    data: {
      user: { id: "usuario-prueba" },
    },
    error: null,
  });

  mockFrom.mockImplementation((tabla) => {
    if (tabla === "categorias") {
      return crearConsulta({
        data: categorias,
        error: null,
      });
    }

    return crearConsulta({
      data: tareas,
      error: null,
    });
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ListaTareas", () => {
  it("muestra las tareas cargadas desde Supabase", async () => {
    render(<ListaTareas />);

    expect(
      await screen.findByText("Estudiar para el parcial")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Comprar materiales")
    ).toBeInTheDocument();
  });

  it("filtra las tareas por categoría", async () => {
    render(<ListaTareas />);

    await screen.findByText("Estudiar para el parcial");

    fireEvent.click(
      screen.getByRole("button", { name: "Académico" })
    );

    expect(
      screen.getByText("Estudiar para el parcial")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Comprar materiales")
    ).not.toBeInTheDocument();
  });

  it("marca una tarea como completada y actualiza Supabase", async () => {
    render(<ListaTareas />);

    const checkbox = await screen.findByRole("checkbox", {
      name: "Marcar Estudiar para el parcial como completada",
    });

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          completada: true,
          completada_en: expect.any(String),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", {
          name: "Marcar Estudiar para el parcial como pendiente",
        })
      ).toBeChecked();
    });
  });
});