// 3. Primeros pasos para Agregar Nuevos Clientes
// IIFE
let DB;
(function() {
    

    

    // formulario esta como global
    const formulario =  document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        
        // Escuchar el submit del formulario 
       formulario.addEventListener('submit', validarCliente);
        conectarDB();
    });

  

    function validarCliente(evento) { // viene de un submit, tomar evento 
        evento.preventDefault();
        // console.log('validando'); escuchar el evento
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa ').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            // console.error('error');
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la información
        // Se hará lo contrario al Destructuring (sacar de una estructura)
        // Object literal enhansmen. el objeto juntará las variables del formulario
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        };
        // Generar un ID único
        cliente.id = Date.now();
        //  console.log(cliente);
        // crearNuevoCliente(cliente);
        if (cliente) {
            setTimeout(() => {
                crearNuevoCliente(cliente);    
            }, 1000);            
        }
    }

    function crearNuevoCliente(cliente) {// pasa el objeto cliente desde validar Cliente
        console.log(DB);
        const transaction = DB.transaction(['crm'], 'readwrite');
        
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);
        objectStore.add(cliente);
        // Si tiene error de validacion email debe ser unique
        transaction.onerror = function() {
            console.log('Hubo un error');
            imprimirAlerta('Hubo un error', 'error');
        }

        transaction.oncomplete = function() {
            console.log('El Cliente se agregó Correctamente');
             // Mostrar mensaje de que todo esta bien...
            imprimirAlerta('El Cliente se agregó Correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        
    }

  
})();