
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

import Recordatorios from "./Recordatorios";

const {
  mockGetUser,
  mockFrom,
  mockInsert,
  mockUpdate,
  mockDelete,
  mockRespuestaMutacion,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
  mockRespuestaMutacion: vi.fn(),
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

    update: vi.fn((datos) => {
      mockUpdate(datos);
      return consulta;
    }),

    delete: vi.fn(() => {
      mockDelete();
      return consulta;
    }),

    single: vi.fn(() =>
      Promise.resolve(mockRespuestaMutacion())
    ),

    then: (resolve, reject) =>
      Promise.resolve(respuesta).then(resolve, reject),
  };

  return consulta;
}

let eventos;

const obtenerFechaFutura = (dias = 1) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
};

const crearEvento = (datos = {}) => ({
  id: 1,
  usuario_id: "usuario-prueba",
  titulo: "Evento de prueba",
  fecha: obtenerFechaFutura(),
  hora: "10:00:00",
  creado_en: obtenerFechaFutura(),
  ...datos,
});

beforeEach(() => {
  eventos = [];

  mockGetUser.mockResolvedValue({
    data: {
      user: { id: "usuario-prueba" },
    },
    error: null,
  });

  mockRespuestaMutacion.mockImplementation(() => ({
    data: crearEvento(),
    error: null,
  }));

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

describe("Recordatorios", () => {
  it("muestra los eventos cargados desde Supabase", async () => {
    eventos.push(
      crearEvento({
        titulo: "Turno médico",
      })
    );

    render(<Recordatorios />);

    expect(
      await screen.findByText("Mis próximos eventos")
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Turno médico")
    ).toBeInTheDocument();
  });

  it("oculta los eventos pasados y ordena los próximos por fecha", async () => {
    const fechaPasada = new Date();
    fechaPasada.setDate(fechaPasada.getDate() - 2);

    const fechaPasadaTexto = [
      fechaPasada.getFullYear(),
      String(fechaPasada.getMonth() + 1).padStart(2, "0"),
      String(fechaPasada.getDate()).padStart(2, "0"),
    ].join("-");

    eventos.push(
      crearEvento({
        id: 1,
        titulo: "Evento lejano",
        fecha: obtenerFechaFutura(3),
      }),
      crearEvento({
        id: 2,
        titulo: "Evento vencido",
        fecha: fechaPasadaTexto,
        hora: "10:00",
      }),
      crearEvento({
        id: 3,
        titulo: "Evento cercano",
        fecha: obtenerFechaFutura(1),
      })
    );

    render(<Recordatorios />);

    expect(
      await screen.findByText("Evento cercano")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Evento lejano")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Evento vencido")
    ).not.toBeInTheDocument();

    const titulos = Array.from(
      document.querySelectorAll(".recordatorio-info strong")
    ).map((elemento) => elemento.textContent);

    expect(titulos).toEqual([
      "Evento cercano",
      "Evento lejano",
    ]);
  });

  it("permite crear un evento y guardarlo en Supabase", async () => {
    const fecha = obtenerFechaFutura();

    const eventoNuevo = crearEvento({
      id: 20,
      titulo: "Reunión importante",
      fecha,
      hora: "10:00",
    });

    mockRespuestaMutacion.mockReturnValue({
      data: eventoNuevo,
      error: null,
    });

    render(<Recordatorios />);

    // Esperar a que se autentique el usuario y se carguen los eventos.
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalled();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Nuevo evento",
      })
    );

    fireEvent.change(
      screen.getByLabelText("Nombre del evento"),
      {
        target: { value: "Reunión importante" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Fecha"),
      {
        target: { value: fecha },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Hora"),
      {
        target: { value: "10:00" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Crear evento",
      })
    );

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        usuario_id: "usuario-prueba",
        titulo: "Reunión importante",
        fecha,
        hora: "10:00",
      });
    });

    expect(
      await screen.findByText("Reunión importante")
    ).toBeInTheDocument();
  });

  it("permite editar un evento existente", async () => {
    const evento = crearEvento({
      id: 5,
      titulo: "Consulta original",
    });

    eventos.push(evento);

    const fechaNueva = obtenerFechaFutura(2);

    mockRespuestaMutacion.mockReturnValue({
      data: {
        ...evento,
        titulo: "Consulta modificada",
        fecha: fechaNueva,
        hora: "11:30",
      },
      error: null,
    });

    render(<Recordatorios />);

    await screen.findByText("Consulta original");

    fireEvent.click(
      screen.getByRole("button", { name: "Editar" })
    );

    fireEvent.change(
      screen.getByLabelText("Nombre del evento"),
      {
        target: { value: "Consulta modificada" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Fecha"),
      {
        target: { value: fechaNueva },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Hora"),
      {
        target: { value: "11:30" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Guardar cambios",
      })
    );

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        titulo: "Consulta modificada",
        fecha: fechaNueva,
        hora: "11:30",
      });
    });

    expect(
      await screen.findByText("Consulta modificada")
    ).toBeInTheDocument();
  });

  it("permite posponer un evento", async () => {
    const evento = crearEvento({
      id: 8,
      titulo: "Entrega de trabajo",
    });

    eventos.push(evento);

    const fechaNueva = obtenerFechaFutura(3);

    mockRespuestaMutacion.mockReturnValue({
      data: {
        ...evento,
        fecha: fechaNueva,
        hora: "12:00",
      },
      error: null,
    });

    render(<Recordatorios />);

    await screen.findByText("Entrega de trabajo");

    // Abrir el formulario para posponer.
    fireEvent.click(
      screen.getByRole("button", { name: "Posponer" })
    );

    expect(
      screen.getByText("Elegir nueva fecha")
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByLabelText("Fecha"),
      {
        target: { value: fechaNueva },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Hora"),
      {
        target: { value: "12:00" },
      }
    );

    // Ahora hay dos botones Posponer: elegimos el primero,
    // que corresponde al botón de guardar del formulario.
    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Posponer",
      })[0]
    );

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        fecha: fechaNueva,
        hora: "12:00",
      });
    });

    expect(
      await screen.findByText("Entrega de trabajo")
    ).toBeInTheDocument();
  });

  it("permite eliminar un evento después de confirmar", async () => {
    eventos.push(
      crearEvento({
        id: 15,
        titulo: "Evento para eliminar",
      })
    );

    render(<Recordatorios />);

    await screen.findByText("Evento para eliminar");

    fireEvent.click(
      screen.getByRole("button", { name: "Eliminar" })
    );

    expect(
      screen.getByRole("alertdialog")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sí, eliminar",
      })
    );

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Evento para eliminar")
      ).not.toBeInTheDocument();
    });
  });
});

