const deslizador = document.querySelector("#objetivo");
const campoApuesta = document.querySelector("#apuesta");
const textoObjetivo = document.querySelector("#valor-objetivo");
const zonaGanar = document.querySelector("#zona-ganar");
const textoProbabilidad = document.querySelector("#probabilidad");
const textoMultiplicador = document.querySelector("#multiplicador");
const textoPremio = document.querySelector("#premio");

function calcularMultiplicador(objetivo) {
  return Math.round((100 / objetivo) * 100) / 100;
}

function actualizarPanel() {
  const objetivo = Number(deslizador.value);
  const apuesta = Number(campoApuesta.value);
  const multiplicador = calcularMultiplicador(objetivo);
  const premio = Math.floor(apuesta * multiplicador);

  textoObjetivo.textContent = objetivo;
  textoProbabilidad.textContent = `${objetivo}%`;
  textoMultiplicador.textContent = `x${multiplicador}`;
  textoPremio.textContent = premio;
  zonaGanar.style.width = `${objetivo}%`;
}

deslizador.addEventListener("input", actualizarPanel);
campoApuesta.addEventListener("input", actualizarPanel);

actualizarPanel();
