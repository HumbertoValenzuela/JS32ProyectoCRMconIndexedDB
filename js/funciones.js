function conectarDB() {
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
}

function imprimirAlerta(mensaje, tipo) {

    // Evitar creación de divMensaje multiples veces
    const alerta = document.querySelector('.alerta');

    if (!alerta) {
        // Crear Alerta
        // class .alerta creada solo para validar
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('px-4', 'py-3', 'rounded',  'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');

        // agregar css Tailwin si es tipo error y sino otro css
        if (tipo === 'error') {
             
            divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700", 'border');
        } else {
            divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700", 'border');
        }

        // Agregar mensaje de error
        divMensaje.textContent = mensaje;

        // Para agregar al DOM
        formulario.appendChild(divMensaje);
        
        // Quitar el alert despues de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
        
    }
        // agregar registro a la base de datos. abrir conexión.
        // despúes por medio de transaction agregar un registro        
}