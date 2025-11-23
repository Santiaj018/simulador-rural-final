// -----------------------------------------------------------
// Configuración de la API (backend en Node)
// -----------------------------------------------------------
const API_BASE = "http://localhost:3000";

let questions = [];
let currentIndex = 0;

// Estado del juego (0 a 100)
let produccion = 60;
let suelo = 70;
let agua = 80;
let bosque = 75;
let sostenibilidad = 75;

let juegoTerminado = false;

// -----------------------------------------------------------
// Utilidades
// -----------------------------------------------------------
function clamp(v) {
  return Math.max(0, Math.min(100, v));
}

function calcularSostenibilidad() {
  sostenibilidad = Math.round((suelo + agua + bosque) / 3);
}

function actualizarBarras() {
  document.getElementById("lblProduccion").textContent = produccion;
  document.getElementById("lblSuelo").textContent = suelo;
  document.getElementById("lblAgua").textContent = agua;
  document.getElementById("lblBosque").textContent = bosque;
  document.getElementById("lblSostenibilidad").textContent = sostenibilidad;

  document.getElementById("barProduccion").style.width = produccion + "%";
  document.getElementById("barSuelo").style.width = suelo + "%";
  document.getElementById("barAgua").style.width = agua + "%";
  document.getElementById("barBosque").style.width = bosque + "%";
  document.getElementById("barSostenibilidad").style.width =
    sostenibilidad + "%";
}

// -----------------------------------------------------------
// Canvas: dibujo simple de la finca cafetera
// -----------------------------------------------------------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function drawScene() {
  // Fondo (suelo)
  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cultivo de café (zona izquierda)
  const cultivoAncho = 220 + (produccion - 60); // más producción, más área
  ctx.fillStyle = "#15803d";
  ctx.fillRect(20, 140, cultivoAncho, 130);

  // Líneas de plantas
  ctx.strokeStyle = "#22c55e";
  for (let x = 30; x < 20 + cultivoAncho; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 265);
    ctx.stroke();
  }

  // Bosque (zona derecha)
  const bosqueAnchura = 160 * (bosque / 100);
  ctx.fillStyle = "#14532d";
  ctx.fillRect(canvas.width - bosqueAnchura - 20, 120, bosqueAnchura, 150);

  // Árboles estilizados
  const numArboles = Math.max(2, Math.round((bosque / 100) * 8));
  for (let i = 0; i < numArboles; i++) {
    const baseX =
      canvas.width - bosqueAnchura - 10 + (i * bosqueAnchura) / numArboles;
    const baseY = 250;
    ctx.fillStyle = "#166534";
    ctx.beginPath();
    ctx.arc(baseX, baseY - 20, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(baseX - 3, baseY - 20, 6, 30);
  }

  // Río (parte inferior)
  const contaminacion = 100 - agua;
  const intensidad = Math.min(1, contaminacion / 100);
  const azulLimpio = { r: 56, g: 189, b: 248 }; // #38bdf8
  const azulSucio = { r: 30, g: 64, b: 175 };   // más oscuro

  const r = Math.round(
    azulLimpio.r * (1 - intensidad) + azulSucio.r * intensidad
  );
  const g = Math.round(
    azulLimpio.g * (1 - intensidad) + azulSucio.g * intensidad
  );
  const b = Math.round(
    azulLimpio.b * (1 - intensidad) + azulSucio.b * intensidad
  );
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 260, canvas.width, 60);

  // Texto simple
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText("Cultivo de café", 24, 155);
  ctx.fillText("Bosque", canvas.width - bosqueAnchura, 135);
  ctx.fillText("Quebrada", 20, 280);
}

// -----------------------------------------------------------
// Preguntas y decisiones
// -----------------------------------------------------------
async function cargarPreguntas() {
  try {
    const resp = await fetch(`${API_BASE}/api/questions`);
    const data = await resp.json();
    questions = data.questions || [];
    currentIndex = 0;
    juegoTerminado = false;
    actualizarPregunta();
  } catch (err) {
    console.error("Error cargando preguntas", err);
    document.getElementById("tituloPregunta").textContent =
      "No se pudo cargar la información del servidor.";
  }
}

function actualizarPregunta() {
  const btnSiguiente = document.getElementById("btnSiguiente");
  const panelResultado = document.getElementById("panelResultado");
  const panelConclusiones = document.getElementById("panelConclusiones");

  panelResultado.classList.add("oculto");
  panelConclusiones.classList.add("oculto");

  if (currentIndex >= questions.length) {
    // Juego terminado
    juegoTerminado = true;
    btnSiguiente.disabled = true;
    finalizarJuego();
    return;
  }

  const q = questions[currentIndex];
  document.getElementById("tituloPregunta").textContent = q.title;
  document.getElementById("textoPregunta").textContent = q.text;

  const contOpciones = document.getElementById("opciones");
  contOpciones.innerHTML = "";

  q.options.forEach((opt, i) => {
    const label = document.createElement("label");
    label.className = "opcion";
    label.innerHTML = `
      <input type="radio" name="opcion" value="${opt.id}" ${
      i === 0 ? "checked" : ""
    }>
      <strong>${opt.label}:</strong> ${opt.description}
    `;
    contOpciones.appendChild(label);
  });

  btnSiguiente.disabled = false;
}

function aplicarDecision(optionId) {
  // Lógica basada en los IDs definidos en el backend.
  // Cada decisión modifica producción y variables ambientales.

  let dProd = 0;
  let dSuelo = 0;
  let dAgua = 0;
  let dBosque = 0;

  switch (optionId) {
    case "fert-bajo":
      dProd -= 3;
      dSuelo += 4;
      dAgua += 3;
      break;
    case "fert-medio":
      dProd += 5;
      dSuelo -= 2;
      dAgua -= 2;
      break;
    case "fert-alto":
      dProd += 10;
      dSuelo -= 6;
      dAgua -= 8;
      break;

    case "bosque-conservar":
      dBosque += 4;
      dSuelo += 2;
      break;
    case "bosque-def-poco":
      dBosque -= 6;
      dSuelo -= 3;
      dProd += 5;
      break;
    case "bosque-def-mucho":
      dBosque -= 12;
      dSuelo -= 6;
      dProd += 8;
      break;

    case "agua-sin-prot":
      dAgua -= 5;
      break;
    case "agua-prot":
      dAgua += 5;
      dBosque += 2;
      break;

    case "capacit-no":
      break;
    case "capacit-si":
      dProd += 2;
      dSuelo += 3;
      dAgua += 3;
      dBosque += 3;
      break;

    case "estrat-produccion":
      dProd += 8;
      dSuelo -= 4;
      dAgua -= 4;
      dBosque -= 4;
      break;
    case "estrat-equilibrio":
      dProd += 3;
      break;
    case "estrat-conservacion":
      dProd -= 5;
      dSuelo += 4;
      dAgua += 4;
      dBosque += 4;
      break;
  }

  produccion = clamp(produccion + dProd);
  suelo = clamp(suelo + dSuelo);
  agua = clamp(agua + dAgua);
  bosque = clamp(bosque + dBosque);
  calcularSostenibilidad();
}

function siguientePregunta() {
  if (juegoTerminado) return;

  const seleccion = document.querySelector('input[name="opcion"]:checked');
  if (!seleccion) return;

  const opcionId = seleccion.value;
  aplicarDecision(opcionId);
  currentIndex += 1;

  actualizarBarras();
  drawScene();
  actualizarPregunta();
}

// -----------------------------------------------------------
// Final del juego: envía resultados al backend y muestra feedback
// -----------------------------------------------------------
async function finalizarJuego() {
  const panelResultado = document.getElementById("panelResultado");
  const panelConclusiones = document.getElementById("panelConclusiones");
  const resumen = document.getElementById("resumenResultados");
  const feedbackBackend = document.getElementById("feedbackBackend");
  const textoConclusiones = document.getElementById("textoConclusiones");

  resumen.textContent =
    `Producción final: ${produccion}/100 | ` +
    `Suelo: ${suelo}/100 | Agua: ${agua}/100 | ` +
    `Bosque: ${bosque}/100 | Sostenibilidad global: ${sostenibilidad}/100.`;

  panelResultado.classList.remove("oculto");

  try {
    const resp = await fetch(`${API_BASE}/api/result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produccion, suelo, agua, bosque, sostenibilidad })
    });
    const data = await resp.json();
    feedbackBackend.textContent = data.feedback || "";

    let conclusiones = "";
    switch (data.endingType) {
      case "max-produccion-malo-ambiente":
        conclusiones =
          "Tu estrategia priorizó la producción a cualquier costo. Esto enseña que, en la práctica, un manejo que ignora el ecosistema termina afectando también la sostenibilidad económica a largo plazo.";
        break;
      case "equilibrio":
        conclusiones =
          "Buscaste un equilibrio entre rendimiento y conservación. Esta simulación refuerza la idea de que es posible producir y, al mismo tiempo, cuidar el suelo, el agua y el bosque.";
        break;
      case "conservacion-alta":
        conclusiones =
          "Optaste por cuidar al máximo el ecosistema, incluso sacrificando parte de la producción. Muestra la importancia de la conservación como base para el bienestar de las comunidades rurales.";
        break;
      case "malo-en-todo":
        conclusiones =
          "Las decisiones combinadas no fueron adecuadas para la producción ni para el ambiente. Esto resalta la necesidad de planear mejor el manejo del ecosistema y no tomar decisiones aisladas.";
        break;
      default:
        conclusiones =
          "Obtienes un resultado intermedio. Pequeños ajustes en el uso de fertilizantes, la protección del bosque y el cuidado de las quebradas pueden mejorar significativamente la sostenibilidad del sistema productivo.";
        break;
    }

    textoConclusiones.textContent = conclusiones;
    panelConclusiones.classList.remove("oculto");
  } catch (err) {
    console.error("Error enviando resultados", err);
    feedbackBackend.textContent =
      "No se pudo conectar con el servidor para obtener retroalimentación.";
  }
}

// -----------------------------------------------------------
// Reiniciar
// -----------------------------------------------------------
function reiniciar() {
  produccion = 60;
  suelo = 70;
  agua = 80;
  bosque = 75;
  calcularSostenibilidad();
  actualizarBarras();
  drawScene();
  currentIndex = 0;
  juegoTerminado = false;
  document.getElementById("btnSiguiente").disabled = false;
  document.getElementById("panelResultado").classList.add("oculto");
  document.getElementById("panelConclusiones").classList.add("oculto");
  cargarPreguntas();
}

// -----------------------------------------------------------
// Eventos e inicio
// -----------------------------------------------------------
document
  .getElementById("btnSiguiente")
  .addEventListener("click", siguientePregunta);
document
  .getElementById("btnReiniciar")
  .addEventListener("click", reiniciar);

calcularSostenibilidad();
actualizarBarras();
drawScene();
cargarPreguntas();
