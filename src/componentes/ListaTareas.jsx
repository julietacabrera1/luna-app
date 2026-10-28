
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";
import "../styles/ListaTareas.css";

const categoriasIniciales = [
  "Laboral",
  "Académico",
  "Personal",
];

function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [formularioCategoriaAbierto, setFormularioCategoriaAbierto] =
    useState(false);

  const [nueva, setNueva] = useState("");
  const [categoriaNueva, setCategoriaNueva] = useState("");
  const [filtro, setFiltro] = useState("Todas");
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  const [usuarioId, setUsuarioId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  // Cargar las categorías y tareas del usuario que inició sesión.
  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      setCargando(true);
      setError("");

      try {
        const { data: { user }, error: errorUsuario } =
          await supabase.auth.getUser();

        if (errorUsuario) throw errorUsuario;

        if (!user) {
          throw new Error("Iniciá sesión para ver tus tareas.");
        }

        if (!activo) return;
        setUsuarioId(user.id);

        // Buscar las categorías de este usuario.
        let { data: categoriasDB, error: errorCategorias } =
          await supabase
            .from("categorias")
            .select("id, nombre")
            .eq("usuario_id", user.id);

        if (errorCategorias) throw errorCategorias;

        // Crear las categorías predeterminadas si todavía no existen.
        if (!categoriasDB || categoriasDB.length === 0) {
          const nuevasCategorias = categoriasIniciales.map((nombre) => ({
            usuario_id: user.id,
            nombre,
          }));

          const { error: errorCrearCategorias } = await supabase
            .from("categorias")
            .insert(nuevasCategorias);

          if (errorCrearCategorias) throw errorCrearCategorias;

          const resultadoCategorias = await supabase
            .from("categorias")
            .select("id, nombre")
            .eq("usuario_id", user.id);

          if (resultadoCategorias.error) {
            throw resultadoCategorias.error;
          }

          categoriasDB = resultadoCategorias.data;
        }

        // Buscar las tareas del mismo usuario.
        const { data: tareasDB, error: errorTareas } = await supabase
          .from("tareas")
          .select("id, texto, categoria_id, completada, creado_en")
          .eq("usuario_id", user.id)
          .order("creado_en", { ascending: false });

        if (errorTareas) throw errorTareas;

        if (!activo) return;

        setCategorias(categoriasDB || []);
        setCategoriaNueva(
          categoriasDB?.length ? String(categoriasDB[0].id) : ""
        );

        // Mostrar el nombre de la categoría en cada tarea.
        const tareasAdaptadas = (tareasDB || []).map((tarea) => {
          const categoria = (categoriasDB || []).find(
            (c) => String(c.id) === String(tarea.categoria_id)
          );

          return {
            ...tarea,
            categoria: categoria?.nombre || "Sin categoría",
          };
        });

        setTareas(tareasAdaptadas);
      } catch (err) {
        console.error("Error al cargar LUNA:", err);

        if (activo) {
          setError(
            err.message || "No se pudieron cargar tus tareas."
          );
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };
  }, []);

  const pendientes = tareas.filter((t) => !t.completada).length;
  const completadas = tareas.filter((t) => t.completada).length;

  const tareasFiltradas =
    filtro === "Todas"
      ? tareas
      : tareas.filter((t) => t.categoria === filtro);

  async function agregar(e) {
    e?.preventDefault();

    const texto = nueva.trim();

    if (!texto) {
      inputRef.current?.focus();
      return;
    }

    if (!usuarioId || !categoriaNueva) {
      alert("Primero seleccioná una categoría.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const categoriaSeleccionada = categorias.find(
        (c) => String(c.id) === String(categoriaNueva)
      );

      if (!categoriaSeleccionada) {
        throw new Error("No se encontró la categoría seleccionada.");
      }

      const { data, error: errorInsertar } = await supabase
        .from("tareas")
        .insert({
          usuario_id: usuarioId,
          texto,
          categoria_id: categoriaSeleccionada.id,
          completada: false,
        })
        .select("id, texto, categoria_id, completada, creado_en")
        .single();

      if (errorInsertar) throw errorInsertar;

      setTareas((anteriores) => [
        {
          ...data,
          categoria: categoriaSeleccionada.nombre,
        },
        ...anteriores,
      ]);

      setNueva("");
      setFormularioAbierto(false);
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      setError(err.message || "No se pudo guardar la tarea.");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarCategoria(e) {
    e.preventDefault();

    const nombre = nuevaCategoria.trim();

    if (!nombre || !usuarioId) return;

    const yaExiste = categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (yaExiste) {
      alert("Esa categoría ya existe.");
      return;
    }

    setGuardando(true);
    setError("");

    try {
      const { data, error: errorInsertar } = await supabase
        .from("categorias")
        .insert({
          usuario_id: usuarioId,
          nombre,
        })
        .select("id, nombre")
        .single();

      if (errorInsertar) throw errorInsertar;

      setCategorias((anteriores) => [...anteriores, data]);
      setCategoriaNueva(String(data.id));
      setFiltro(data.nombre);
      setNuevaCategoria("");
      setFormularioCategoriaAbierto(false);
    } catch (err) {
      console.error("Error al crear la categoría:", err);
      setError(err.message || "No se pudo crear la categoría.");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id) {
    if (!usuarioId) return;

    setError("");

    const { error: errorEliminar } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id)
      .eq("usuario_id", usuarioId);

    if (errorEliminar) {
      console.error("Error al eliminar la tarea:", errorEliminar);
      setError(errorEliminar.message || "No se pudo eliminar la tarea.");
      return;
    }

    setTareas((anteriores) =>
      anteriores.filter((t) => t.id !== id)
    );
  }

  async function toggle(id) {
    if (!usuarioId) return;

    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    const nuevoEstado = !tarea.completada;
    setError("");

    const { error: errorActualizar } = await supabase
      .from("tareas")
      .update({ completada: nuevoEstado })
      .eq("id", id)
      .eq("usuario_id", usuarioId);

    if (errorActualizar) {
      console.error("Error al actualizar la tarea:", errorActualizar);
      setError(errorActualizar.message || "No se pudo actualizar la tarea.");
      return;
    }

    setTareas((anteriores) =>
      anteriores.map((t) =>
        t.id === id ? { ...t, completada: nuevoEstado } : t
      )
    );
  }

  function abrirNuevaTarea() {
    if (categorias.length === 0) {
      alert("Primero necesitás crear una categoría.");
      return;
    }

    setFormularioAbierto(true);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mis tareas</h1>
      </header>

      <main className="contenido-principal" id="inicio">
        <section className="bienvenida">
          <div>
            <p className="saludo">TU ESPACIO PERSONAL</p>
            <h2>Organizá tu día ✨</h2>
            <p className="subtitulo">
              Cada pequeña tarea te acerca a tus objetivos.
            </p>
          </div>

          <div className="contador-tareas">
            <span>Pendientes</span>
            <strong>{pendientes}</strong>
          </div>
        </section>

        {error && (
          <div role="alert" className="estado-vacio">
            <p>No pudimos completar la operación.</p>
            <p>{error}</p>
          </div>
        )}

        {cargando ? (
          <p>Cargando tus tareas...</p>
        ) : (
          <>
            <div className="seccion-categorias">
              <div className="encabezado-categorias">
                <div>
                  <h2>Mis categorías</h2>
                  <p>Organizá tus tareas a tu manera</p>
                </div>

                <button
                  type="button"
                  className="boton-nueva-categoria"
                  onClick={() =>
                    setFormularioCategoriaAbierto(
                      !formularioCategoriaAbierto
                    )
                  }
                  disabled={guardando}
                >
                  <span aria-hidden="true">＋</span>
                  Nueva categoría
                </button>
              </div>

              <nav className="categorias" aria-label="Filtrar tareas">
                {[
                  "Todas",
                  ...categorias.map((categoria) => categoria.nombre),
                ].map((nombre) => (
                  <button
                    key={nombre}
                    type="button"
                    className={filtro === nombre ? "activa" : ""}
                    aria-pressed={filtro === nombre}
                    onClick={() => setFiltro(nombre)}
                  >
                    {nombre}
                  </button>
                ))}
              </nav>

              {formularioCategoriaAbierto && (
                <form
                  className="formulario-categoria"
                  onSubmit={agregarCategoria}
                >
                  <label htmlFor="nombre-categoria">
                    Nombre de la nueva categoría
                  </label>

                  <input
                    id="nombre-categoria"
                    name="nombreCategoria"
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Ej. Salud, Proyectos, Hogar..."
                    maxLength={35}
                    autoFocus
                    required
                  />

                  <div className="acciones-formulario">
                    <button
                      type="button"
                      className="boton-cancelar"
                      onClick={() => {
                        setFormularioCategoriaAbierto(false);
                        setNuevaCategoria("");
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="boton-guardar"
                      disabled={guardando}
                    >
                      {guardando ? "Guardando..." : "Crear categoría"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <section className="card">
              <div className="encabezado-lista">
                <div>
                  <h2>
                    {filtro === "Todas"
                      ? "Todas mis tareas"
                      : `Tareas ${filtro.toLowerCase()}`}
                  </h2>

                  <p>
                    {tareasFiltradas.length === 1
                      ? "1 tarea"
                      : `${tareasFiltradas.length} tareas`}
                  </p>
                </div>
              </div>

              {formularioAbierto && (
                <form className="formulario-nueva" onSubmit={agregar}>
                  <label htmlFor="nueva-tarea">
                    ¿Qué necesitás hacer?
                  </label>

                  <input
                    ref={inputRef}
                    id="nueva-tarea"
                    type="text"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    placeholder="Ej. Estudiar para el examen..."
                    maxLength={160}
                    autoFocus
                    required
                  />

                  <label htmlFor="categoria-nueva">Categoría</label>

                  <select
                    id="categoria-nueva"
                    value={categoriaNueva}
                    onChange={(e) => setCategoriaNueva(e.target.value)}
                    required
                  >
                    {categorias.map((categoria) => (
                      <option
                        key={categoria.id}
                        value={String(categoria.id)}
                      >
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>

                  <div className="acciones-formulario">
                    <button
                      type="button"
                      className="boton-cancelar"
                      onClick={() => {
                        setFormularioAbierto(false);
                        setNueva("");
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="boton-guardar"
                      disabled={guardando}
                    >
                      {guardando ? "Guardando..." : "Guardar tarea"}
                    </button>
                  </div>
                </form>
              )}

              <ul className="lista">
                {tareasFiltradas.map((tarea) => (
                  <li
                    key={tarea.id}
                    className={tarea.completada ? "completada" : ""}
                  >
                    <input
                      type="checkbox"
                      checked={tarea.completada}
                      onChange={() => toggle(tarea.id)}
                      aria-label={`Marcar ${tarea.texto} como ${
                        tarea.completada ? "pendiente" : "completada"
                      }`}
                    />

                    <div className="tarea-contenido">
                      <span className="tarea-texto">{tarea.texto}</span>

                      <span className="etiqueta-categoria">
                        {tarea.categoria}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="eliminar"
                      onClick={() => eliminar(tarea.id)}
                      aria-label={`Eliminar ${tarea.texto}`}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>

              {tareasFiltradas.length === 0 && (
                <div className="estado-vacio">
                  <span>🌱</span>
                  <h3>No hay tareas por aquí</h3>
                  <p>
                    Agregá una tarea nueva y empezá a organizarte.
                  </p>

                  <button
                    type="button"
                    className="boton-guardar"
                    onClick={abrirNuevaTarea}
                  >
                    Crear tarea
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <button
        type="button"
        className="boton-flotante"
        onClick={abrirNuevaTarea}
        aria-label="Crear nueva tarea"
        title="Crear nueva tarea"
        disabled={cargando || guardando}
      >
        +
      </button>
    </div>
  );
}

export default ListaTareas;
