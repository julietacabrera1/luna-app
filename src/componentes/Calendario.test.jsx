
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import Calendario from "./Calendario";

const { mockGetUser, mockFrom, mockInsert } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockInsert: vi.fn(),
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
    insert: vi.fn((datos) => {
      mockInsert(datos);
      return consulta;
    }),
    single: vi.fn(() => Promise.resolve(respuesta)),
    then: (resolve, reject) =>
      Promise.resolve(respuesta).then(resolve, reject),
  };

  return consulta;
}

let eventos;

beforeEach(() => {
  eventos = [];

  mockGetUser.mockResolvedValue({
    data: {
      user: { id: "usuario-prueba" },
    },
    error: null,
  });

  mockFrom.mockImplementation(() =>
    crearConsulta({
      data: eventos,
      error: null,
    })
  );
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Calendario", () => {
  it("muestra el calendario y los eventos cargados", async () => {
    const hoy = new Date();

    const fechaHoy = [
      hoy.getFullYear(),
      String(hoy.getMonth() + 1).padStart(2, "0"),
      String(hoy.getDate()).padStart(2, "0"),
    ].join("-");

    eventos.push({
      id: 1,
      usuario_id: "usuario-prueba",
      titulo: "Evento de prueba",
      fecha: fechaHoy,
      hora: "10:30:00",
      creado_en: fechaHoy,
    });

    render(<Calendario />);

    expect(
      await screen.findByText("Mi calendario")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Evento de prueba")
    ).toBeInTheDocument();
  });

  it("permite seleccionar otro día del calendario", async () => {
    render(<Calendario />);

    await screen.findByText("Eventos del día");

    const diaSiguiente = new Date();
    diaSiguiente.setDate(diaSiguiente.getDate() + 1);

    const numeroDia = String(diaSiguiente.getDate());

    const botonDia = screen.getByRole("button", {
      name: new RegExp(`^${numeroDia}(,|$)`),
    });

    fireEvent.click(botonDia);

    const fechaEsperada = diaSiguiente.toLocaleDateString(
      "es-AR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    expect(
      screen.getByText(fechaEsperada)
    ).toBeInTheDocument();
  });

  it("permite crear un evento y guardarlo en Supabase", async () => {
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 1);

    const fechaEvento = [
      fechaFutura.getFullYear(),
      String(fechaFutura.getMonth() + 1).padStart(2, "0"),
      String(fechaFutura.getDate()).padStart(2, "0"),
    ].join("-");

    const eventoNuevo = {
      id: 20,
      usuario_id: "usuario-prueba",
      titulo: "Reunión de prueba",
      fecha: fechaEvento,
      hora: "10:00:00",
      creado_en: fechaEvento,
    };

    mockFrom.mockImplementation(() => {
      const consulta = crearConsulta({
        data: eventos,
        error: null,
      });

      consulta.single.mockResolvedValue({
        data: eventoNuevo,
        error: null,
      });

      return consulta;
    });

    render(<Calendario />);

    await screen.findByText("Eventos del día");

    // Seleccionar mañana en el calendario.
    const numeroDia = String(fechaFutura.getDate());

    const botonDia = screen.getByRole("button", {
      name: new RegExp(`^${numeroDia}(,|$)`),
    });

    fireEvent.click(botonDia);

    fireEvent.click(
      screen.getByRole("button", { name: "+ Crear evento" })
    );

    fireEvent.change(
      screen.getByLabelText("Nombre del evento"),
      {
        target: { value: "Reunión de prueba" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Hora"),
      {
        target: { value: "10:00" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Guardar evento" })
    );

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        usuario_id: "usuario-prueba",
        titulo: "Reunión de prueba",
        fecha: fechaEvento,
        hora: "10:00",
      });
    });

    expect(
      await screen.findByText("Reunión de prueba")
    ).toBeInTheDocument();
  });
});
