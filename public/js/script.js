document.getElementById('apiForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe y la página se recargue
    const apiUrl = document.getElementById('apiUrl').value; // Obtiene el valor del campo de entrada con el id 'apiUrl'
    const messageContainer = document.getElementById('messageContainer'); // Captura el contenedor para el mensaje de éxito o error
    const results = document.getElementById('results'); // Captura el contenedor para mostrar los resultados
    const buttons = document.getElementById('buttons'); // Captura el contenedor para los botones

    messageContainer.innerHTML = ''; // Limpia el contenido previo del contenedor de mensajes
    results.innerHTML = ''; // Limpia los resultados previos
    buttons.innerHTML = ''; // Limpia los botones previos

    // Realizar la petición a la API
    try {
        const response = await fetch(apiUrl); // Realiza la petición a la URL proporcionada
        if (!response.ok) { // Verifica si la respuesta no es correcta
            throw new Error('Error al conectar con la URL proporcionada'); // Lanza un error si la respuesta no es exitosa
        }
        const data = await response.json(); // Convierte la respuesta de la API a un objeto JSON
        displayResults(data); // Llama a la función para mostrar los datos en una tabla

        // Mensaje de éxito en el mismo contenedor
        messageContainer.innerHTML = `
            <div style="padding: 10px; background-color: #d4edda; color: #155724; border-radius: 5px; margin-top: 20px;">
                <strong>Éxito:</strong> Datos obtenidos correctamente, gracias por su búsqueda.
            </div>
        `;

        // Botón para recargar la página
        const reloadButton = document.createElement('button'); // Crea un botón para nueva búsqueda
        reloadButton.textContent = 'Nueva búsqueda'; // Texto del botón
        reloadButton.style.marginTop = '10px'; // Estilo para separar el botón
        reloadButton.addEventListener('click', function () { // Asocia un evento al botón
            location.reload(); // Recarga la página al hacer clic
        });
        messageContainer.appendChild(reloadButton); // Agrega el botón al contenedor de mensajes

    } catch (error) { // Manejo de errores
        // Mostrar mensaje de error en el mismo contenedor
        messageContainer.innerHTML = `
            <div style="padding: 10px; background-color: #f8d7da; color: #721c24; border-radius: 5px; margin-top: 20px;">
                <strong>Error:</strong> ${error.message}. Por favor, vuelva a realizar la búsqueda.
            </div>
        `;
    }
});

// Función para mostrar los resultados en una tabla
function displayResults(data) {
    const results = document.getElementById('results'); // Obtiene el contenedor de resultados
    results.style.display = 'block'; // Asegura que el contenedor esté visible
    results.style.opacity = 0; // Inicializa la opacidad para un efecto de transición
    results.style.transition = 'opacity 0.5s'; // Establece la duración de la transición
    results.style.opacity = 1; // Aplica la transición de opacidad
    results.innerHTML = ''; // Limpia resultados previos

    const table = document.createElement('table'); // Crea un elemento de tabla
    const thead = document.createElement('thead'); // Crea el encabezado de la tabla
    const tbody = document.createElement('tbody'); // Crea el cuerpo de la tabla

    // Determinar si los datos son un arreglo o un objeto
    const isArray = Array.isArray(data); // Verifica si los datos son un arreglo
    const headers = isArray ? Object.keys(data[0]) : Object.keys(data); // Obtiene las claves de los datos

    // Crear encabezados
    const headerRow = document.createElement('tr'); // Crea una fila para los encabezados
    headers.forEach(header => { // Itera sobre las claves para crear las celdas de encabezado
        const th = document.createElement('th'); // Crea un elemento de celda de encabezado
        th.textContent = header; // Establece el texto de la celda
        headerRow.appendChild(th); // Agrega la celda al encabezado
    });
    thead.appendChild(headerRow); // Agrega la fila de encabezados al encabezado de la tabla

    // Crear filas de datos
    if (isArray) {
        data.forEach(item => { // Itera sobre los elementos del arreglo
            const row = document.createElement('tr'); // Crea una fila para cada elemento
            headers.forEach(header => { // Itera sobre las claves para crear celdas
                const td = document.createElement('td'); // Crea una celda de datos
                td.textContent = item[header] || 'N/A'; // Establece el contenido de la celda
                row.appendChild(td); // Agrega la celda a la fila
            });
            tbody.appendChild(row); // Agrega la fila al cuerpo de la tabla
        });
    } else {
        const row = document.createElement('tr'); // Crea una fila para el objeto
        headers.forEach(header => { // Itera sobre las claves para crear celdas
            const td = document.createElement('td'); // Crea una celda de datos
            td.textContent = data[header] || 'N/A'; // Establece el contenido de la celda
            row.appendChild(td); // Agrega la celda a la fila
        });
        tbody.appendChild(row); // Agrega la fila al cuerpo de la tabla
    }

    table.appendChild(thead); // Agrega el encabezado a la tabla
    table.appendChild(tbody); // Agrega el cuerpo a la tabla
    results.appendChild(table); // Agrega la tabla al contenedor de resultados

    // Botones de imprimir y descargar
    const printButton = document.createElement('button'); // Crea el botón de imprimir
    printButton.id = 'printButton'; // Asigna un id al botón
    printButton.textContent = 'Imprimir'; // Texto del botón
    printButton.addEventListener('click', function () { // Asocia un evento de clic
        window.print(); // Llama a la función de impresión
    });

    const downloadButton = document.createElement('button'); // Crea el botón de descargar
    downloadButton.id = 'downloadButton'; // Asigna un id al botón
    downloadButton.textContent = 'Descargar'; // Texto del botón
    downloadButton.addEventListener('click', function () { // Asocia un evento de clic
        const resultsHtml = results.innerHTML; // Obtiene el contenido del contenedor de resultados
        const blob = new Blob([resultsHtml], { type: 'text/html' }); // Crea un archivo Blob con los datos
        const url = URL.createObjectURL(blob); // Crea una URL para descargar el archivo
        const a = document.createElement('a'); // Crea un elemento 'a' para descargar
        a.href = url; // Asigna la URL al enlace
        a.download = 'results.html'; // Asigna un nombre al archivo
        document.body.appendChild(a); // Agrega el enlace al DOM
        a.click(); // Simula un clic en el enlace
        document.body.removeChild(a); // Elimina el enlace del DOM
        URL.revokeObjectURL(url); // Libera recursos
    });

    const buttons = document.getElementById('buttons'); // Obtiene el contenedor de botones
    buttons.appendChild(printButton); // Agrega el botón de imprimir
    buttons.appendChild(downloadButton); // Agrega el botón de descargar
}

// Ocultar mensaje de bienvenida después de enviar el formulario
document.getElementById('apiForm').addEventListener('submit', function () {
    const welcomeMessage = document.getElementById('welcomeMessage'); // Captura el mensaje de bienvenida
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none'; // Oculta el mensaje de bienvenida
    }
});

// HOLI QUIERO COMITEAR ALGO

