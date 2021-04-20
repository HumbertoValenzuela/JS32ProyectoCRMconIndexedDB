
(function(){

    let DB;
    // Seleccionar id #listado-clientes
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
       crearDB(); 

        //Esta función se ejecuta en caso de que exista la bd crm
        if(window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        } 

        listadoClientes.addEventListener('click', eliminarRegistro);
    })


    function eliminarRegistro(e) {
        // console.log(e.target);
        // console.log(e.target.classList);

        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);
            // console.log(idEliminar);
            const confirmar = confirm('Deseas eliminar este Cliente');// retorna true o false
            if (confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    console.log('Eliminado');

                    // Traversing the DOM Quita el HTML
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function() {
                    console.log('hubo un error');
                }
            }
        }

    }

    // Crea la base de datos  de IndeDB
    function crearDB() {
        const crearDB = window.indexedDB.open('crm', 1);//Abrir  y crear conexión

        // Si tiene error
        crearDB.onerror = function() {
            console.log('Hubo un error');
        };
        // Si se crea, se asigna la variable DB
        crearDB.onsuccess = function() {
            DB = crearDB.result;
        };

        // abrir y cerrar conexión
        // Se ejecuta una sola vez
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;// resultado lo que se ejecuta en la función, que será nuestra base de datos

            // Crear la llave primaria id 
            const objecStore = db.createObjectStore('crm', {keyPath: 'id', autoIncrement: true});
            // Crear campos
            objecStore.createIndex('nombre', 'nombre', { unique: false});
            objecStore.createIndex('email', 'email', { unique: true});
            objecStore.createIndex('telefono', 'telefono', { unique: false});
            objecStore.createIndex('empresa', 'empresa', { unique: false});
            objecStore.createIndex('id', 'id', { unique: true});

            console.log('DB Lista y creada');
        }
    }
        // 5. Query a la BD para obtener los clientes
        // Abrir la conexión. En caso de error el código no se ejecuta.
        function obtenerClientes() {
            const abrirConexion = window.indexedDB.open('crm', 1);

            // Si tiene error
            abrirConexion.onerror = function() {
                console.log('Hubo un error');
            };
            
            // si todo esta bien, asignar a database el resultado
            abrirConexion.onsuccess = function() {
                // console.log('');
                // guardamos el resultado
                DB = abrirConexion.result;
                
                const objectStore = DB.transaction('crm').objectStore('crm');
                // listar. cursores. Itera sobre los registros
                // retorna un objeto request o petición,
                objectStore.openCursor().onsuccess = function(e) {
                    // cursor se va a ubicar en el registro indicado para acceder a los datos
                    const cursor = e.target.result;
                    if (cursor) {
                        console.log(cursor.value);
                        // destructuring
                        const { nombre, empresa, email, telefono, id } = cursor.value;
                        
                        // ?id=${id} se llama queryString
                        listadoClientes.innerHTML += `

                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;
                        cursor.continue();
                    } else {
                        console.log('No hay más registros...');
                    }
                }
            }
        } 
})();