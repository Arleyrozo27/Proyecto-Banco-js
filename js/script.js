function validarFormulario() {
  const pais = document.getElementById("pais").value;
  const telefono = document.getElementById("telefono").value.trim();
  const tipoDoc = document.getElementById("tipo-doc").value;
  const docNumero = document.getElementById("doc-numero").value.trim();
  const claveIngresada = document.getElementById("contrasena").value.trim();
  const mantenerSesion = document.getElementById("mantenerSesion").checked;
  const error = document.getElementById("error");

  error.textContent = "";

  if (!telefono || !docNumero || !claveIngresada) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos obligatorios',
      text: 'Por favor completa todos los campos.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2b6cb0'
    });
    return;
  }

  const db = JSON.parse(localStorage.getItem("usuarios-db")) || {};
  let usuario = null;

  for (const key in db) {
    if (db[key].telefono === telefono || db[key].documento === docNumero) {
      usuario = db[key];
      break;
    }
  }

  if (!usuario || usuario.clave !== claveIngresada) {
    Swal.fire({
      icon: 'error',
      title: 'Credenciales inválidas',
      text: 'Contraseña incorrecta o usuario no registrado.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  const usuarioActual = {
    nombre: usuario.nombre,
    telefono: usuario.telefono,
    tipoDoc: usuario.tipoDoc,
    documento: usuario.documento,
    email: usuario.email,
    pais: pais
  };

  if (mantenerSesion) {
    localStorage.setItem("sesion-activa", JSON.stringify(usuarioActual));
  } else {
    sessionStorage.setItem("sesion-activa", JSON.stringify(usuarioActual));
  }

  Swal.fire({
    icon: 'success',
    title: `¡Bienvenido, ${usuario.nombre}!`,
    text: 'Inicio de sesión exitoso.',
    confirmButtonText: 'Ir al panel',
    confirmButtonColor: '#2b6cb0'
  }).then(() => {
    window.location.href = "/html/banco-.html";
  });
}