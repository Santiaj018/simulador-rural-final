// Versión GitHub Pages: todo local, sin backend ni localhost

let questions = [
  {
    id: 1,
    title: "Uso de fertilizantes (Año 1)",
    text: "Debes decidir cuántos fertilizantes químicos aplicarás en tu cafetal.",
    options: [
      {
        id: "fert-bajo",
        label: "Uso bajo de fertilizantes",
        description:
          "Aplicar una cantidad mínima, priorizando el cuidado del suelo y del agua."
      },
      {
        id: "fert-medio",
        label: "Uso medio de fertilizantes",
        description:
          "Buscar equilibrio entre rendimiento y protección ambiental."
      },
      {
        id: "fert-alto",
        label: "Uso alto de fertilizantes",
        description:
          "Aplicar muchos fertilizantes para producir más café en el corto plazo."
      }
    ]
  },
  {
    id: 2,
    title: "Manejo del bosque",
    text: "Te proponen tumbar bosque para ampliar el cultivo de café.",
    options: [
      {
        id: "bosque-conservar",
        label: "Conservar el bosque",
        description:
          "No ampliar el cultivo; mantienes los árboles y la biodiversidad."
      },
      {
        id: "bosque-def-poco",
        label: "Deforestar un poco",
        description:
          "Tumbar una parte del bosque para sembrar más café."
      },
      {
        id: "bosque-def-mucho",
        label: "Deforestar mucho",
        description:
          "Eliminar gran parte del bosque para maximizar el área de cultivo."
      }
    ]
  },
  {
    id: 3,
    title: "Protección de la quebrada",
    text: "Tu finca tiene una quebrada que atraviesa el terreno.",
    options: [
      {
        id: "agua-sin-prot",
        label: "No hacer nada especial",
        description:
          "Dejar el cultivo cerca de la quebrada sin franjas de protección."
      },
      {
        id: "agua-prot",
        label: "Implementar franjas de protección",
        description:
          "Sembrar barreras vivas y dejar un espacio sin cultivo cerca de la quebrada."
      }
    ]
  },
  {
    id: 4,
    title: "Capacitación y buenas prácticas",
    text: "Un programa ofrece capacitación en buenas prácticas agrícolas.",
    options: [
      {
        id: "capacit-no",
        label: "No participar",
        description: "Prefieres seguir manejando la finca como siempre."
      },
      {
        id: "capacit-si",
        label: "Participar",
        description:
          "Asistes a la capacitación e integras prácticas más sostenibles."
      }
    ]
  },
  {
    id: 5,
    title: "Estrategia general",
    text: "Elige tu estrategia general de manejo para los próximos años.",
    options: [
      {
        id: "estrat-produccion",
        label: "Máxima producción",
        description:
          "Te enfocas en producir la mayor cantidad posible de café, aunque se deteriore el ambiente."
      },
      {
        id: "estrat-equilibrio",
        label: "Producción equilibrada",
        description:
          "Buscas equilibrio entre ingresos y protección ambiental."
      },
      {
        id: "estrat-conservacion",
        label: "Conservación del ecosistema",
        description:
          "Aceptas producir menos café pero cuidas al máximo el ecosistema."
      }
    ]
  }
];

let currentIndex = 0;
let produccion = 60;
let suelo = 70;
let agua = 80;
let bosque = 75;
let sostenibilidad = 75;
let juegoTerminado = false;

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

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function drawScene() {
  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cultivoAncho = 220 + (produccion - 60);
  ctx.fillStyle = "#15803d";
  ctx.fillRect(20, 140, cultivoAncho, 130);

  ctx.strokeStyle = "#22c55e";
  for (let x = 30; x < 20 + cultivoAncho; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 265);
    ctx.stroke();
  }

  const bosqueAnchura = 160 * (bosque / 100);
  ctx.fillStyle = "#14532d";
  ctx.fillRect(canvas.width - bosqueAnchura - 20, 120, bosqueAnchura, 150);

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

  const contaminacion = 100 - agua;
  const intensidad = Math.min(1, contaminacion / 100);
  const azulLimpio = { r: 56, g: 189, b: 248 };
  const azulSucio = { r: 30, g: 64, b: 175 };

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

  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText("Cultivo de café", 24, 155);
  ctx.fillText("Bosque", canvas.width - bosqueAnchura, 135);
  ctx.fillText("Quebrada", 20, 280);
}

// Preguntas sin fetch
function cargarPreguntas() {
  currentIndex = 0;
  juegoTerminado = false;
  actualizarPregunta();
}

function actualizarPregunta() {
  const btnSiguiente = document.getElementById("btnSiguiente");
  const panelResultado = document.getElementById("panelResultado");
  const panelConclusiones = document.getElementById("panelConclusiones");

  panelResultado.classList.add("oculto");
  panelConclusiones.classList.add("oculto");

  if (currentIndex >= questions.length) {
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

function finalizarJuego() {
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

  let endingType = "equilibrio";
  let feedback = "";

  if (produccion >= 80 && sostenibilidad <= 50) {
    endingType = "max-produccion-malo-ambiente";
    feedback =
      "Lograste una producción alta de café, pero el ecosistema quedó seriamente afectado. Es un ejemplo de manejo no sostenible del territorio.";
  } else if (produccion >= 60 && sostenibilidad >= 60) {
    endingType = "equilibrio";
    feedback =
      "Tus decisiones permitieron mantener una producción adecuada de café y conservar el suelo, el agua y el bosque en condiciones aceptables.";
  } else if (produccion < 50 && sostenibilidad >= 70) {
    endingType = "conservacion-alta";
    feedback =
      "El ecosistema se encuentra en muy buen estado, pero la producción de café fue baja. Muestra un enfoque de conservación fuerte.";
  } else if (produccion < 50 && sostenibilidad < 50) {
    endingType = "malo-en-todo";
    feedback =
      "Las decisiones no fueron favorables ni para la producción ni para el ambiente. Destaca la importancia de planear mejor el manejo del ecosistema.";
  } else {
    endingType = "intermedio";
    feedback =
      "El resultado fue intermedio. Pequeños ajustes en tus decisiones pueden mejorar la sostenibilidad y el rendimiento de la finca.";
  }

  feedbackBackend.textContent = feedback;

  let conclusiones = "";
  switch (endingType) {
    case "max-produccion-malo-ambiente":
      conclusiones =
        "Priorizaste la producción a cualquier costo. Esto muestra que ignorar el ecosistema afecta también la sostenibilidad económica a futuro.";
      break;
    case "equilibrio":
      conclusiones =
        "Buscaste un equilibrio entre rendimiento y conservación. La simulación demuestra que es posible producir y cuidar el ambiente al mismo tiempo.";
      break;
    case "conservacion-alta":
      conclusiones =
        "Decidiste cuidar al máximo el ecosistema, sacrificando parte de la producción. Destaca la importancia de la conservación para el bienestar rural.";
      break;
    case "malo-en-todo":
      conclusiones =
        "Las decisiones combinadas no favorecieron ni la producción ni el ambiente. Resalta la necesidad de tomar decisiones más informadas.";
      break;
    default:
      conclusiones =
        "Tu resultado fue intermedio; con pequeños cambios en el uso de fertilizantes, el cuidado del bosque y la protección del agua, podrías lograr una finca más sostenible.";
      break;
  }

  textoConclusiones.textContent = conclusiones;
  panelConclusiones.classList.remove("oculto");
}

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

