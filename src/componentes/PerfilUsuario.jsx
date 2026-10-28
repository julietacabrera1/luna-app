
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PerfilUsuario({ perfil, alGuardarPerfil, alVolver }) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(perfil?.nombre || "");
  const [avatar, setAvatar] = useState(perfil?.avatar || "🌙");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const avatares = [
    "🌙",
    "🐰",
    "🐱",
    "🦊",
    "🐻",
    "🐼",
    "🦋",
    "🌸",
  ];

  // Mantener los campos sincronizados con el perfil recibido.
  useEffect(() => {
    setNombre(perfil?.nombre || "");
    setAvatar(perfil?.avatar || "🌙");
  }, [perfil?.nombre, perfil?.avatar]);

  const guardarCambios = async (evento) => {
    evento.preventDefault();
    setMensaje("");
    setTipoMensaje("");

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setMensaje("Escribí tu nombre antes de guardar.");
      setTipoMensaje("error");
      return;
    }

    setGuardando(true);

    try {
      // Identificar al usuario que tiene la sesión iniciada.
      const {
        data: { user },
        error: errorUsuario,
      } = await supabase.auth.getUser();

      if (errorUsuario) throw errorUsuario;

      if (!user) {
        throw new Error(
          "Tu sesión no está activa. Iniciá sesión nuevamente."
        );
      }

      // Actualizar el perfil correspondiente a este usuario.
      const { data, error: errorPerfil } = await supabase
        .from("perfiles")
        .upsert(
          {
            id: user.id,
            nombre: nombreLimpio,
            avatar,
          },
          { onConflict: "id" }
        )
        .select("id, nombre, avatar")
        .single();

      if (errorPerfil) throw errorPerfil;

      const perfilActualizado = {
        ...perfil,
        nombre: data.nombre,
        avatar: data.avatar || "🌙",
        usuarioId: user.id,
        email: perfil?.email || user.email,
      };

      // Actualizar el estado de LUNA.
      alGuardarPerfil(perfilActualizado);

      // Mantener una copia local como respaldo visual.
      localStorage.setItem(
        "luna-perfil",
        JSON.stringify(perfilActualizado)
      );

      setNombre(data.nombre);
      setAvatar(data.avatar || "🌙");
      setEditando(false);
      setMensaje("¡Tu perfil se guardó correctamente!");
      setTipoMensaje("exito");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);

      setMensaje(
        error.message ||
          "No pudimos guardar los cambios. Intentá nuevamente."
      );
      setTipoMensaje("error");
    } finally {
      setGuardando(false);
    }
  };

  const cancelarEdicion = () => {
    setNombre(perfil?.nombre || "");
    setAvatar(perfil?.avatar || "🌙");
    setMensaje("");
    setTipoMensaje("");
    setEditando(false);
  };

  return (
    <section className="perfil-pagina">
      <div className="perfil-tarjeta">
        <button
          type="button"
          className="perfil-volver"
          onClick={alVolver}
        >
          ← Volver a atrás
        </button>

        <div className="perfil-avatar-grande">
          {editando ? avatar : perfil?.avatar || "🌙"}
        </div>

        {!editando ? (
          <>
            <span className="perfil-etiqueta">
              MI ESPACIO PERSONAL
            </span>

            <h2>{perfil?.nombre || "Mi perfil"}</h2>

            <p className="perfil-descripcion">
              Este es tu espacio en LUNA.
              Personalizalo a tu manera.
            </p>

            {mensaje && (
              <p
                className={
                  tipoMensaje === "error"
                    ? "mensaje-error"
                    : "mensaje-exito"
                }
                role="status"
              >
                {mensaje}
              </p>
            )}

            <button
              type="button"
              className="perfil-boton-principal"
              onClick={() => {
                setNombre(perfil?.nombre || "");
                setAvatar(perfil?.avatar || "🌙");
                setMensaje("");
                setTipoMensaje("");
                setEditando(true);
              }}
            >
              ✎ Editar perfil
            </button>
          </>
        ) : (
          <>
            <span className="perfil-etiqueta">
              PERSONALIZÁ TU ESPACIO
            </span>

            <h2>Editar perfil</h2>

            <form
              className="perfil-formulario"
              onSubmit={guardarCambios}
            >
              <label htmlFor="perfil-nombre">
                Tu nombre
              </label>

              <input
                id="perfil-nombre"
                type="text"
                value={nombre}
                onChange={(evento) =>
                  setNombre(evento.target.value)
                }
                maxLength={30}
                placeholder="Escribí tu nombre"
                autoComplete="name"
                required
              />

              <label>Elegí tu avatar</label>

              <div className="perfil-avatares">
                {avatares.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    className={`avatar-opcion ${
                      avatar === opcion ? "seleccionado" : ""
                    }`}
                    onClick={() => setAvatar(opcion)}
                    aria-label={`Elegir avatar ${opcion}`}
                    aria-pressed={avatar === opcion}
                  >
                    {opcion}
                  </button>
                ))}
              </div>

              {mensaje && (
                <p
                  className={
                    tipoMensaje === "error"
                      ? "mensaje-error"
                      : "mensaje-exito"
                  }
                  role="status"
                >
                  {mensaje}
                </p>
              )}

              <button
                type="submit"
                className="perfil-boton-principal"
                disabled={guardando || !nombre.trim()}
              >
                {guardando
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>

              <button
                type="button"
                className="perfil-boton-secundario"
                onClick={cancelarEdicion}
                disabled={guardando}
              >
                Cancelar
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default PerfilUsuario;
