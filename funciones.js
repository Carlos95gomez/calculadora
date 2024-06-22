// Referencias a los elementos del DOM
const title1 = document.getElementById('title1');
const title2 = document.getElementById('title2');
const title3 = document.getElementById('title3');
const obreroInput = document.getElementById('obrero');
const displayTitle1 = document.getElementById('displayTitle1');
const displayTitle2 = document.getElementById('displayTitle2');
const displayTitle3 = document.getElementById('displayTitle3');
const displayObrero = document.getElementById('displayObrero');
const titulosGuardadosContainer = document.getElementById('titulos-guardados');
const obreroGuardadoContainer = document.getElementById('obrero-guardado');
const inputFieldsContainer = document.getElementById('inputFields');
const obreroInputContainer = document.querySelector('.form-inline.mt-4');
const valor1Input = document.getElementById('valor1');
const valor2Input = document.getElementById('valor2');
const tubosInput = document.getElementById('tubos');
const displayTubos = document.getElementById('displayTubos');
const totalTubosDisplay = document.getElementById('totalTubos');

let tubosValues = JSON.parse(localStorage.getItem('tubosValues')) || [];

function saveTitles() {
    const title1Value = title1.value;
    const title2Value = title2.value;
    const title3Value = title3.value;

    const datosTitulos = {
        title1Value,
        title2Value,
        title3Value,
    };

    localStorage.setItem('userDatosTitulos', JSON.stringify(datosTitulos));

    displayTitle1.textContent = title1Value;
    displayTitle2.textContent = title2Value;
    displayTitle3.textContent = title3Value;

    inputFieldsContainer.classList.add('d-none');
    titulosGuardadosContainer.classList.remove('d-none');
}

function guardarValores() {
    const valor1 = parseFloat(valor1Input.value);
    const valor2 = parseFloat(valor2Input.value);

    const valores = {
        valor1,
        valor2,
    };

    localStorage.setItem('userValores', JSON.stringify(valores));
}

function saveObrero() {
    const obreroValue = obreroInput.value;
    localStorage.setItem('userObrero', obreroValue);
    displayObrero.textContent = obreroValue;
    obreroGuardadoContainer.classList.remove('d-none');
    obreroInputContainer.classList.add('d-none');
}

function addTubos() {
    const tuboValue = parseFloat(tubosInput.value);
    if (!isNaN(tuboValue)) {
        tubosValues.push(tuboValue);
        localStorage.setItem('tubosValues', JSON.stringify(tubosValues));
        displayTubosValues();
        calculateTotal();
    }
    tubosInput.value = '';
}

function displayTubosValues() {
    displayTubos.textContent = 'Tubos: ' + tubosValues.join(' + ');
}

function calculateTotal() {
    const totalTubos = tubosValues.reduce((acc, curr) => acc + curr, 0);
    totalTubosDisplay.textContent = 'Total Tubos: ' + totalTubos.toFixed(1);

    const valores = JSON.parse(localStorage.getItem('userValores'));
    if (valores) {
        const totalSurcos = totalTubos * valores.valor1 / 45;
        const finalResult = totalSurcos * valores.valor2;
        totalTubosDisplay.textContent += ` | Resultado: ${finalResult.toFixed(2)}`;
    } else {
        totalTubosDisplay.textContent += ' | Resultado: Ingrese los valores de surcos y precio.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tubosValues')) {
        tubosValues = JSON.parse(localStorage.getItem('tubosValues'));
        displayTubosValues();
        calculateTotal();
    }

    const savedTitles = JSON.parse(localStorage.getItem('userDatosTitulos'));
    if (savedTitles) {
        displayTitle1.textContent = savedTitles.title1Value;
        displayTitle2.textContent = savedTitles.title2Value;
        displayTitle3.textContent = savedTitles.title3Value;
        inputFieldsContainer.classList.add('d-none');
        titulosGuardadosContainer.classList.remove('d-none');
    }

    const savedObrero = localStorage.getItem('userObrero');
    if (savedObrero) {
        displayObrero.textContent = savedObrero;
        obreroGuardadoContainer.classList.remove('d-none');
        obreroInputContainer.classList.add('d-none');
    }
});
function eliminarUltimoTubo() {
    tubosValues.pop();
    localStorage.setItem('tubosValues', JSON.stringify(tubosValues));
    displayTubosValues();
    calculateTotal();
}
function editarUltimoTubo() {
    const editarTuboInput = document.getElementById('editarTubo');
    const nuevoValor = parseFloat(editarTuboInput.value);
    if (!isNaN(nuevoValor)) {
        tubosValues[tubosValues.length - 1] = nuevoValor;
        localStorage.setItem('tubosValues', JSON.stringify(tubosValues));
        displayTubosValues();
        calculateTotal();
        editarTuboInput.value = '';
    }
}
function limpiarTodo() {
    // Limpiar el localStorage
    localStorage.removeItem('userDatosTitulos');
    localStorage.removeItem('userValores');
    localStorage.removeItem('userObrero');
    localStorage.removeItem('tubosValues');

    // Limpiar los campos de la interfaz de usuario
    title1.value = '';
    title2.value = '';
    title3.value = '';
    valor1Input.value = '';
    valor2Input.value = '';
    obreroInput.value = '';
    tubosInput.value = '';
    displayTitle1.textContent = '';
    displayTitle2.textContent = '';
    displayTitle3.textContent = '';
    displayObrero.textContent = '';
    displayTubos.textContent = '';
    totalTubosDisplay.textContent = '';

    // Ocultar los contenedores y mostrar los campos de entrada
    titulosGuardadosContainer.classList.add('d-none');
    obreroGuardadoContainer.classList.add('d-none');
    inputFieldsContainer.classList.remove('d-none');
    obreroInputContainer.classList.remove('d-none');

    // Restablecer los valores
    tubosValues = [];
}