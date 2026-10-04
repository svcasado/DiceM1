const SALDO_INICIAL = 100;
const APUESTA_MINIMA = 10;
const DURACION_TIRADA = 800;
const TECLA_NOCHE = "N";

const deslizador = document.querySelector("#objetivo");
const campoApuesta = document.querySelector("#apuesta");
const textoObjetivo = document.querySelector("#valor-objetivo");
const zonaGanar = document.querySelector("#zona-ganar");
const textoProbabilidad = document.querySelector("#probabilidad");
const textoMultiplicador = document.querySelector("#multiplicador");
const textoPremio = document.querySelector("#premio");
const textoSaldo = document.querySelector("#saldo");
const textoTirada = document.querySelector("#tirada");
const marca = document.querySelector("#marca");
const botonTirar = document.querySelector("#boton-tirar");
const botonReiniciar = document.querySelector("#boton-reiniciar");
const textoResultado = document.querySelector("#resultado");
const listaHistorial = document.querySelector("#historial");

let saldo = SALDO_INICIAL;

function calcularMultiplicador(objetivo) {
  return Math.round((100 / objetivo) * 100) / 100;
}

function calcularPremio(apuesta, objetivo) {
  return Math.floor(apuesta * calcularMultiplicador(objetivo));
}

function actualizarPanel() {
  const objetivo = Number(deslizador.value);
  const apuesta = Number(campoApuesta.value);

  textoObjetivo.textContent = objetivo;
  textoProbabilidad.textContent = `${objetivo}%`;
  textoMultiplicador.textContent = `x${calcularMultiplicador(objetivo)}`;
  textoPremio.textContent =
    campoApuesta.value === "" ? "--" : calcularPremio(apuesta, objetivo);
  zonaGanar.style.width = `${objetivo}%`;
}

function tirarDado() {
  return Math.floor(Math.random() * 100);
}

function validarApuesta(valor) {
  const apuesta = Number(valor);

  if (valor === "") {
    return "Escribe cuántas fichas quieres apostar.";
  }
  if (apuesta % 1 !== 0) {
    return "La apuesta tiene que ser un número entero.";
  }
  if (apuesta < APUESTA_MINIMA) {
    return `La apuesta mínima es de ${APUESTA_MINIMA} fichas.`;
  }

  if (apuesta > saldo) {
    return `Solo tienes ${saldo} fichas.`;
  }

  return "";
}

function pintarResultado(elemento, gana) {
  elemento.classList.remove("gana", "pierde");
  elemento.classList.add(gana ? "gana" : "pierde");
}

function mostrarAviso(mensaje) {
  textoResultado.classList.remove("gana", "pierde");
  textoResultado.textContent = mensaje;
}

function mostrarTirada(tirada, gana, mensaje) {
  textoTirada.textContent = tirada;
  marca.textContent = tirada;
  marca.style.left = `${tirada}%`;
  marca.classList.remove("oculto");
  pintarResultado(marca, gana);
  pintarResultado(textoResultado, gana);
  textoResultado.textContent = mensaje;
  textoSaldo.textContent = saldo;
}

function agregarAlHistorial(tirada, gana) {
  const ficha = document.createElement("button");
  ficha.setAttribute("type", "button");
  ficha.textContent = tirada;
  pintarResultado(ficha, gana);

  const elementoLista = document.createElement("li");
  elementoLista.appendChild(ficha);
  listaHistorial.appendChild(elementoLista);
}

function jugar() {
  const aviso = validarApuesta(campoApuesta.value);
  if (aviso !== "") {
    mostrarAviso(aviso);
    return;
  }

  const objetivo = Number(deslizador.value);
  const apuesta = Number(campoApuesta.value);

  botonTirar.disabled = true;
  textoTirada.textContent = "…";
  mostrarAviso("El dado está rodando…");
  setTimeout(() => resolverTirada(objetivo, apuesta), DURACION_TIRADA);
}

function resolverTirada(objetivo, apuesta) {
  const premio = calcularPremio(apuesta, objetivo);
  const tirada = tirarDado();
  const gana = tirada < objetivo;

  saldo = saldo - apuesta;
  if (gana) {
    saldo = saldo + premio;
  }

  const mensaje = gana
    ? `¡Ha salido ${tirada}! Cobras ${premio} fichas.`
    : `Ha salido ${tirada}. Pierdes ${apuesta} fichas.`;
  mostrarTirada(tirada, gana, mensaje);

  agregarAlHistorial(tirada, gana);

  botonTirar.disabled = false;

  if (saldo < APUESTA_MINIMA) {
    terminarPartida();
  }
}

function terminarPartida() {
  mostrarAviso(
    `Te has quedado sin fichas después de ${listaHistorial.children.length} tiradas.`,
  );
  botonTirar.classList.add("oculto");
  botonReiniciar.classList.remove("oculto");
}

function reiniciarPartida() {
  saldo = SALDO_INICIAL;
  listaHistorial.textContent = "";

  textoSaldo.textContent = saldo;
  textoTirada.textContent = "--";
  marca.classList.add("oculto");
  mostrarAviso("Haz tu apuesta…");

  botonReiniciar.classList.add("oculto");
  botonTirar.classList.remove("oculto");
}

deslizador.addEventListener("input", actualizarPanel);
campoApuesta.addEventListener("input", actualizarPanel);
botonTirar.addEventListener("click", jugar);
botonReiniciar.addEventListener("click", reiniciarPartida);

listaHistorial.addEventListener("click", (event) => {
  const fichaPulsada = event.target.closest("button");
  if (!fichaPulsada) return;

  mostrarAviso(`En esa tirada salió un ${fichaPulsada.textContent}.`);
});

document.addEventListener("keydown", (event) => {
  if (event.key.toUpperCase() === TECLA_NOCHE) {
    document.querySelector("body").classList.toggle("noche");
  }
});

actualizarPanel();
