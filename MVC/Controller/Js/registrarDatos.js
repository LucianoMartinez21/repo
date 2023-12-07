document.addEventListener('DOMContentLoaded', function() {
    // Crear una instancia de la clase cuando se carga la página
    var instanciaVerDatosUsuario = new Administrador();
    instanciaVerDatosUsuario.verDatos();
    // Asignar el método registrarDatos a un evento de click (o al evento que desees)
    // document.getElementById('tuBotonRegistrar').addEventListener('click', function() {
    //     instanciaVerDatosUsuario.registrarDatos();
    // });
});

class Administrador {
    constructor() {
        this.target = document.getElementById("listaUsuario");
        this.paginaActual = 1; // Puedes inicializar con la página que desees
    }


    verDatos() {
        //prepara Datos
        var self = this;
        var valor = {
            funcion: "verDatos",
            pagina_actual: self.paginaActual
        };
        //Envio de datos
        fetch('../Controller/PHP/registrarDatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valor)
        })
        //Respuesta peticion
        .then(response => response.json())
        .then(data => {
            crearTabla(data);
            // Iterar sobre las filas en el array
            data.forEach(fila => {
                console.log("Datos Cargados Exitosamente");
            });
        })
        //Respuesta en caso de error
        .catch(error => {
            console.error('Disculpe, existió un problema:', error);
        });

    }

    loginAdministrador(){
        //Prepara Datos
        const rutAdministrador = document.getElementById('rutAdministrador').value;
        const passwordAdministrador = document.getElementById('passwordAdministrador').value;
        const formData = {
            funcion: "loginAdministrador",
            rutAdministrador: rutAdministrador,
            passwordAdministrador: passwordAdministrador
        };
        //Envia Datos
        fetch('/MVC/Controller/PHP/registrarDatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        //Recibe Respuesta
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data === 1) {
                // El rut y contraseña coinciden, redirige a la página correspondiente
                // Almacena el rut en una variable de sesión
                fetch('/MVC/Controller/PHP/guardarRutEnSesion.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rut: rutAdministrador })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        window.location.href = '/MVC/View/administrador.html';
                    } else {
                        console.error('Error al guardar el rut en sesión:', result.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else if (data === 0) {
                console.log("rut y password no coinciden");
            } else {
                console.error('Error en el servidor:', data.message);
            }
        })
    }

    registrarDatos() {
        // Prepara Datos
        const rut_usuario = document.getElementById('rutUsuario').value;
        const nombre_usuario = document.getElementById('nombreUsuario').value;
        const apellido_usuario = document.getElementById('apellidoUsuario').value;
        const password_usuario = document.getElementById('passwordUsuario').value;
        const confirmacion_password_usuario = document.getElementById('confirmacionPasswordUsuario').value;

        const formData = {
            funcion: "registrarDatos",
            rut_usuario: rut_usuario,
            nombre_usuario: nombre_usuario,
            apellido_usuario: apellido_usuario,
            password_usuario: password_usuario,
            confirmacion_password_usuario: confirmacion_password_usuario
        };
        console.log(formData);
        // Envia Datos
        fetch('/MVC/Controller/PHP/registrarDatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        // Recibe Respuesta
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data === 1) {
                // Redirigir a la página deseada
                window.location.href = '/MVC/View/administrador.html';
            } else {
                // Manejar otros casos (puedes agregar lógica adicional aquí)
                console.error('Error en el servidor:', data.message);
            }
        })
        //Respuesta en caso de error
        .catch(error => {
            console.error('Error:', error);
        });
    }

    borrarUsuario(rut_usuario){
        //Prepara datos
        const formData ={
            funcion: "borrarUsuario",
            rut_usuario : rut_usuario
        }
        console.log(formData);
        //Envia Datos
        fetch('/MVC/Controller/PHP/registrarDatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        //Recibe Datos
        .then(response => {
            console.log(response); // Agrega esta línea para ver la respuesta completa
            return response.json();
        })
        .then(data => {
            // Handle the response from the server if needed
            if (data.status === 'success') {
                this.verDatos();
                console.log(data);
                // No necesitas iterar sobre data aquí
            } else {
                // Manejar otros casos (puedes agregar lógica adicional aquí)
                console.error('Error en el servidor:', data.message);
            }
        })
        //Respuesta en caso de error
        .catch(error => {
            console.error('Error:', error);
        });
    }

    preparaNFC(rut_usuario){
        //Prepara Datos
        const formData ={
            funcion: "preparaNFC",
            rut_usuario : rut_usuario
        }
        console.log(formData);
        //Envia Datos
        fetch('/MVC/Controller/PHP/registrarDatos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        //Recibe Respuesta
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server if needed
            if (data === true) {
                this.verDatos();
                console.log(data); // Esto mostrará el valor de $resultado en el servidor
            } else {
                // Manejar otros casos (puedes agregar lógica adicional aquí)
                console.error('Error en el servidor:', data.message);
            }
        })
        //Respuesta en caso de error
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    }
}

function crearTabla(datos) {
    // Obtener la referencia al cuerpo de la tabla
    var cuerpoTabla = document.getElementById('cuerpoTabla');
    // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
    cuerpoTabla.innerHTML = '';
    // Iterar sobre los datos y crear filas para la tabla
    datos.forEach(fila => {
        // Crear una nueva fila
        var nuevaFila = cuerpoTabla.insertRow();
        // Iterar sobre las propiedades de cada objeto (columnas)
        for (var prop in fila) {
            // Crear una celda en la fila para cada propiedad
            var nuevaCelda = nuevaFila.insertCell();
            nuevaCelda.textContent = fila[prop];
        }

        //Boton 1
        // Agregar una celda (preparar NFC) con un botón y asociar el RUT del usuario
        var nuevaCeldapreparaNFC = nuevaFila.insertCell();
        var preparaNFC = document.createElement('button');
        preparaNFC.textContent = 'Preparar NFC';
        preparaNFC.className = 'btn btn-primary';
        // Asociar el RUT del usuario al botón (puedes usar un atributo personalizado)
        preparaNFC.dataset.rutUsuario = fila.rut_usuario;
        preparaNFC.addEventListener('click', function () {
            var objpreparaNFC = new Administrador();
            objpreparaNFC.preparaNFC(rut_usuario);
        });
        nuevaCeldapreparaNFC.appendChild(preparaNFC);

        //BOTON 2
        // Agregar una celda (Eliminar) con un botón y asociar el RUT del usuario
        var nuevaCeldaBorrar = nuevaFila.insertCell();
        var Borrar = document.createElement('button');
        Borrar.textContent = 'Borrar';
        Borrar.className = 'btn btn-danger';
        // Asociar el RUT del usuario al botón (puedes usar un atributo personalizado)
        var rut_usuario = fila.rut_usuario;
        Borrar.addEventListener('click', function () {
            // Acción al hacer clic en el botón 2
            event.preventDefault();
            var objBorrarUsuario = new Administrador();
            objBorrarUsuario.borrarUsuario(rut_usuario);
        });
        nuevaCeldaBorrar.appendChild(Borrar);
    });
}