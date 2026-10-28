
import { useState } from "react";
import { supabase } from "../supabase";

function PerfilInicial({ alCrearPerfil }) {
  const [modo, setModo] = useState("registro");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [avatar, setAvatar] = useState("🌙");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const avatares = [
    "🌙", "🐰", "🐱", "🦊",
    "🐻", "🐼", "🦋", "🌸",
  ];

  const acceder = async (evento) => {
    evento.preventDefault();
    setMensaje("");

    const emailLimpio = email.trim().toLowerCase();
    const nombreLimpio = nombre.trim();

    if (!emailLimpio || !contrasena) {
      setMensaje("Completá tu correo y contraseña.");
      return;
    }

    if (modo === "registro" && !nombreLimpio) {
      setMensaje("Escribí el nombre que querés usar.");
      return;
    }

    if (modo === "registro" && contrasena.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      if (modo === "registro") {
        const { data, error } = await supabase.auth.signUp({
          email: emailLimpio,
          password: contrasena,
          options: {
            data: {
              nombre: nombreLimpio,
              avatar,
            },
          },
        });

        if (error) throw error;

        if (data.session && data.user) {
          const { error: perfilError } = await supabase
            .from("perfiles")
            .upsert({
              id: data.user.id,
              nombre: nombreLimpio,
              avatar,
            });

          if (perfilError) throw perfilError;

          alCrearPerfil({
            nombre: nombreLimpio,
            avatar,
            usuarioId: data.user.id,
            email: emailLimpio,
          });
        } else {
          setMensaje(
            "¡Cuenta creada! Revisá tu correo y confirmá tu dirección antes de iniciar sesión."
          );
          setModo("login");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailLimpio,
          password: contrasena,
        });

        if (error) throw error;

        const usuario = data.user;

        const { data: perfilGuardado, error: perfilError } =
          await supabase
            .from("perfiles")
            .select("nombre, avatar")
            .eq("id", usuario.id)
            .maybeSingle();

        if (perfilError) throw perfilError;

        const nombreUsuario =
          perfilGuardado?.nombre ||
          usuario.user_metadata?.nombre ||
          emailLimpio.split("@")[0];

        const avatarUsuario =
          perfilGuardado?.avatar ||
          usuario.user_metadata?.avatar ||
          "🌙";

        const { error: guardarError } = await supabase
          .from("perfiles")
          .upsert({
            id: usuario.id,
            nombre: nombreUsuario,
            avatar: avatarUsuario,
          });

        if (guardarError) throw guardarError;

        alCrearPerfil({
          nombre: nombreUsuario,
          avatar: avatarUsuario,
          usuarioId: usuario.id,
          email: emailLimpio,
        });
      }
    } catch (error) {
      setMensaje(
        error.message || "No pudimos completar la operación. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="perfil-inicial">
      <div className="perfil-inicial-contenido">
        <div className="perfil-inicial-logo">
          <img src="/imagenes/logo-luna.png.png" alt="LUNA" />
        </div>

        <span className="perfil-inicial-etiqueta">
          BIENVENIDO/A A LUNA
        </span>

        <h1>
          {modo === "registro"
            ? "Creemos tu espacio"
            : "Qué lindo tenerte de vuelta"}
        </h1>

        <p>
          {modo === "registro"
            ? "Creá tu cuenta para organizar tu vida desde cualquier dispositivo."
            : "Iniciá sesión para volver a tu espacio personal."}
        </p>

        <div className="acceso-modos">
          <button
            type="button"
            className={modo === "registro" ? "activo" : ""}
            onClick={() => {
              setModo("registro");
              setMensaje("");
            }}
          >
            Crear cuenta
          </button>

          <button
            type="button"
            className={modo === "login" ? "activo" : ""}
            onClick={() => {
              setModo("login");
              setMensaje("");
            }}
          >
            Iniciar sesión
          </button>
        </div>

        <form onSubmit={acceder}>
          {modo === "registro" && (
            <>
              <label htmlFor="nombre">
                ¿Cómo querés que te llamemos?
              </label>

              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Escribí tu nombre"
                maxLength={30}
                autoComplete="name"
                required
              />

              <label>¡Elegí tu avatar!</label>

              <div className="perfil-avatares">
                {avatares.map((opcion) => (
                  <button
                    type="button"
                    key={opcion}
                    className={`avatar-opcion ${
                      avatar === opcion ? "seleccionado" : ""
                    }`}
                    onClick={() => setAvatar(opcion)}
                    aria-label={`Elegir avatar ${opcion}`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </>
          )}

          <label htmlFor="email">Correo electrónico</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="tunombre@correo.com"
            autoComplete="email"
            required
          />

          <label htmlFor="contrasena">Contraseña</label>

          <input
            id="contrasena"
            type="password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete={
              modo === "registro" ? "new-password" : "current-password"
            }
            minLength={6}
            required
          />

          {mensaje && (
            <p className="acceso-mensaje" role="status">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            className="boton-comenzar"
            disabled={cargando}
          >
            {cargando
              ? "Un momento..."
              : modo === "registro"
                ? "Crear mi cuenta"
                : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PerfilInicial;

