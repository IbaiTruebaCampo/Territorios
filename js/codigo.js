/* Autor: Ibai Trueba Campo
Fecha: 14/06/2019
Descripción: Ejercicio práctico del MF0952_2 */

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyDgxeRRE_uqBEQ5NqDCaMFBcAXzFpGpro0",
  authDomain: "territorios-721bd.firebaseapp.com",
  databaseURL: "https://territorios-721bd.firebaseio.com",
  projectId: "territorios-721bd",
  storageBucket: "territorios-721bd.appspot.com",
  messagingSenderId: "705631175201",
  appId: "1:705631175201:web:d7990bb1990fb8e5"
};
// Initialize Firebase
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión
var re = document.getElementById("registrar");
re.addEventListener("click", registrar, false);
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('Usuario verificado: ' + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p>Conéctate para tener acceso a los datos del sistema.</p>
      `;
    }
  });
}

function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Portal de gestión de datos.</p>
        <hr>
        <p class="mb-0">Complete o edite los campos correspondientes.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h2>Gestión de datos de comerciales</h2>
        <p>Todos los datos son obligatorios</p>

      <form action="#" class="form-inline">
        <div class="col-sm-3"></div>
          <label for="tipo" class="col-sm-2 col-form-label">Tipo de territorio: </label>
          <input type="text" id="tipo" class="form-control my-3 col-sm-1" maxlength="2" pattern="10 || [1-9]">
          <label for="territorio" class="col-sm-2 col-form-label">Número de territorio: </label>
          <input type="text" id="territorio" class="form-control my-3 col-sm-1" min="1" max="300" maxlength="3">
        <div class="col-sm-3"></div>
        <div class="col-sm-3"></div>
          <label for="inicio" class="col-sm-2 col-form-label">Fecha de Inicio: </label>
          <input type="date" id="inicio" class="form-control my-3 col-sm-4" maxlenght="4">
          <div class="col-sm-3"></div>
          <div class="col-sm-3"></div>
          <label for="final" class="col-sm-2 col-form-label">Fecha de Fin: </label>
          <input type="date" id="final" class="form-control my-3 col-sm-4" maxlenght="4">
        <div class="col-sm-3"></div>
        <div class="col-sm-3"></div>
          <label for="cuando" class="col-sm-2 col-form-label">Cuándo se trabaja: </label>
          <input type="text" id="cuando" class="form-control my-3 col-sm-4"
          pattern="[\dA-Za-zÑñÇçÁáÉéÍíÓóÚú\s-+=()¿?!¡:.,;&%@]{1,50}" maxlength="50">
        <div class="col-sm-3"></div>
        <div class="col-sm-3"></div>
          <label for="quien" class="col-sm-2 col-form-label">Quién lo trabaja: </label>
          <input type="number" id="quien" class="form-control my-3 col-sm-1" max="120" min="1" maxlength="3">
        <div class="col-sm-2"></div>
          <button class="btn btn-dark my-3 form-control" id="guardar">Guardar</button>
          <div id="act"></div>
        <div class="col-sm-3"></div>
      </form>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tipo de territorio</th>
            <th scope="col">Número de territorio</th>
            <th scope="col">Fecha de inicio</th>
            <th scope="col">Fecha de fin</th>
            <th scope="col">Cuándo se trabaja</th>
            <th scope="col">Quién lo trabaja</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-dark btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("cerrar");
    ce.addEventListener("click", cerrar, false);
    var gu = document.getElementById("guardar");
    gu.addEventListener("click", guardar, false);
  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Activa tu cuenta para ver nuestros contenidos para usuarios registrados.</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>¡Cáspitas!</strong> Esperamos verte pronto otra vez por nuestro portal.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  tipo = document.getElementById("tipo").value;
  territorio = document.getElementById("territorio").value;
  inicio = document.getElementById("inicio").value;
  final = document.getElementById("final").value;
  cuando = document.getElementById("cuando").value;
  quien = document.getElementById("quien").value;
  if (tipo.trim() === "" || territorio.trim() === "" || inicio.trim() === "" || final.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
    alert("Todos los datos son obligatorios.");
  } else {
    // validar los datos del formulario aqui
    var usuario = {
      tipo: tipo,
      territorio: territorio,
      inicio: inicio,
      final: final,
      cuando: cuando,
      quien: quien
    };

    db.collection("usuarios").add(usuario)
      .then(function (docRef) {
        console.log("Documento escrito con ID: ", docRef.id);
        document.getElementById("tipo").value = "";
        document.getElementById("territorio").value = "";
        document.getElementById("inicio").value = "";
        document.getElementById("final").value = "";
        document.getElementById("cuando").value = "";
        document.getElementById("quien").value = "";
      })
      .catch(function (error) {
        console.error("Error añadiendo el documento: ", error);
      });
  }
}

// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipo}</td>
          <td>${doc.data().territorio}</td>
          <td>${doc.data().inicio}</td>
          <td>${doc.data().final}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().quien}</td>
          <td><i id="pen" class="fas fa-pencil-alt" onclick="editarDatos('${doc.id}', '${doc.data().tipo}', '${doc.data().territorio}', '${doc.data().inicio}', '${doc.data().final}', '${doc.data().cuando}', '${doc.data().quien}');"></i></td>
          <td><i id="cut" class="fas fa-trash-alt" onclick="borrarDatos('${doc.id}', '${doc.data().tipo}', '${doc.data().territorio}');"></i></td>
        </tr>
      `;
    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId, parTipo, parTerritorio) {
  var re = confirm("¿Está seguro que quiere borrar el campo " + parId + "?");
  if (re == true) {
    db.collection("usuarios").doc(parId).delete()
      .then(function () {
        console.log("Usuario borrado correctamente.");
      }).catch(function (error) {
        console.error("Error borrando el usuario: ", error);
      });
  }
}

// Editar datos de documentos
function editarDatos(parId, parTipo, parTerritorio, parInicio, parFinal, parCuando,parQuien) {
  document.getElementById("tipo").value = parTipo;
  document.getElementById("territorio").value = parTerritorio;
  document.getElementById("inicio").value = parInicio;
  document.getElementById("final").value = parFinal;
  document.getElementById("cuando").value = parCuando;
  document.getElementById("quien").value = parQuien;

  $("#guardar").css("display", "none");
  $(".linea").attr("disabled", true);
  $("#act").append("<button class='btn btn-success my-3' id='actualizar'>Editar</button>");
  $("#actualizar").on("click", function () {
    var userRef = db.collection("usuarios").doc(parId);
    tipo = document.getElementById("tipo").value;
    territorio = document.getElementById("territorio").value;
    inicio = document.getElementById("inicio").value;
    final = document.getElementById("final").value;
    cuando = document.getElementById("cuando").value;
    quien = document.getElementById("quien").value;

    if (tipo.trim() === "" || territorio.trim() === "" || inicio.trim() === "" || final.trim() === "" || cuando.trim() === "" || quien.trim() === "") {
      alert("Todos los datos son obligatorios.");
    } else {
      return userRef.update({
          tipo: document.getElementById("tipo").value,
          territorio: document.getElementById("territorio").value,
          inicio: document.getElementById("inicio").value,
          final: document.getElementById("final").value,
          cuando: document.getElementById("cuando").value,
          quien: document.getElementById("quien").value
        })
        .then(function () {
          console.log("Usuario actualizado correctamente.");
          document.getElementById("tipo").value = "";
          document.getElementById("territorio").value = "";
          document.getElementById("inicio").value = "";
          document.getElementById("final").value = "";
          document.getElementById("cuando").value = "";
          document.getElementById("quien").value = "";
          $("#guardar").css("display", "inline");
          $(".linea").attr("disabled", false);
          $("#act").empty();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error actualizando usuario: ", error);
        });
    }
  })
}

observador();