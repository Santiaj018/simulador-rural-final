const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------
// Preguntas del juego: cada pregunta tiene opciones que describen
// decisiones de producción y manejo del ecosistema en una vereda cafetera.
// -------------------------------------------------------------------
const questions = [
  {
    id: 1,
    title: "Decisión sobre fertilizantes (Año 1)",
    text: "Necesitas decidir cuántos fertilizantes químicos vas a usar en tu cafetal.",
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
    title: "Tecnología y capacitación",
    text: "Un programa ofrece capacitación en buenas prácticas agrícolas.",
    options: [
      {
        id: "capacit-no",
        label: "No participar",
        description:
          "Prefieres seguir manejando la finca como siempre."
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
    title: "Estrategia final",
    text: "Debes elegir tu estrategia general para los próximos años.",
    options: [
      {
        id: "estrat-produccion",
        label: "Priorizar la producción máxima",
        description:
          "Te enfocas en producir la mayor cantidad posible de café, aunque se deteriore el ambiente."
      },
      {
        id: "estrat-equilibrio",
        label: "Buscar equilibrio",
        description:
          "Buscas equilibrio entre ingresos y protección ambiental."
      },
      {
        id: "estrat-conservacion",
        label: "Enfocarte en la conservación",
        description:
          "Aceptas producir menos café pero cuidas al máximo el ecosistema."
      }
    ]
  }
];

// GET /api/questions -> lista de preguntas
app.get("/api/questions", (req, res) => {
  res.json({ questions });
});

// POST /api/result -> recibe las variables finales y devuelve feedback
app.post("/api/result", (req, res) => {
  const {
    produccion = 0,
    suelo = 0,
    agua = 0,
    bosque = 0,
    sostenibilidad = 0
  } = req.body || {};

  let endingType = "equilibrado";
  let feedback = "";

  if (produccion >= 80 && sostenibilidad <= 50) {
    endingType = "max-produccion-malo-ambiente";
    feedback =
      "Lograste una producción alta de café, pero el ecosistema quedó seriamente afectado. El suelo se degradó, la calidad del agua disminuyó y se perdió gran parte del bosque. Es un ejemplo de manejo no sostenible del territorio.";
  } else if (produccion >= 60 && sostenibilidad >= 60) {
    endingType = "equilibrio";
    feedback =
      "Tus decisiones permitieron mantener una producción adecuada de café, al tiempo que conservaste el suelo, el agua y el bosque en condiciones aceptables. Representas una estrategia de producción sostenible en un contexto rural.";
  } else if (produccion < 50 && sostenibilidad >= 70) {
    endingType = "conservacion-alta";
    feedback =
      "El ecosistema se encuentra en muy buen estado, pero la producción de café fue baja. Es un enfoque de conservación fuerte. A futuro podrías explorar prácticas que aumenten moderadamente el rendimiento sin perder la sostenibilidad.";
  } else if (produccion < 50 && sostenibilidad < 50) {
    endingType = "malo-en-todo";
    feedback =
      "Las decisiones no fueron favorables ni para la producción ni para el ambiente. El reto consiste en entender cómo ciertas acciones combinadas pueden degradar el ecosistema y, al mismo tiempo, no generar los ingresos esperados.";
  } else {
    endingType = "intermedio";
    feedback =
      "El resultado fue intermedio: ni la producción ni la sostenibilidad alcanzaron niveles extremos. Este escenario muestra que pequeñas mejoras en tus decisiones de manejo del ecosistema (uso de fertilizantes, protección del agua y conservación de bosque) pueden marcar la diferencia hacia un modelo más sostenible.";
  }

  res.json({
    endingType,
    feedback
  });
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API de simulador rural escuchando en http://localhost:${PORT}`);
});
