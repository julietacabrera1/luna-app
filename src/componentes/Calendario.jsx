
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/Calendario.css";

const obtenerFechaLocal = (fecha = new Date()) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

function Calendario() {
  const hoy = obtenerFechaLocal();

  const [eventos, setEventos] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mesVisible, setMesVisible] = useState(() => {
    const fecha = new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  });

  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [hora, setHora] = useState("09:00");
  const [error, setError] = useState("");

  // Cargar únicamente los eventos del usuario autenticado.
  useEffect(() => {
    let activo = true;

    async function cargarEventos() {
      setCargando(true);
      setError("");

      try {
        const {
          data: { user },
          error: errorUsuario,
        } = await supabase.auth.getUser();

        if (errorUsuario) throw errorUsuario;

        if (!user) {
          throw new Error("Iniciá sesión para ver tus eventos.");
        }

        if (!activo) return;
        setUsuarioId(user.id);

        const { data, error: errorEventos } = await supabase
          .from("eventos")
          .select("id, usuario_id, titulo, fecha, hora, creado_en")
          .eq("usuario_id", user.id)
          .order("fecha", { ascending: true })
          .order("hora", { ascending: true });

        if (errorEventos) throw errorEventos;

        if (activo) {
          setEventos(
            (data || []).map((evento) => ({
              ...evento,
              fecha: String(evento.fecha).slice(0, 10),
              hora: String(evento.hora).slice(0, 5),
            }))
          );
        }
      } catch (err) {
        console.error("Error al cargar eventos:", err);

        if (activo) {
          setError(err.message || "No se pudieron cargar los eventos.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarEventos();

    return () => {
      activo = false;
    };
  }, []);

  const anio = mesVisible.getFullYear();
  const mes = mesVisible.getMonth();

  const nombreMes = mesVisible.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  const primerDia = new Date(anio, mes, 1);
  const cantidadDias = new Date(anio, mes + 1, 0).getDate();

  // La semana comienza el lunes.
  const espaciosIniciales = (primerDia.getDay() + 6) % 7;

  const dias = [
    ...Array(espaciosIniciales).fill(null),
    ...Array.from({ length: cantidadDias }, (_, i) => i + 1),
  ];

  const eventosDeFecha = eventos
    .filter((evento) => evento.fecha === fechaSeleccionada)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const cambiarMes = (cantidad) => {
    const nuevoMes = new Date(anio, mes + cantidad, 1);
    setMesVisible(nuevoMes);
    setFechaSeleccionada(obtenerFechaLocal(nuevoMes));
    setMostrarFormulario(false);
    setError("");
  };

  const seleccionarDia = (dia) => {
    if (!dia) return;

    const fecha = obtenerFechaLocal(new Date(anio, mes, dia));

    setFechaSeleccionada(fecha);
    setMostrarFormulario(false);
    setError("");
  };

  const abrirFormulario = () => {
    setTitulo("");
    setHora("09:00");
    setError("");
    setMostrarFormulario(true);
  };

  async function guardarEvento(e) {
    e.preventDefault();

    const tituloLimpio = titulo.trim();

    if (!tituloLimpio) {
      setError("Escribí un título para el evento.");
      return;
    }

    if (!usuarioId) {
      setError("Iniciá sesión para guardar eventos.");
      return;
    }

    const fechaEvento = new Date(`${fechaSeleccionada}T${hora}:00`);

    if (fechaEvento.getTime() < Date.now()) {
      setError("Elegí una fecha y hora actuales o futuras.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const { data, error: errorInsertar } = await supabase
        .from("eventos")
        .insert({
          usuario_id: usuarioId,
          titulo: tituloLimpio,
          fecha: fechaSeleccionada,
          hora,
        })
        .select("id, usuario_id, titulo, fecha, hora, creado_en")
        .single();

      if (errorInsertar) throw errorInsertar;

      const eventoGuardado = {
        ...data,
        fecha: String(data.fecha).slice(0, 10),
        hora: String(data.hora).slice(0, 5),
      };

      setEventos((anteriores) => [...anteriores, eventoGuardado]);
      setMostrarFormulario(false);
      setTitulo("");
      setError("");
    } catch (err) {
      console.error("Error al guardar el evento:", err);
      setError(err.message || "No se pudo guardar el evento.");
    } finally {
      setGuardando(false);
    }
  }

  const formatearFecha = (fecha) => {
    const [anioFecha, mesFecha, diaFecha] = fecha
      .split("-")
      .map(Number);

    return new Date(
      anioFecha,
      mesFecha - 1,
      diaFecha
    ).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="calendario-modulo">
      <div className="calendario-encabezado">
        <div>
          <span className="calendario-etiqueta">
            ORGANIZÁ TU TIEMPO
          </span>
          <h1>Mi calendario</h1>
          <p>Todos tus momentos importantes en un solo lugar.</p>
        </div>
      </div>

      {error && (
        <div className="mensaje-error" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <p>Cargando tus eventos...</p>
      ) : (
        <div className="calendario-contenido">
          <section className="card calendario">
            <div className="calendario-navegacion">
              <button
                type="button"
                className="boton-mes"
                onClick={() => cambiarMes(-1)}
                aria-label="Mes anterior"
              >
                ‹
              </button>

              <h2>
                {nombreMes.charAt(0).toUpperCase() +
                  nombreMes.slice(1)}
              </h2>

              <button
                type="button"
                className="boton-mes"
                onClick={() => cambiarMes(1)}
                aria-label="Mes siguiente"
              >
                ›
              </button>
            </div>

            <div className="calendario-grid">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                (dia) => (
                  <div key={dia} className="dia-header">
                    {dia}
                  </div>
                )
              )}

              {dias.map((dia, indice) => {
                if (dia === null) {
                  return (
                    <div
                      key={`vacio-${indice}`}
                      className="dia-vacio"
                      aria-hidden="true"
                    />
                  );
                }

                const fecha = obtenerFechaLocal(
                  new Date(anio, mes, dia)
                );

                const tieneEvento = eventos.some(
                  (evento) => evento.fecha === fecha
                );

                const esHoy = fecha === hoy;
                const seleccionado = fecha === fechaSeleccionada;

                return (
                  <button
                    type="button"
                    key={fecha}
                    className={[
                      "dia",
                      tieneEvento ? "marcado" : "",
                      esHoy ? "dia-hoy" : "",
                      seleccionado ? "dia-seleccionado" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => seleccionarDia(dia)}
                    aria-label={`${dia}${
                      tieneEvento ? ", tiene eventos" : ""
                    }${esHoy ? ", hoy" : ""}`}
                    aria-pressed={seleccionado}
                  >
                    <span>{dia}</span>
                    {tieneEvento && (
                      <span
                        className="indicador-evento"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="calendario-leyenda">
              <span className="leyenda-punto" />
              <span>Fecha con eventos</span>
            </div>
          </section>

          <section className="card panel-eventos">
            <div className="panel-eventos-titulo">
              <div>
                <span className="calendario-etiqueta">
                  TU AGENDA
                </span>
                <h2>Eventos del día</h2>
                <p>{formatearFecha(fechaSeleccionada)}</p>
              </div>

              <button
                type="button"
                className="boton-agregar-evento"
                onClick={abrirFormulario}
                disabled={guardando}
              >
                + Crear evento
              </button>
            </div>

            {mostrarFormulario && (
              <form
                className="formulario-evento"
                onSubmit={guardarEvento}
              >
                <h3>Nuevo evento</h3>

                <label htmlFor="titulo-evento">
                  Nombre del evento
                </label>
                <input
                  id="titulo-evento"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Turno médico"
                  maxLength={100}
                  autoFocus
                  required
                />

                <label htmlFor="fecha-evento">Fecha</label>
                <input
                  id="fecha-evento"
                  type="date"
                  value={fechaSeleccionada}
                  min={hoy}
                  onChange={(e) => {
                    if (!e.target.value) return;

                    setFechaSeleccionada(e.target.value);

                    const [nuevoAnio, nuevoMes] = e.target.value
                      .split("-")
                      .map(Number);

                    setMesVisible(
                      new Date(nuevoAnio, nuevoMes - 1, 1)
                    );
                    setError("");
                  }}
                  required
                />

                <label htmlFor="hora-evento">Hora</label>
                <input
                  id="hora-evento"
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                />

                <div className="acciones-formulario">
                  <button
                    type="button"
                    className="boton-cancelar"
                    onClick={() => {
                      setMostrarFormulario(false);
                      setError("");
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="boton-guardar-evento"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar evento"}
                  </button>
                </div>
              </form>
            )}

            {!mostrarFormulario && eventosDeFecha.length === 0 && (
              <div className="estado-vacio">
                <span className="icono-vacio">♡</span>
                <h3>No hay eventos para este día</h3>
                <p>
                  Podés agregar uno y lo vas a ver en tu calendario.
                </p>
              </div>
            )}

            {!mostrarFormulario && eventosDeFecha.length > 0 && (
              <div className="lista-eventos-dia">
                {eventosDeFecha.map((evento) => (
                  <article className="evento" key={evento.id}>
                    <span className="evento-hora">
                      {evento.hora}
                    </span>
                    <div className="evento-detalle">
                      <strong>{evento.titulo}</strong>
                      <span>{formatearFecha(evento.fecha)}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Calendario;
