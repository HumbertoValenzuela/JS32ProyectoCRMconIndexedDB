
// 6. Query para obtener cada cliente

// IIFE
let DB;
(function(){

    let idCliente;

    // para llenarFormulario
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa ');

    // Para editar y actualizar HTML actualiza en el formulario
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        // Actualizar y validar el registro
        formulario.addEventListener('submit', actualizarCliente);

        // Verificar el ID de la URL
        // RLSearchParams es una API que Permite buscar parametro disponible en la URL
        const parametroURL = new URLSearchParams(window.location.search);// ?id=1618881415334

        // Método .get de URLSearchParams
        idCliente = parametroURL.get('id');
        // console.log(idCliente);//Muestra el ID

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);    
            }, 1000);
            
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            // console.error('error');
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Actualizar Cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            // id esta como string, cambiarlo a numero
            id: Number(idCliente)
        };

        // console.log(clienteActualizado);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);
        transaction.oncomplete = function() {
             imprimirAlerta('Se completo');
        }

        transaction.onerror = function() {
           // transaction.onerror = function(error) {
           //     console.log(error)
            imprimirAlerta('Hubo un error', 'error');
        }

    }

    function obtenerCliente(id) {
        // console.log(id);
        const transaction = DB.transaction(['crm'], 'readwrite');// readwrite o readonly

        // objectStore sirve para interactuar con la BBDD
        const objectStore = transaction.objectStore('crm');

        console.log(objectStore);// da un error al intentar conectar debido a que no espera los datos a tiempo.
        // para solucionar es con async await
        // pero en este caso setTimeout 

        // cursor
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {
                // En indexDB no existe un where de sql.
                console.log(cursor.value);// se trae todos los registros
                
                // Traer regstro actual
                if(cursor.value.id === Number(id)){//Number(id) viene de la URL y cursor.value.id es de la base de datos
                    // Función con parametro objeto actual
                    llenarFormulario(cursor.value);
                    console.log(cursor.value); //Registro actual
                }
                cursor.continue();
            }
        }
    }

    // 7. Llenar el Formulario con la información del Cliente
    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    // Para obtener el Cliente que tiene el ID se debe ir a la base de datos
   /* function conectarDB() {
        // Conectar a Base de dato o crear
        const abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = () => {
            console.log.log('Hubo un error');
        }

         // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = () => {
            DB = abrirConexion.result;
        }
    }*/

})();