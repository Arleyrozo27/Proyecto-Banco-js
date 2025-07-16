function crearCuenta() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const tipoDoc = document.getElementById("tipo-doc").value;
  const documento = document.getElementById("doc-numero").value.trim();
  const clave = document.getElementById("contrasena").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();
  const error = document.getElementById("error");

  error.textContent = "";

  // Validación de campos
  if (!nombre || !email || !telefono || !documento || !clave || !confirmar) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completa todos los campos.',
      confirmButtonColor: '#2b6cb0'
    });
    return;
  }

  if (clave.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña demasiado corta',
      text: 'Debe tener al menos 6 caracteres.',
      confirmButtonColor: '#2b6cb0'
    });
    return;
  }

  if (clave !== confirmar) {
    Swal.fire({
      icon: 'error',
      title: 'Las contraseñas no coinciden',
      text: 'Verifica los campos de contraseña.',
      confirmButtonColor: '#d33'
    });
    return;
  }

  // Leer base de datos de usuarios
  const db = JSON.parse(localStorage.getItem("usuarios-db")) || {};

  // Verificar si ya existe
  for (const key in db) {
    if (db[key].telefono === telefono || db[key].documento === documento) {
      Swal.fire({
        icon: 'error',
        title: 'Ya registrado',
        text: 'Este número o documento ya está en uso.',
        confirmButtonColor: '#d33'
      });
      return;
    }
  }

  // Generar número de cuenta aleatorio
  const numeroCuenta = Math.floor(100000000 + Math.random() * 900000000); // 9 dígitos
  localStorage.setItem('numeroCuenta', numeroCuenta.toString());

  // Crear nuevo usuario
  const nuevoUsuario = {
    nombre,
    email,
    telefono,
    tipoDoc,
    documento,
    clave,
    numeroCuenta
  };

  db[telefono] = nuevoUsuario;
  localStorage.setItem("usuarios-db", JSON.stringify(db));

  // Confirmación
  Swal.fire({
    icon: 'success',
    title: 'Cuenta creada exitosamente',
    text: 'Ahora puedes iniciar sesión.',
    confirmButtonText: 'Ir al inicio',
    confirmButtonColor: '#2b6cb0'
  }).then(() => {
    window.location.href = "/html/index.html";
  });
}
