
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "../styles/MiProgreso.css";

function MiProgreso() {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    async function cargarProgreso() {
      setCargando(true);
      setError("");

      try {
        const {
          data: { user },
          error: errorUsuario,
        } = await supabase.auth.getUser();

        if (errorUsuario) throw errorUsuario;
        if (!user) throw new Error("Iniciá sesión para consultar tu progreso.");

        const [
          { data: tareasDB, error: errorTareas },
          { data: categoriasDB, error: errorCategorias },
        ] = await Promise.all([
          supabase
            .from("tareas")
            .select("id, texto, categoria_id, completada, completada_en")
            .eq("usuario_id", user.id),
          supabase
            .from("categorias")
            .select("id, nombre")
            .eq("usuario_id", user.id),
        ]);

        if (errorTareas) throw errorTareas;
        if (errorCategorias) throw errorCategorias;

        if (!activo) return;

        setTareas(tareasDB || []);
        setCategorias(categoriasDB || []);
      } catch (err) {
        console.error("Error al cargar el progreso:", err);
        if (activo) {
          setError(err.message || "No se pudo cargar tu progreso.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarProgreso();

    return () => {
      activo = false;
    };
  }, []);

  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = tareas.filter((t) => !t.completada).length;
  const total = tareas.length;

  const porcentaje = total > 0
    ? Math.round((completadas / total) * 100)
    : 0;

  // Obtener los siete días de la semana actual, de lunes a domingo.
  const hoy = new Date();
  const lunes = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );

  const diaSemana = lunes.getDay();
  const diferencia = diaSemana === 0 ? 6 : diaSemana - 1;
  lunes.setDate(lunes.getDate() - diferencia);

  const diasSemana = Array.from({ length: 7 }, (_, indice) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + indice);

    return {
      fecha,
      clave: `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`,
      nombre: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"][indice],
      cantidad: 0,
    };
  });

  tareas.forEach((tarea) => {
    if (!tarea.completada_en) return;

    const fecha = new Date(tarea.completada_en);
    if (Number.isNaN(fecha.getTime())) return;

    const clave = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
    const dia = diasSemana.find((d) => d.clave === clave);

    if (dia) dia.cantidad += 1;
  });

  const maximoSemanal = Math.max(
    1,
    ...diasSemana.map((dia) => dia.cantidad)
  );

  const progresoCategorias = categorias.map((categoria) => {
    const tareasCategoria = tareas.filter(
      (t) => String(t.categoria_id) === String(categoria.id)
    );

    const hechas = tareasCategoria.filter((t) => t.completada).length;
    const cantidad = tareasCategoria.length;

    return {
      nombre: categoria.nombre,
      total: cantidad,
      completadas: hechas,
      porcentaje: cantidad > 0
        ? Math.round((hechas / cantidad) * 100)
        : 0,
    };
  });

  if (cargando) {
    return (
      <div className="progreso-container">
        <p className="progreso-cargando">Calculando tu progreso...</p>
      </div>
    );
  }

  return (
    <div className="progreso-container">
      <header className="progreso-encabezado">
        <p className="progreso-etiqueta">TU CAMINO EN LUNA</p>
        <h1>Mi progreso ✨</h1>
        <p>¡Cada pequeño paso cuenta! Mirá todo lo que estás logrando.</p>
      </header>

      {error && (
        <div className="progreso-error" role="alert">
          {error}
        </div>
      )}

      {!error && (
        <>
          <section className="progreso-resumen">
            <article className="progreso-card progreso-destacado">
              <div
               className="progreso-circulo"
                style={{ "--porcentaje": `${porcentaje}%` }}
            ></div>
              <div>
                <span className="progreso-card-etiqueta">PROGRESO GENERAL</span>
                <h2>{porcentaje === 100 && total > 0
                  ? "¡Lo lograste!"
                  : "Vas por buen camino"}
                </h2>
                <p>
                  {total === 0
                    ? "Cuando agregues tareas, vas a ver tus avances acá."
                    : `Completaste ${completadas} de ${total} tareas.`}
                </p>
              </div>
            </article>

            <article className="progreso-card">
              <span className="progreso-icono">✓</span>
              <span className="progreso-card-etiqueta">COMPLETADAS</span>
              <strong className="progreso-numero">{completadas}</strong>
              <p>Tareas finalizadas</p>
            </article>

            <article className="progreso-card">
              <span className="progreso-icono">◷</span>
              <span className="progreso-card-etiqueta">PENDIENTES</span>
              <strong className="progreso-numero">{pendientes}</strong>
              <p>Tareas por realizar</p>
            </article>
          </section>

          <section className="progreso-seccion">
            <div className="progreso-titulo">
              <div>
                <h2>Tu semana</h2>
                <p>Tareas que completaste de lunes a domingo</p>
              </div>
              <span className="progreso-insignia">Esta semana</span>
            </div>

            <div className="progreso-grafico">
              {diasSemana.map((dia) => (
                <div className="progreso-dia" key={dia.clave}>
                  <span className="progreso-cantidad">
                    {dia.cantidad}
                  </span>
                  <div className="progreso-barra-fondo">
                    <div
                      className="progreso-barra"
                      style={{
                        height: `${(dia.cantidad / maximoSemanal) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="progreso-dia-nombre">{dia.nombre}</span>
                </div>
              ))}
            </div>

            <p className="progreso-nota">
              Se cuentan las tareas marcadas como completadas durante esta semana.
            </p>
          </section>

          <section className="progreso-seccion">
            <div className="progreso-titulo">
              <div>
                <h2>Progreso por categoría</h2>
                <p>Descubrí cómo avanzás en cada área</p>
              </div>
            </div>

            {progresoCategorias.length === 0 ? (
              <p className="progreso-vacio">
                Todavía no tenés categorías creadas.
              </p>
            ) : (
              <div className="progreso-categorias">
                {progresoCategorias.map((categoria) => (
                  <article
                    className="progreso-categoria"
                    key={categoria.nombre}
                  >
                    <div className="progreso-categoria-info">
                      <strong>{categoria.nombre}</strong>
                      <span>
                        {categoria.completadas} de {categoria.total} completadas
                      </span>
                    </div>

                    <div className="progreso-linea-fondo">
                      <div
                        className="progreso-linea"
                        style={{ width: `${categoria.porcentaje}%` }}
                      />
                    </div>

                    <span className="progreso-porcentaje">
                      {categoria.porcentaje}%
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>

          <p className="progreso-mensaje-final">
            🌙 Seguí avanzando a tu ritmo. ¡Estás construyendo grandes hábitos!
          </p>
        </>
      )}
    </div>
  );
}

export default MiProgreso;
