
const regex_codigo = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
const regex_precio = /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/


function validations( form ) {


    if ( !form.codigo || !form.codigo.value.trim() ) return "El código del producto no puede estar en blanco."
    if (!regex_codigo.test(form.codigo.value.trim())) return "El código del producto debe contener letras y números"
    if (form.codigo.value.trim().length < 5 || form.codigo.value.trim().length > 15) return "El código del producto debe tener entre 5 y 15 caracteres."


    if ( !form.nombre || !form.nombre.value.trim() ) return "El nombre del producto no puede estar en blanco."
    if (form.nombre.value.trim().length < 2 || form.nombre.value.trim().length > 50) return "El código del producto debe tener entre 2 y 50 caracteres."
    
    if ( !form.bodega || !form.bodega.value.trim() ) return "Debe seleccionar una bodega"
    if ( !form.sucursal || !form.sucursal.value.trim() ) return "Debe seleccionar una sucursal para la bodega seleccionada."
    if ( !form.moneda || !form.moneda.value.trim() ) return "Debe seleccionar una moneda para el producto."
    
    if ( !form.precio || !form.precio.value.trim() ) return "El precio del producto no puede estar en blanco."
    if (!regex_precio.test(form.precio.value.trim())) return "El precio del producto debe ser un número positivo con hasta dos decimales."

    const checkboxes = form.querySelectorAll('input[name="material[]"]:checked');

    if (checkboxes.length < 2) {
        return "Debe seleccionar al menos dos materiales para el producto.";
    }
  
    if ( !form.descripcion || !form.descripcion.value ) return "La descripción del producto no puede estar en blanco."
    if (form.descripcion.value.length < 10 || form.descripcion.value.length > 1000) return "La descripción del producto debe tener entre 10 y 1000 caracteres."
    
    
    return false;   

}

function loadSelect() {
        
    const xhr = new XMLHttpRequest();
    // Configuramos la solicitud
    xhr.open('GET', 'backend.php?action=get_data');
    // Escuchamos la respuesta
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
            const data = JSON.parse(xhr.responseText);
            // Llenar bodegas
            const bodegaSelect = document.getElementById('bodega');
            bodegaSelect.innerHTML = '<option value=""></option>';
            data.bodegas.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;  
                opt.textContent = b.nombre;
                bodegaSelect.appendChild(opt);
            });

            // Llenar monedas
            const monedaSelect = document.getElementById('moneda');
            monedaSelect.innerHTML = '<option value=""></option>';
            data.monedas.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.id;
                opt.textContent = m.nombre;
                monedaSelect.appendChild(opt);
            });
        }
    };

    // Enviamos la solicitud
    xhr.send();
}

function changeSucursalSelect( bodega_id ) {
        
    const xhr = new XMLHttpRequest();
    // Configuramos la solicitud
    xhr.open('GET', `backend.php?action=get_sucursales&bodega_id=${bodega_id}`);
    // Escuchamos la respuesta
    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            // Llenar sucursales
            const sucurusalSelect = document.getElementById('sucursal');
            sucurusalSelect.innerHTML = '<option value=""></option>';
            data.sucursales.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;  
                opt.textContent = b.nombre;
                sucurusalSelect.appendChild(opt);
            });

        }
    };

    // Enviamos la solicitud
    xhr.send();
}

function sendData(form) {

    // 1. Capturamos todos los datos del form automaticamente
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
    // Configuramos la solicitud
    xhr.open('POST', 'backend.php');
    // Escuchamos la respuesta
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Éxito en la comunicación HTTP
            try {
                const resultado = JSON.parse(xhr.responseText);

                if (resultado.status === 'success') {
                    alert("¡Éxito! " + resultado.message);
                    form.reset(); // Limpiar formulario
                } else {
                    alert("Error: " + resultado.message);
                }
            } catch (e) {
                // Error al parsear JSON
                console.error('Error al parsear JSON:', e);
                alert("Respuesta del servidor no válida.");
            }
        } else {
            console.error('Error HTTP:', xhr.status);
            alert("Hubo un error en la respuesta del servidor.");
        }
    };
    // Manejo de errores de red
    xhr.onerror = function () {
        alert("Hubo un error de conexión con el servidor.");
    };

    // Enviamos la solicitud con FormData
    xhr.send(formData);
}

document.addEventListener('DOMContentLoaded', function () {

    loadSelect();

    const form = document.querySelector('form')

    form.addEventListener('submit', function (e) {

        e.preventDefault()

        const error = validations(this)

        if ( error ) return alert(error)

        sendData(form);

    })


    const bodegaSelect = document.getElementById('bodega');
    bodegaSelect.addEventListener('change', function (e) {
        const selectedBodegaId = this.value;
        console.log('Bodega seleccionada:', selectedBodegaId);
        
        if (selectedBodegaId) {
            changeSucursalSelect(selectedBodegaId);
        } else {
            document.getElementById('sucursal').innerHTML = '<option value=""></option>';
        }
    });
});