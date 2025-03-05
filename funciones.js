// Estructura de datos para los lotes
let lotes = {};
let loteActual = null;

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarSelectorLotes();
    const fechaInput = document.getElementById('fechaLote');
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
});

// Funciones de manejo de datos
function cargarDatos() {
    const datosGuardados = localStorage.getItem('lotesData');
    if (datosGuardados) {
        lotes = JSON.parse(datosGuardados);
        if (Object.keys(lotes).length > 0) {
            loteActual = Object.keys(lotes)[0];
            mostrarContenidoPrincipal(true);
            actualizarInterfaz();
        } else {
            mostrarContenidoPrincipal(false);
        }
    } else {
        mostrarContenidoPrincipal(false);
    }
}

function guardarDatos() { 
    try {
        // Verificar número de lotes
        const MAX_LOTES = 10;
        const totalLotes = Object.keys(lotes).length;
        
        if (totalLotes > MAX_LOTES) {
            // Mostrar alerta sugiriendo limpieza de lotes antiguos
            alert(`Has superado el límite de ${MAX_LOTES} lotes. 
            
            Por favor, considera eliminar algunos lotes antiguos antes de crear más.

            Consejo: Puedes imprimir los datos de los lotes antiguos antes de eliminarlos.`);
        }
        
        // Guardar en localStorage sin eliminar automáticamente
        localStorage.setItem('lotesData', JSON.stringify(lotes)); 
        
        // Actualizar interfaz
        actualizarInterfaz();
        actualizarSelectorLotes();
        
        console.log('Datos guardados. Lotes totales:', totalLotes);
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        alert('No se pudieron guardar los datos. Revise el almacenamiento local.');
    }
}

function mostrarContenidoPrincipal(mostrar) {
    document.getElementById('mensajeInicial').style.display = mostrar ? 'none' : 'block';
    document.getElementById('contenidoPrincipal').style.display = mostrar ? 'block' : 'none';
}

// Funciones de manejo de lotes
function crearNuevoLote() {
    const nombre = document.getElementById('nombreLote').value.trim();
    const fecha = document.getElementById('fechaLote').value;
    
    if (!validarNombreLote(nombre)) {
        return;
    }
    
    if (!fecha) {
        alert('Por favor, selecciona una fecha válida.');
        return;
    }

    const nuevoLote = {
        nombre,
        fecha,
        tubos: [],
        surcosPorTubo: 12.0,  // Cambiado a número decimal
        divisorMelgas: 45,
        precioMelga: 0
    };

    lotes[nombre] = nuevoLote;
    loteActual = nombre;
    
    mostrarContenidoPrincipal(true);
    guardarDatos();
    actualizarSelectorLotes();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('nuevoLoteModal'));
    modal.hide();
}

function validarNombreLote(nombre) {
    if (lotes[nombre]) {
        alert('Ya existe un lote con este nombre. Por favor, elige otro nombre.');
        return false;
    }
    if (!nombre || nombre.trim() === '') {
        alert('Por favor, ingresa un nombre válido para el lote.');
        return false;
    }
    return true;
}

function cambiarLote(nombreLote) {
    if (nombreLote && lotes[nombreLote]) {
        loteActual = nombreLote;
        actualizarInterfaz();
    }
}

function eliminarLoteActual() { 
    if (!loteActual) return;
    
    // Confirmar eliminación con mensaje de impresión
    const confirmacion = confirm(`¿Estás seguro de eliminar el lote "${loteActual}"? 
    
    Consejo: Asegúrate de haber imprimido los datos antes de eliminar.`);
    
    if (confirmacion) {
        // Eliminar lote
        delete lotes[loteActual];
        
        // Obtener lotes restantes
        const lotesRestantes = Object.keys(lotes);
        
        if (lotesRestantes.length > 0) {
            // Seleccionar nuevo lote actual
            loteActual = lotesRestantes[0];
            actualizarSelectorLotes();
            actualizarInterfaz();
        } else {
            // No quedan lotes
            loteActual = null;
            mostrarContenidoPrincipal(false);
        }
        
        // Guardar cambios
        guardarDatos();
    }
}

function actualizarSelectorLotes() {
    const selector = document.getElementById('selectorLote');
    selector.innerHTML = '';
    
    Object.keys(lotes).forEach(nombreLote => {
        const option = document.createElement('option');
        option.value = nombreLote;
        option.textContent = `${nombreLote} (${lotes[nombreLote].fecha})`;
        if (nombreLote === loteActual) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
}

// Funciones de la calculadora
function agregarTubo() {
    if (!loteActual) return;

    const tuboInput = document.getElementById('tuboInput');
    const cantidad = parseFloat(tuboInput.value);
    
    if (cantidad && cantidad > 0) {
        lotes[loteActual].tubos.push(cantidad);
        guardarDatos();
        tuboInput.value = '';
    } else {
        alert('Por favor ingrese una cantidad válida de tubos');
    }
}

function eliminarTubo(index) {
    lotes[loteActual].tubos.splice(index, 1);
    guardarDatos();
}

function formatearNumero(numero) {
    return Number(parseFloat(numero).toFixed(1));  // Asegura que se muestre un decimal
}

function actualizarInterfaz() {
    if (!loteActual) return;

    const lote = lotes[loteActual];
    actualizarListaTubos();
    calcularTotales();

    document.getElementById('surcosPorTubo').value = lote.surcosPorTubo;
    document.getElementById('divisorMelgas').value = lote.divisorMelgas;
    document.getElementById('precioMelga').value = lote.precioMelga;
}

function actualizarListaTubos() {
    const listaTubos = document.getElementById('listaTubos');
    const totalTubosElement = document.getElementById('totalTubos');
    
    if (!loteActual) return;

    listaTubos.innerHTML = '';
    const totalTubos = lotes[loteActual].tubos.reduce((sum, tubo) => sum + tubo, 0);
    
    lotes[loteActual].tubos.forEach((tubo, index) => {
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <span>${formatearNumero(tubo)} tubos</span>
            <button class="btn btn-danger btn-sm" onclick="eliminarTubo(${index})">
                <i class="bi bi-trash"></i>
            </button>
        `;
        listaTubos.appendChild(item);
    });
    
    totalTubosElement.textContent = `Total de tubos: ${formatearNumero(totalTubos)}`;
}

function calcularTotales() {
    if (!loteActual) return;

    const lote = lotes[loteActual];
    const totalTubos = lote.tubos.reduce((sum, tubo) => sum + tubo, 0);
    const totalSurcos = formatearNumero(totalTubos * lote.surcosPorTubo);
    const totalMelgas = formatearNumero(totalSurcos / lote.divisorMelgas);
    const sueldoTotal = Math.round(totalMelgas * lote.precioMelga);
    
    document.getElementById('totalSurcos').textContent = totalSurcos;
    document.getElementById('totalMelgas').textContent = totalMelgas;
    document.getElementById('sueldoTotal').textContent = `$${sueldoTotal.toLocaleString('es-CO')}`;
}

function imprimirCuentas() { 
    if (!loteActual) { 
        alert('No hay datos para imprimir'); 
        return; 
    } 
    
    const lote = lotes[loteActual]; 
    
    // Desglose detallado de tubos
    const desgloseTubos = lote.tubos.join(' + ');
    const totalTubos = lote.tubos.reduce((sum, tubo) => sum + tubo, 0);
    
    const contenidoImprimir = `
        <html> 
        <head> 
            <title>Cuentas del Lote: ${lote.nombre}</title> 
            <style> 
                body { font-family: Arial; padding: 20px; } 
                .titulo { text-align: center; margin-bottom: 20px; } 
                .datos { margin-bottom: 15px; } 
                .total { font-weight: bold; margin-top: 20px; } 
            </style> 
        </head> 
        <body> 
            <div class="titulo"> 
                <h1>Cuentas de Transplante</h1> 
                <h2>Lote: ${lote.nombre}</h2> 
                <p>Fecha: ${lote.fecha}</p> 
            </div> 
            <div class="datos"> 
                <p>Tubos: ${desgloseTubos} (Total: ${formatearNumero(totalTubos)} tubos)</p> 
                <p>Surcos: ${lote.surcosPorTubo}</p>
                <p>Divisor de melgas: ${lote.divisorMelgas}</p>
                <p>Total de melgas: ${formatearNumero((totalTubos * lote.surcosPorTubo) / lote.divisorMelgas)}</p>
                <p>Precio por melga: $${lote.precioMelga.toLocaleString('es-CO')}</p>
            </div> 
            <div class="total"> 
                <p>Sueldo Total: $${Math.round((totalTubos * lote.surcosPorTubo / lote.divisorMelgas) * lote.precioMelga).toLocaleString('es-CO')}</p> 
            </div> 
        </body> 
        </html>
    `;

    const ventanaImprimir = window.open('', '_blank'); 
    ventanaImprimir.document.write(contenidoImprimir); 
    ventanaImprimir.document.close(); 
    ventanaImprimir.print(); 
}

// Event listeners para los inputs de cálculo
document.getElementById('surcosPorTubo').addEventListener('input', function() {
    if (loteActual) {
        const valor = parseFloat(this.value);
        if (!isNaN(valor) && valor >= 0) {
            lotes[loteActual].surcosPorTubo = Number(valor.toFixed(2));
            guardarDatos();
            calcularTotales();
        }
    }
});

document.getElementById('divisorMelgas').addEventListener('change', function() {
    if (loteActual) {
        lotes[loteActual].divisorMelgas = parseInt(this.value);
        guardarDatos();
        calcularTotales();
    }
});

document.getElementById('precioMelga').addEventListener('input', function() {
    if (loteActual) {
        lotes[loteActual].precioMelga = parseInt(this.value) || 0;
        guardarDatos();
        calcularTotales();
    }
});

// Limpiar los campos del modal cuando se abre
document.getElementById('nuevoLoteModal').addEventListener('show.bs.modal', function() {
    document.getElementById('nombreLote').value = '';
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaLote').value = hoy;
});

// Prevenir que se cierren los modales al hacer click fuera
document.querySelectorAll('.modal').forEach(modal => {
    modal.setAttribute('data-bs-backdrop', 'static');
    modal.setAttribute('data-bs-keyboard', 'false');
});