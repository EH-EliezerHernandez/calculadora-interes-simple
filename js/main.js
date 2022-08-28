const $inputCapital = document.querySelector("#inputCapital");
const $porcentageContainer = document.querySelector("#porcentageContainer");
const $inputTime = document.querySelector("#inputTime");
const $inputCustom = document.querySelector("#inputCustom");
const $btnReset = document.querySelector("#btnReset");

/*------------------addEventListeners-------------------- */

$inputCapital.addEventListener("input", realizarCalculos);
$porcentageContainer.addEventListener("click", (evt) => {
  const target = evt.target;
  const isBtn = target.classList.contains("btn");
  if (isBtn) {
    activeBtn(target);
    $inputCustom.classList.remove("selected");
    realizarCalculos();
  }
});

$inputTime.addEventListener("input", realizarCalculos);

$inputCustom.addEventListener("click", (evt) => {
  const target = evt.target;
  removeAllActive();
  cleanPlaceHolder(target);
  target.classList.add("selected");
  realizarCalculos();
});

$inputCustom.addEventListener("input", (evt) => {
  const target = evt.target;
  target.classList.add("selected");
  realizarCalculos();
});

$btnReset.addEventListener("click", resetCalculator);

/* $inputCustom.addEventListener("blur", (evt) => {
  const target = evt.target;
  addPlaceholder(target);
});
 */

/* -----------------functions--------------------- */

function addStylesInactiveState($element) {
  $element.classList.add("inactive");
}

function addInactiveState($element) {
  addStylesInactiveState($element);
  $element.disabled = true;
}

function removeInactiveState($element) {
  removeStylesInactiveState($element);
  $element.disabled = false;
}

function resetCalculator() {
  resetCampos();
  addDefaultPlaceholder($inputCustom);
  removeAllActive();
  addInactiveState($btnReset);
  resetResults();
}

function resetResults() {
  const $resultInteres = document.querySelector("#resultInteres");
  const $resultTotal = document.querySelector("#resultMontoTotal");
  $resultInteres.innerText = `$0.00`;
  $resultTotal.innerText = `$0.00`;
}

function resetCampos() {
  $inputCapital.value = "";
  $inputTime.value = "";
  $inputCustom.value = "";
}

function removeStylesInactiveState($element) {
  $element.classList.remove("inactive");
}

function addDefaultPlaceholder($input) {
  $input.placeholder = "Custom";
}

function cleanPlaceHolder($input) {
  $input.placeholder = "";
}

function removeAllActive() {
  const $buttons = document.querySelectorAll(".active");
  $buttons.forEach((btn) => {
    btn.classList.remove("active");
  });
}

function activeBtn($btn) {
  removeAllActive();
  $btn.classList.add("active");
}

function validarIsNumber(num) {
  return !isNaN(num);
}

function validarIsPositiveValue(num) {
  return num > 0;
}

function validarIsValidData({ name, value }) {
  const isValidData = true;

  if (!validarIsNumber(value)) {
    throw new Error(`El ${name} ingresado debe ser un numero`);
  }
  if (!validarIsPositiveValue(value)) {
    throw new Error(`El ${name} no debe representarse con un valor negativo`);
  }
  if (value === 0) {
    throw new Error(`El ${name} no debe ser de 0%`);
  }
  return isValidData;
}

function validarIsCampoEmpity($campo) {
  return $campo.value === "";
}

function validarIsSelectedButtom($option) {
  return Boolean($option);
}

class Data {
  constructor(name) {
    this.name = name;
  }
}

class empityError extends Error {
  constructor(mensaje) {
    super(mensaje);
  }
}

class noSelectedOptionError extends Error {
  constructor(mensaje) {
    super(mensaje);
  }
}

function capturarDatos() {
  const objCapital = new Data("capital");
  const objPorcent = new Data("porcentaje");
  const objTime = new Data("tiempo");

  objCapital.value = parseFloat($inputCapital.value);
  objTime.value = parseFloat($inputTime.value);
  const $btnPorcent = document.querySelector(".active");
  const $inputPorcent = document.querySelector(".selected");

  let porcent;
  let capital;
  let time;

  if (validarIsCampoEmpity($inputCapital)) {
    throw new empityError("El campo capital esta vacio");
  }

  if (validarIsValidData(objCapital)) {
    capital = objCapital.value;
  }

  if (validarIsCampoEmpity($inputTime)) {
    throw new empityError("El campo tiempo esta vacio");
  }

  if (validarIsValidData(objTime)) {
    time = objTime.value;
  }

  if (!validarIsSelectedButtom($btnPorcent) && !$inputPorcent) {
    throw new noSelectedOptionError("No se ha seleccionado ningun porcentaje");
  }

  if ($btnPorcent) {
    objPorcent.value = parseFloat($btnPorcent.value);
  }

  if ($inputPorcent) {
    objPorcent.value = parseFloat($inputPorcent.value);
  }

  if (validarIsValidData(objPorcent)) {
    porcent = objPorcent.value;
  }
  const objData = {
    porcent,
    time,
    capital,
  };
  return objData;
}

function calcularTotalPagar({ capital, interes }) {
  const totalPagar = capital + interes;
  return totalPagar;
}

function calcularInteresSimple({ time, capital, porcent }) {
  const interes = time * capital * (porcent / 100);
  return interes;
}

function renderResult({ interes, totalPagar }) {
  const $resultInteres = document.querySelector("#resultInteres");
  const $resultMontoTotal = document.querySelector("#resultMontoTotal");
  $resultInteres.innerText = `$${interes}`;
  $resultMontoTotal.innerText = `$${totalPagar}`;
}

function realizarCalculos() {
  addInactiveState($btnReset);
  try {
    const objData = capturarDatos();
    removeInactiveState($btnReset);
    const objResult = {};
    objResult.interes = calcularInteresSimple(objData);
    const interes = objResult.interes;
    objResult.totalPagar = calcularTotalPagar({ ...objData, interes });
    console.log({ ...objData, interes });
    renderResult(objResult);
  } catch (ex) {
    console.log(ex);
  }
}
