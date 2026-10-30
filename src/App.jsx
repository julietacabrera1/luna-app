
import { useEffect, useRef, useState } from "react";

import { supabase } from "./supabase";

import ListaTareas from "./componentes/ListaTareas";
import Calendario from "./componentes/Calendario";
import Recordatorios from "./componentes/Recordatorios";
import PerfilInicial from "./componentes/PerfilInicial";
import PerfilUsuario from "./componentes/PerfilUsuario";
import MiProgreso from "./componentes/MiProgreso";

import "./styles/variables.css";
import "./App.css";

function App() {
  const [seccionActiva, setSeccionActiva] = useState("tareas");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pantallaMenu, setPantallaMenu] = useState(null);

  const [perfil, setPerfil] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  const menuRef = useRef(null);

  const secciones = [
    { id: "tareas", nombre: "Mis tareas", icono: "✓" },
    { id: "calendario", nombre: "Calendario", icono: "📅" },
    { id: "recordatorios", nombre: "Recordatorios", icono: "🔔" },
  ];

  const opcionesMenu = [
    {
      id: "perfil",
      nombre: "Mi perfil",
      descripcion: "Personalizá tu espacio",
      icono: "♡",
    },
    {
      id: "configuracion",
      nombre: "Configuración",
      descripcion: "Personalizá LUNA",
      icono: "⚙",
    },
    {
      id: "progreso",
      nombre: "Mi progreso",
      descripcion: "Conocé tus avances",
      icono: "✦",
    },
  ];

  // Recuperar el perfil correspondiente a la cuenta.
  const cargarPerfil = async (usuario) => {
    if (!usuario) {
      setPerfil(null);
      return;
    }

    const { data: perfilGuardado, error } = await supabase
      .from("perfiles")
      .select("nombre, avatar")
      .eq("id", usuario.id)
      .maybeSingle();

    if (error) {
      console.error("Error al recuperar el perfil:", error.message);
    }

    const nombre =
      perfilGuardado?.nombre ||
      usuario.user_metadata?.nombre ||
      usuario.email?.split("@")[0] ||
      "Usuario";

    const avatar =
      perfilGuardado?.avatar ||
      usuario.user_metadata?.avatar ||
      "🌙";

    // Crear el perfil en la base de datos si todavía no existe.
    if (!perfilGuardado) {
      const { error: guardarError } = await supabase
        .from("perfiles")
        .upsert({
          id: usuario.id,
          nombre,
          avatar,
        });

      if (guardarError) {
        console.error(
          "Error al guardar el perfil:",
          guardarError.message
        );
      }
    }

    setPerfil({
      nombre,
      avatar,
      usuarioId: usuario.id,
      email: usuario.email || "",
    });
  };

  // Comprobar si ya existe una sesión e identificar cambios de acceso.
  useEffect(() => {
    let activo = true;

    const recuperarSesion = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!activo) return;

      if (error) {
        console.error("Error al recuperar la sesión:", error.message);
        setCargandoSesion(false);
        return;
      }

      await cargarPerfil(data.session?.user ?? null);

      if (activo) {
        setCargandoSesion(false);
      }
    };

    recuperarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, sesion) => {
      if (evento === "SIGNED_OUT") {
        setPerfil(null);
        setPantallaMenu(null);
        setMenuAbierto(false);
        setCargandoSesion(false);
        return;
      }

      if (evento === "SIGNED_IN" || evento === "USER_UPDATED") {
        // Esperar fuera del callback antes de consultar la base de datos.
        setTimeout(async () => {
          if (!activo) return;

          await cargarPerfil(sesion?.user ?? null);

          if (activo) {
            setCargandoSesion(false);
          }
        }, 0);
      }
    });

    return () => {
      activo = false;
      subscription.unsubscribe();
    };
  }, []);

  // Cerrar el menú al hacer clic afuera.
  useEffect(() => {
    const cerrarMenuAlHacerClickAfuera = (evento) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(evento.target)
      ) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener(
      "mousedown",
      cerrarMenuAlHacerClickAfuera
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        cerrarMenuAlHacerClickAfuera
      );
    };
  }, []);

  const abrirPantallaMenu = (id) => {
    setPantallaMenu(id);
    setMenuAbierto(false);
  };

  const volverDesdeMenu = () => {
    setPantallaMenu(null);
  };

  const guardarPerfil = (perfilActualizado) => {
    setPerfil((anterior) => ({
      ...anterior,
      ...perfilActualizado,
    }));
  };

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("No se pudo cerrar la sesión:", error.message);
      alert("No pudimos cerrar la sesión. Intentá nuevamente.");
      return;
    }

    setPerfil(null);
    setPantallaMenu(null);
    setMenuAbierto(false);
  };

  const renderizarModulo = () => {
    if (seccionActiva === "calendario") {
      return <Calendario />;
    }

    if (seccionActiva === "recordatorios") {
      return <Recordatorios />;
    }

    return <ListaTareas />;
  };

  const opcionActiva = opcionesMenu.find(
    (opcion) => opcion.id === pantallaMenu
  );

  if (cargandoSesion) {
    return (
      <section className="perfil-inicial">
        <div className="perfil-inicial-contenido">
          <h1>LUNA 🌙</h1>
          <p>Preparando tu espacio...</p>
        </div>
      </section>
    );
  }

  if (!perfil) {
    return <PerfilInicial alCrearPerfil={setPerfil} />;
  }

  return (
    <div className="app-shell">
      <header className="luna-header">
        <div className="luna-marca">
          <span className="luna-logo">
            <img src="/imagenes/logo-luna.png.png" alt="" />
          </span>

          <div>
            <h1>LUNA</h1>
            <p>Tu vida. Tus cosas. Tu espacio</p>
          </div>
        </div>

        <div className="luna-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className={`luna-menu-boton ${
              menuAbierto ? "abierto" : ""
            }`}
            onClick={() => setMenuAbierto((anterior) => !anterior)}
            aria-label="Abrir menú de LUNA"
            aria-expanded={menuAbierto}
          >
            ☰
          </button>

          {menuAbierto && (
            <div className="luna-menu-desplegable">
              <div className="luna-menu-titulo">
                <span>MENÚ DE LUNA</span>
                <strong>Tu espacio personal</strong>
              </div>

              <div className="luna-menu-opciones">
                {opcionesMenu.map((opcion) => (
                  <button
                    type="button"
                    key={opcion.id}
                    className="luna-menu-tarjeta"
                    onClick={() => abrirPantallaMenu(opcion.id)}
                  >
                    <span className="luna-menu-icono">
                      {opcion.icono}
                    </span>

                    <span className="luna-menu-texto">
                      <strong>{opcion.nombre}</strong>
                      <small>{opcion.descripcion}</small>
                    </span>

                    <span className="luna-menu-flecha">›</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="luna-menu-tarjeta"
                onClick={cerrarSesion}
              >
                <span className="luna-menu-icono">↪</span>
                <span className="luna-menu-texto">
                  <strong>Cerrar sesión</strong>
                  <small>Salir de tu cuenta</small>
                </span>
                <span className="luna-menu-flecha">›</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {!pantallaMenu && (
        <nav
          className="luna-pestanas"
          aria-label="Secciones de Luna"
        >
          {secciones.map((seccion) => (
            <button
              key={seccion.id}
              type="button"
              className={`luna-pestana ${
                seccionActiva === seccion.id ? "activa" : ""
              }`}
              onClick={() => setSeccionActiva(seccion.id)}
              aria-current={
                seccionActiva === seccion.id ? "page" : undefined
              }
            >
              <span className="luna-pestana-icono">
                {seccion.icono}
              </span>

              <span>{seccion.nombre}</span>
            </button>
          ))}
        </nav>
      )}

                 <main className="luna-vista">
        {pantallaMenu ? (
          pantallaMenu === "perfil" ? (
            <>
              <PerfilUsuario
                perfil={perfil}
                alGuardarPerfil={guardarPerfil}
                alVolver={volverDesdeMenu}
              />

              <button
                type="button"
                className="boton-volver"
                onClick={volverDesdeMenu}
              >
                ← Volver
              </button>
            </>
          ) : pantallaMenu === "progreso" ? (
            <>
              <MiProgreso />

              <button
                type="button"
                className="boton-volver"
                onClick={volverDesdeMenu}
              >
                ← Volver
              </button>
            </>
          ) : (
            <button
              type="button"
              className="boton-volver"
              onClick={volverDesdeMenu}
            >
              ← Volver
            </button>
          )
        ) : (
          renderizarModulo()
        )}
      </main>
    </div>
  );
}

export default App;