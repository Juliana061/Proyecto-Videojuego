var usuarios = [
  { usuario: "gamer1", contrasena: "123456" },
  { usuario: "shadowbyte", contrasena: "shadow1" },
  { usuario: "neonkiller", contrasena: "neon123" }
];

var publicaciones = [
  {
    id: 1,
    autor: "GamerPro99",
    texto: "¡Terminé Elden Ring al 100%! El DLC es brutal 🏆",
    imagen: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
    likes: 48,
    meGusta: false,
    comentarios: [
      { id: 1, autor: "ShadowByte", texto: "Brutal! yo no pude con el boss final 😅" },
      { id: 2, autor: "NeonKiller", texto: "Top tier gamer 🔥" }
    ]
  },
  {
    id: 2,
    autor: "NeonKiller",
    texto: "Clip épico en Valorant: ace en el último round 😂🔫 #Clutch",
    imagen: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    likes: 91,
    meGusta: false,
    comentarios: [
      { id: 1, autor: "PixelQueen", texto: "Qué clutch! gg ez" }
    ]
  },
  {
    id: 3,
    autor: "PixelQueen",
    texto: "Opinión: Cyberpunk 2077 post-parches es uno de los mejores RPGs de la última década. Fight me.",
    imagen: null,
    likes: 134,
    meGusta: false,
    comentarios: []
  },
  {
    id: 4,
    autor: "ShadowByte",
    texto: "Setup nuevo operativo 🖥️ 240hz + RTX 4080. El salto desde 60fps no tiene palabras.",
    imagen: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80",
    likes: 67,
    meGusta: false,
    comentarios: [
      { id: 1, autor: "GamerPro99", texto: "Pasar de 60 a 240 debería ser ilegal 😂" }
    ]
  }
];

var juegosFavoritos = ["Elden Ring", "Cyberpunk 2077", "Hollow Knight", "RDR2", "Sekiro"];

var contadorComentario = 100;
var contadorPost = 10;

function iniciarSesion() {
  var inputUsuario = document.getElementById("usuario").value;
  var inputContrasena = document.getElementById("contrasena").value;
  var errorUsuario = document.getElementById("errorUsuario");
  var errorContrasena = document.getElementById("errorContrasena");
  var errorGeneral = document.getElementById("errorGeneral");

  // Limpiar errores
  errorUsuario.textContent = "";
  errorContrasena.textContent = "";
  errorGeneral.textContent = "";

  // Validaciones
  var hayError = false;

  if (inputUsuario === "") {
    errorUsuario.textContent = "El usuario no puede estar vacío.";
    hayError = true;
  }

  if (inputContrasena === "") {
    errorContrasena.textContent = "La contraseña no puede estar vacía.";
    hayError = true;
  } else if (inputContrasena.length < 6) {
    errorContrasena.textContent = "La contraseña debe tener al menos 6 caracteres.";
    hayError = true;
  }

  if (hayError) {
    return;
  }

  // Verificar si el usuario existe
  var usuarioEncontrado = false;

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].usuario === inputUsuario && usuarios[i].contrasena === inputContrasena) {
      usuarioEncontrado = true;
      break;
    }
  }

  if (usuarioEncontrado) {
    sessionStorage.setItem("usuarioActivo", inputUsuario);
    window.location.href = "inicio.html";
  } else {
    errorGeneral.textContent = "Usuario o contraseña incorrectos.";
  }
}


function construirPost(post) {
  // Imagen (si tiene)
  var htmlImagen = "";
  if (post.imagen !== null) {
    htmlImagen = '<img src="' + post.imagen + '" class="post-imagen" alt="imagen del post" />';
  }

  var htmlComentarios = "";
  for (var i = 0; i < post.comentarios.length; i++) {
    var c = post.comentarios[i];
    htmlComentarios += construirComentario(post.id, c);
  }

  var textoLike = "🤍 " + post.likes;
  var claseBotonLike = "btn-accion";
  if (post.meGusta) {
    textoLike = "❤️ " + post.likes;
    claseBotonLike = "btn-accion con-like";
  }

  var html = '<div class="post-card" id="post-' + post.id + '">'
    + '<div class="d-flex justify-content-between align-items-center mb-1">'
    +   '<span class="post-autor"> ' + post.autor + '</span>'
    + '</div>'
    + htmlImagen
    + '<p class="post-texto">' + post.texto + '</p>'
    + '<div>'
    +   '<button class="' + claseBotonLike + '" onclick="darLike(' + post.id + ')">' + textoLike + '</button>'
    +   '<button class="btn-accion" onclick="toggleComentarios(' + post.id + ')">💬 ' + post.comentarios.length + '</button>'
    + '</div>'
    + '<div class="seccion-comentarios" id="comentarios-' + post.id + '">'
    +   '<div id="lista-comentarios-' + post.id + '">' + htmlComentarios + '</div>'
    +   '<div class="fila-comentario mt-2">'
    +     '<input class="input-comentario" id="input-comentario-' + post.id + '" type="text" placeholder="Escribe un comentario..." />'
    +     '<button class="btn btn-success btn-sm" onclick="agregarComentario(' + post.id + ')">Enviar</button>'
    +   '</div>'
    + '</div>'
    + '</div>';

  return html;
}

function construirComentario(postId, comentario) {
  return '<div class="comentario-item" id="comentario-' + postId + '-' + comentario.id + '">'
    + '<div class="d-flex justify-content-between align-items-start">'
    +   '<div>'
    +     '<span class="comentario-autor">@' + comentario.autor + '</span>'
    +     '<p class="mb-0" id="texto-comentario-' + postId + '-' + comentario.id + '">' + comentario.texto + '</p>'
    +   '</div>'
    +   '<div>'
    +     '<button class="btn-comentario-accion" onclick="editarComentario(' + postId + ', ' + comentario.id + ')">✏️</button>'
    +     '<button class="btn-comentario-accion" onclick="eliminarComentario(' + postId + ', ' + comentario.id + ')">🗑️</button>'
    +   '</div>'
    + '</div>'
    + '</div>';
}


function darLike(postId) {
  // Buscar el post en el array
  for (var i = 0; i < publicaciones.length; i++) {
    if (publicaciones[i].id === postId) {
      if (publicaciones[i].meGusta === false) {
        publicaciones[i].meGusta = true;
        publicaciones[i].likes = publicaciones[i].likes + 1;
      } else {
        publicaciones[i].meGusta = false;
        publicaciones[i].likes = publicaciones[i].likes - 1;
      }
      break;
    }
  }

  // Re-renderizar según la página
  var pagina = obtenerPagina();
  if (pagina === "inicio") {
    renderFeed();
  } else if (pagina === "publicaciones") {
    renderPublicaciones();
  }
}


function toggleComentarios(postId) {
  var seccion = document.getElementById("comentarios-" + postId);
  if (seccion.classList.contains("abierto")) {
    seccion.classList.remove("abierto");
  } else {
    seccion.classList.add("abierto");
  }
}

function agregarComentario(postId) {
  var input = document.getElementById("input-comentario-" + postId);
  var texto = input.value.trim();

  if (texto === "") {
    return;
  }

  var usuario = sessionStorage.getItem("usuarioActivo");
  if (usuario === null) {
    usuario = "Anónimo";
  }

  var nuevoComentario = {
    id: contadorComentario,
    autor: usuario,
    texto: texto
  };
  contadorComentario = contadorComentario + 1;

  // Agregar al array del post
  for (var i = 0; i < publicaciones.length; i++) {
    if (publicaciones[i].id === postId) {
      publicaciones[i].comentarios.push(nuevoComentario);
      break;
    }
  }

  // Agregar al DOM sin re-renderizar todo
  var lista = document.getElementById("lista-comentarios-" + postId);
  lista.innerHTML = lista.innerHTML + construirComentario(postId, nuevoComentario);
  input.value = "";
}

function eliminarComentario(postId, comentarioId) {
  // Eliminar del array
  for (var i = 0; i < publicaciones.length; i++) {
    if (publicaciones[i].id === postId) {
      var nuevosComentarios = [];
      for (var j = 0; j < publicaciones[i].comentarios.length; j++) {
        if (publicaciones[i].comentarios[j].id !== comentarioId) {
          nuevosComentarios.push(publicaciones[i].comentarios[j]);
        }
      }
      publicaciones[i].comentarios = nuevosComentarios;
      break;
    }
  }

  // Eliminar del DOM
  var elemento = document.getElementById("comentario-" + postId + "-" + comentarioId);
  if (elemento !== null) {
    elemento.remove();
  }
}

function editarComentario(postId, comentarioId) {
  var textoActual = document.getElementById("texto-comentario-" + postId + "-" + comentarioId).textContent;
  var nuevoTexto = prompt("Editar comentario:", textoActual);

  if (nuevoTexto === null || nuevoTexto.trim() === "") {
    return;
  }

  // Actualizar en el array
  for (var i = 0; i < publicaciones.length; i++) {
    if (publicaciones[i].id === postId) {
      for (var j = 0; j < publicaciones[i].comentarios.length; j++) {
        if (publicaciones[i].comentarios[j].id === comentarioId) {
          publicaciones[i].comentarios[j].texto = nuevoTexto.trim();
          break;
        }
      }
      break;
    }
  }

  // Actualizar en el DOM
  var textoEl = document.getElementById("texto-comentario-" + postId + "-" + comentarioId);
  if (textoEl !== null) {
    textoEl.textContent = nuevoTexto.trim();
  }
}


function renderFeed() {
  var contenedor = document.getElementById("feed");
  if (contenedor === null) return;

  var html = "";
  for (var i = 0; i < publicaciones.length; i++) {
    html = html + construirPost(publicaciones[i]);
  }
  contenedor.innerHTML = html;
}

function publicar() {
  var textarea = document.getElementById("textoPost");
  var texto = textarea.value.trim();

  if (texto === "") {
    alert("Escribe algo antes de publicar.");
    return;
  }

  var usuario = sessionStorage.getItem("usuarioActivo");
  if (usuario === null) usuario = "Anónimo";

  var nuevoPost = {
    id: contadorPost,
    autor: usuario,
    texto: texto,
    imagen: null,
    likes: 0,
    meGusta: false,
    comentarios: []
  };
  contadorPost = contadorPost + 1;

  publicaciones.unshift(nuevoPost);
  textarea.value = "";
  renderFeed();
}



function renderPublicaciones() {
  var contenedor = document.getElementById("contenedorPosts");
  if (contenedor === null) return;

  var html = "";
  for (var i = 0; i < publicaciones.length; i++) {
    html = html + construirPost(publicaciones[i]);
  }
  contenedor.innerHTML = html;
}



function renderPerfil() {
  // Nombre del usuario
  var nombreEl = document.getElementById("nombrePerfil");
  if (nombreEl !== null) {
    var usuario = sessionStorage.getItem("usuarioActivo");
    if (usuario !== null) {
      nombreEl.textContent = usuario;
    }
  }

  // Juegos favoritos
  var contenedorJuegos = document.getElementById("juegosFavoritos");
  if (contenedorJuegos !== null) {
    var htmlJuegos = "";
    for (var i = 0; i < juegosFavoritos.length; i++) {
      htmlJuegos = htmlJuegos + '<span class="badge-juego">' + juegosFavoritos[i] + '</span>';
    }
    contenedorJuegos.innerHTML = htmlJuegos;
  }

  // Publicaciones del usuario (las primeras 2 como ejemplo)
  var contenedorMisPosts = document.getElementById("misPublicaciones");
  if (contenedorMisPosts !== null) {
    var html = "";
    for (var j = 0; j < 2; j++) {
      html = html + construirPost(publicaciones[j]);
    }
    contenedorMisPosts.innerHTML = html;
  }
}



function obtenerPagina() {
  var ruta = window.location.pathname;
  if (ruta.includes("inicio")) return "inicio";
  if (ruta.includes("publicaciones")) return "publicaciones";
  if (ruta.includes("perfil")) return "perfil";
  return "login";
}



var pagina = obtenerPagina();

if (pagina === "login") {
  // Nada extra, el botón llama a iniciarSesion()

} else if (pagina === "inicio") {
  renderFeed();

} else if (pagina === "publicaciones") {
  renderPublicaciones();

} else if (pagina === "perfil") {
  renderPerfil();
}