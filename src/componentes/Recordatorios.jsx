
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/Recordatorios.css";

const obtenerFechaLocal = (fecha = new Date()) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

const normalizarEvento = (evento) => ({
  ...evento,
  fecha: String(evento.fecha).slice(0, 10),
  hora: String(evento.hora || "09:00").slice(0, 5),
});

function Recordatorios() {
  const hoy = obtenerFechaLocal();

  const [lista, setLista] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [modo, setModo] = useState(null);
  const [eventoActivo, setEventoActivo] = useState(null);

  const [texto, setTexto] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [hora, setHora] = useState("09:00");
  const [error, setError] = useState("");

  const [eventoEliminar, setEventoEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarEventos = async () => {
      setCargando(true);
      setError("");

      const {
        data: { user },
        error: errorAuth,
      } = await supabase.auth.getUser();

      if (!activo) return;

      if (errorAuth || !user) {
        setError(
          "No pudimos identificar tu sesión. Iniciá sesión nuevamente."
        );
        setCargando(false);
        return;
      }

      setUsuarioId(user.id);

      const { data, error: errorEventos } = await supabase
        .from("eventos")
        .select("id, usuario_id, titulo, fecha, hora, creado_en")
        .eq("usuario_id", user.id)
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (!activo) return;

      if (errorEventos) {
        console.error("Error al cargar eventos:", errorEventos);
        setError(
          "No pudimos cargar tus eventos. Intentá nuevamente."
        );
      } else {
        setLista((data || []).map(normalizarEvento));
      }

      setCargando(false);
    };

    cargarEventos();

    return () => {
      activo = false;
    };
  }, []);

  const eventosProximos = lista
    .filter((evento) => {
      const fechaEvento = new Date(
        `${evento.fecha}T${evento.hora}:00`
      );

      return fechaEvento.getTime() >= Date.now();
    })
    .sort((a, b) => {
      const fechaA = new Date(
        `${a.fecha}T${a.hora}:00`
      ).getTime();

      const fechaB = new Date(
        `${b.fecha}T${b.hora}:00`
      ).getTime();

      return fechaA - fechaB;
    });

  const formatearFecha = (fechaEvento) => {
    const [anio, mes, dia] = fechaEvento.split("-").map(Number);

    return new Date(anio, mes - 1, dia).toLocaleDateString(
      "es-AR",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const abrirCrear = () => {
    setModo("crear");
    setEventoActivo(null);
    setTexto("");
    setFecha(hoy);
    setHora("09:00");
    setError("");
  };

  const abrirEditar = (evento) => {
    setModo("editar");
    setEventoActivo(evento);
    setTexto(evento.titulo);
    setFecha(evento.fecha);
    setHora(evento.hora);
    setError("");
  };

  const abrirPosponer = (evento) => {
    setModo("posponer");
    setEventoActivo(evento);
    setTexto(evento.titulo);
    setFecha(evento.fecha);
    setHora(evento.hora);
    setError("");
  };

  const cerrarFormulario = () => {
    setModo(null);
    setEventoActivo(null);
    setError("");
  };

  const guardarFormulario = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuarioId) {
      setError("Iniciá sesión para guardar tus eventos.");
      return;
    }

    if (!texto.trim() && modo !== "posponer") {
      setError("Escribí un nombre para el evento.");
      return;
    }

    if (!fecha || !hora) {
      setError("Completá la fecha y la hora.");
      return;
    }

    const fechaEvento = new Date(`${fecha}T${hora}:00`);

    if (fechaEvento.getTime() < Date.now()) {
      setError("Elegí una fecha y hora actuales o futuras.");
      return;
    }

    setGuardando(true);

    try {
      if (modo === "crear") {
        const { data, error: errorInsertar } = await supabase
          .from("eventos")
          .insert({
            usuario_id: usuarioId,
            titulo: texto.trim(),
            fecha,
            hora,
          })
          .select("id, usuario_id, titulo, fecha, hora, creado_en")
          .single();

        if (errorInsertar) throw errorInsertar;

        setLista((anterior) => [
          ...anterior,
          normalizarEvento(data),
        ]);
      }

      if (modo === "editar" && eventoActivo) {
        const { data, error: errorActualizar } = await supabase
          .from("eventos")
          .update({
            titulo: texto.trim(),
            fecha,
            hora,
          })
          .eq("id", eventoActivo.id)
          .eq("usuario_id", usuarioId)
          .select("id, usuario_id, titulo, fecha, hora, creado_en")
          .single();

        if (errorActualizar) throw errorActualizar;

        setLista((anterior) =>
          anterior.map((evento) =>
            evento.id === eventoActivo.id
              ? normalizarEvento(data)
              : evento
          )
        );
      }

      if (modo === "posponer" && eventoActivo) {
        const { data, error: errorPosponer } = await supabase
          .from("eventos")
          .update({ fecha, hora })
          .eq("id", eventoActivo.id)
          .eq("usuario_id", usuarioId)
          .select("id, usuario_id, titulo, fecha, hora, creado_en")
          .single();

        if (errorPosponer) throw errorPosponer;

        setLista((anterior) =>
          anterior.map((evento) =>
            evento.id === eventoActivo.id
              ? normalizarEvento(data)
              : evento
          )
        );
      }

      cerrarFormulario();
    } catch (err) {
      console.error("Error al guardar evento:", err);
      setError(
        "No pudimos guardar los cambios. Revisá tu conexión e intentá nuevamente."
      );
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!eventoEliminar || !usuarioId || eliminando) return;

    setEliminando(true);
    setError("");

    const { error: errorEliminar } = await supabase
      .from("eventos")
      .delete()
      .eq("id", eventoEliminar.id)
      .eq("usuario_id", usuarioId);

    if (errorEliminar) {
      console.error("Error al eliminar evento:", errorEliminar);
      setError("No pudimos eliminar el evento. Intentá nuevamente.");
      setEliminando(false);
      setEventoEliminar(null);
      return;
    }

    setLista((anterior) =>
      anterior.filter((evento) => evento.id !== eventoEliminar.id)
    );

    setEventoEliminar(null);
    setEliminando(false);
  };

  return (
    <main className="recordatorios-modulo">
      <div className="recordatorios-encabezado">
        <div>
          <span className="recordatorios-etiqueta">
            TU AGENDA
          </span>

          <h1>Recordatorios</h1>

          <p>
            No te olvides de lo que es importante para vos.
          </p>
        </div>

        <button
          type="button"
          className="boton-nuevo-recordatorio"
          onClick={abrirCrear}
        >
          + Nuevo evento
        </button>
      </div>

      {modo && (
        <section className="card formulario-recordatorio">
          <div className="formulario-titulo">
            <span className="recordatorios-etiqueta">
              {modo === "crear"
                ? "NUEVO EVENTO"
                : modo === "editar"
                ? "EDITAR EVENTO"
                : "POSPONER EVENTO"}
            </span>

            <h2>
              {modo === "crear"
                ? "Crear evento"
                : modo === "editar"
                ? "Modificar evento"
                : "Elegir nueva fecha"}
            </h2>
          </div>

          <form onSubmit={guardarFormulario}>
            {modo !== "posponer" && (
              <>
                <label htmlFor="recordatorio-texto">
                  Nombre del evento
                </label>

                <input
                  id="recordatorio-texto"
                  type="text"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Ej. Turno médico"
                  maxLength={100}
                  autoFocus
                  required
                />
              </>
            )}

            <label htmlFor="recordatorio-fecha">
              Fecha
            </label>

            <input
              id="recordatorio-fecha"
              type="date"
              value={fecha}
              min={hoy}
              onChange={(e) => setFecha(e.target.value)}
              required
            />

            <label htmlFor="recordatorio-hora">
              Hora
            </label>

            <input
              id="recordatorio-hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />

            {error && (
              <p className="mensaje-error">{error}</p>
            )}

            <div className="acciones-formulario">
              <button
                type="button"
                className="boton-cancelar"
                onClick={cerrarFormulario}
                disabled={guardando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="boton-guardar"
                disabled={guardando}
              >
                {guardando
                  ? "Guardando..."
                  : modo === "posponer"
                  ? "Posponer"
                  : modo === "editar"
                  ? "Guardar cambios"
                  : "Crear evento"}
              </button>
            </div>
          </form>
        </section>
      )}

      {error && !modo && (
        <p className="mensaje-error">{error}</p>
      )}

      <section className="card lista-recordatorios">
        <div className="lista-encabezado">
          <div>
            <span className="recordatorios-etiqueta">
              LO MÁS PRÓXIMO
            </span>

            <h2>Mis próximos eventos</h2>
          </div>

          <span className="contador-recordatorios">
            {eventosProximos.length}
          </span>
        </div>

        {cargando ? (
          <div className="recordatorios-vacio">
            <p>Cargando tus eventos...</p>
          </div>
        ) : eventosProximos.length === 0 ? (
          <div className="recordatorios-vacio">
            <span>♡</span>

            <h3>No tenés eventos próximos</h3>

            <p>
              Cuando agregues uno desde el calendario,
              va a aparecer acá.
            </p>
          </div>
        ) : (
          <div className="lista-eventos">
            {eventosProximos.map((evento) => {
              const fechaMostrada = new Date(
                `${evento.fecha}T12:00:00`
              );

              return (
                <article
                  key={evento.id}
                  className="recordatorio"
                >
                  <div className="recordatorio-fecha">
                    <strong>
                      {fechaMostrada.toLocaleDateString(
                        "es-AR",
                        { day: "2-digit" }
                      )}
                    </strong>

                    <span>
                      {fechaMostrada
                        .toLocaleDateString("es-AR", {
                          month: "short",
                        })
                        .replace(".", "")}
                    </span>
                  </div>

                  <div className="recordatorio-info">
                    <strong>{evento.titulo}</strong>

                    <span>
                      {formatearFecha(evento.fecha)}
                      {" · "}
                      {evento.hora}
                    </span>
                  </div>

                  <div className="acciones">
                    <button
                      type="button"
                      className="editar"
                      onClick={() => abrirEditar(evento)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="posponer"
                      onClick={() => abrirPosponer(evento)}
                    >
                      Posponer
                    </button>

                    <button
                      type="button"
                      className="eliminar"
                      onClick={() => setEventoEliminar(evento)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <button
        type="button"
        className="boton-flotante"
        onClick={abrirCrear}
        aria-label="Crear nuevo evento"
      >
        +
      </button>

      {eventoEliminar && (
        <div
          className="luna-modal-fondo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !eliminando) {
              setEventoEliminar(null);
            }
          }}
        >
          <section
            className="luna-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmacion"
            aria-describedby="texto-confirmacion"
          >
            <div className="luna-modal-icono">
              <span aria-hidden="true">🗑️</span>
            </div>

            <h2 id="titulo-confirmacion">
              ¿Eliminar este evento?
            </h2>

            <p id="texto-confirmacion">
              <strong>{eventoEliminar.titulo}</strong>
              {" "}
              desaparecerá de tu calendario y de tus recordatorios.
              Esta acción no se puede deshacer.
            </p>

            <div className="luna-modal-acciones">
              <button
                type="button"
                className="luna-modal-cancelar"
                onClick={() => setEventoEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="luna-modal-eliminar"
                onClick={confirmarEliminacion}
                disabled={eliminando}
              >
                {eliminando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Recordatorios;

