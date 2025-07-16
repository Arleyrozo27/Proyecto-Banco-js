function iniciarRecuperacion() {
  Swal.fire({
    title: '🔐 Recuperar contraseña',
    html: `
      <input id="swal-telefono" class="swal2-input" placeholder="📱 Número de celular" />
      <input id="swal-documento" class="swal2-input" placeholder="🪪 Número de documento" />
    `,
    confirmButtonText: '🔎 Buscar cuenta',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#2b6cb0',
    cancelButtonColor: '#aaa',
    preConfirm: () => {
      const telefono = document.getElementById('swal-telefono').value.trim();
      const documento = document.getElementById('swal-documento').value.trim();

      if (!telefono || !documento) {
        Swal.showValidationMessage('⚠️ Todos los campos son obligatorios');
        return false;
      }

      if (!/^\d{7,15}$/.test(telefono)) {
        Swal.showValidationMessage('📱 El número de celular no es válido');
        return false;
      }

      const db = JSON.parse(localStorage.getItem("usuarios-db")) || {};
      let usuarioEncontrado = null;

      for (const key in db) {
        if (
          db[key].telefono === telefono &&
          db[key].documento === documento
        ) {
          usuarioEncontrado = db[key];
          break;
        }
      }

      if (!usuarioEncontrado) {
        Swal.showValidationMessage('❌ No se encontró una cuenta con esos datos');
        return false;
      }

      return usuarioEncontrado;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const usuario = result.value;

      Swal.fire({
        icon: 'info',
        title: '🔑 Contraseña recuperada',
        html: `
          <strong>Tu contraseña es:</strong><br>
          <code id="clave-recuperada">${usuario.clave}</code><br><br>
          <button onclick="copiarClave()" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">
            📋 Copiar contraseña
          </button>
        `,
        showConfirmButton: false
      });
    }
  });
}

// Función para copiar contraseña
function copiarClave() {
  const clave = document.getElementById('clave-recuperada').textContent;

  navigator.clipboard.writeText(clave).then(() => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Contraseña copiada al portapapeles',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  }).catch(err => {
    Swal.fire({
      icon: 'error',
      title: 'Error al copiar',
      text: 'No se pudo copiar la contraseña'
    });
  });
}
