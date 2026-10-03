const SALDO_INICIAL = 100;
const DURACION_TIRADA = 800;
const SONIDO_TIRAR = "sonidos/spin.mp3";
const SONIDO_GANAR = "sonidos/win.mp3";
const SONIDO_PERDER = "sonidos/lose.mp3";

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
const textoResultado = document.querySelector("#resultado");
const listaHistorial = document.querySelector("#historial");

let saldo = SALDO_INICIAL;
const historial = [];

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
  textoPremio.textContent = calcularPremio(apuesta, objetivo);
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
  if (apuesta < 1 || apuesta % 1 !== 0) {
    return "La apuesta tiene que ser un número entero mayor que 0.";
  }

  if (apuesta > saldo) {
    return "No tienes suficiente dinero para apostar esa cantidad";
  }

  return "";
}

function reproducir(ruta) {
  const sonido = new Audio(ruta);
  sonido.play();
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

function agregarAlHistorial(registro) {
  historial.push(registro);

  const ficha = document.createElement("button");
  ficha.type = "button";
  ficha.textContent = registro.tirada;
  ficha.setAttribute("data-indice", historial.length - 1);
  pintarResultado(ficha, registro.gana);

  const elementoLista = document.createElement("li");
  elementoLista.appendChild(ficha);
  listaHistorial.appendChild(elementoLista);
}

function mostrarDetalle(registro) {
  const resultado = registro.gana
    ? `cobraste ${registro.premio} fichas`
    : `perdiste ${registro.apuesta} fichas`;
  mostrarAviso(
    `Tirada ${registro.numero}: salió ${registro.tirada} con objetivo ${registro.objetivo}. Apostaste ${registro.apuesta} y ${resultado}.`,
  );
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
  reproducir(SONIDO_TIRAR);
  setTimeout(() => resolverTirada(objetivo, apuesta), DURACION_TIRADA);
}

function resolverTirada(objetivo, apuesta) {
  const premio = calcularPremio(apuesta, objetivo);
  const tirada = tirarDado();
  const gana = tirada < objetivo;

  saldo -= apuesta;
  if (gana) {
    saldo += premio;
  }

  const mensaje = gana
    ? `¡Ha salido ${tirada}! Cobras ${premio} fichas.`
    : `Ha salido ${tirada}. Pierdes ${apuesta} fichas.`;
  reproducir(gana ? SONIDO_GANAR : SONIDO_PERDER);
  mostrarTirada(tirada, gana, mensaje);

  agregarAlHistorial({
    numero: historial.length + 1,
    tirada: tirada,
    objetivo: objetivo,
    apuesta: apuesta,
    premio: premio,
    gana: gana,
  });

  botonTirar.disabled = false;
}

deslizador.addEventListener("input", actualizarPanel);
campoApuesta.addEventListener("input", actualizarPanel);
botonTirar.addEventListener("click", jugar);

listaHistorial.addEventListener("click", (event) => {
  const ficha = event.target.closest("button");
  if (!ficha) return;

  const indice = Number(ficha.getAttribute("data-indice"));
  mostrarDetalle(historial[indice]);
});

actualizarPanel();
