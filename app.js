let ejercicios = [];

/* ===============================
   CARGA DE MÚLTIPLES JSON
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const archivos = [
    "guia1.json",
    "guia2.json"
  ];

  Promise.all(
    archivos.map(a => fetch(a).then(r => r.json()))
  )
    .then(data => {
      ejercicios = data.flat();

      mensajeBot(
        "Hola 👋 Soy Isaias-Bot, el asistente virtual de <strong>Análisis Matemático 1</strong>.<br>" +
        "Cátedra: <strong>Vázquez Magnani</strong>.<br><br>" +
        "Podés buscar por tema (ej: <em>inecuaciones</em>, <em>funciones</em>)<br>" +
        "o pedir la <em>resolución del ejercicio 2</em>."
      );
    })
    .catch(() => {
      mensajeBot("❌ Error al cargar los ejercicios.");
    });
});

/* ===============================
   MENSAJES
================================ */

function mensajeUsuario(texto) {
  const chat = document.getElementById("chat-container");
  const div = document.createElement("div");
  div.className = "mensaje usuario";
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function mensajeBot(html) {
  const chat = document.getElementById("chat-container");
  const div = document.createElement("div");
  div.className = "mensaje bot";
  div.innerHTML = html;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}

/* ===============================
   BÚSQUEDA
================================ */

function buscar() {
  const input = document.getElementById("inputPregunta");
  const textoOriginal = input.value.trim();
  const texto = textoOriginal.toLowerCase();

  if (!texto) return;

  mensajeUsuario(textoOriginal);
  input.value = "";

  let respuesta = "";
  let encontrados = 0;

  const pedirResolucion =
    texto.includes("resolucion") || texto.includes("resolución");

  const numeroMatch = texto.match(/\d+/);
  const numeroEjercicio = numeroMatch ? parseInt(numeroMatch[0]) : null;

  ejercicios.forEach(bloque => {
    bloque.ejercicios.forEach(ej => {

      const contenido =
        bloque.titulo + " " +
        ej.enunciado + " " +
        (ej.expresiones ? ej.expresiones.join(" ") : "");

      /* ========= RESOLUCIÓN ========= */
      if (
        pedirResolucion &&
        numeroEjercicio === ej.numero &&
        ej.resolucion
      ) {
        respuesta += `<strong>${bloque.titulo}</strong> (pág. ${bloque.pagina})<br>`;
        respuesta += `<strong>Ejercicio ${ej.numero}</strong><br>`;
        respuesta += `<em>${ej.enunciado}</em><br><br>`;

        /* EXPRESIONES (SIN TEXTO "Expresión") */
        if (ej.expresiones) {
          ej.expresiones.forEach(e => {
            respuesta += `$$${e}$$`;
          });
          respuesta += "<br>";
        }

        /* RESOLUCIÓN */
        respuesta += "<strong>Resolución:</strong><ul>";
        ej.resolucion.forEach(r => {
          respuesta += `<li>${r}</li>`;
        });
        respuesta += "</ul><br>";

        encontrados++;
      }

      /* ========= BÚSQUEDA POR TEMA ========= */
      if (
        !pedirResolucion &&
        contenido.toLowerCase().includes(texto) &&
        encontrados < 3
      ) {
        respuesta += `<strong>${bloque.titulo}</strong> (pág. ${bloque.pagina})<br>`;
        respuesta += `<strong>Ejercicio ${ej.numero}</strong><br>`;
        respuesta += `${ej.enunciado}<br><br>`;

        if (ej.expresiones) {
          ej.expresiones.forEach(e => {
            respuesta += `$$${e}$$`;
          });
          respuesta += "<br>";
        }

        encontrados++;
      }
    });
  });

  if (respuesta === "") {
    mensajeBot(
      "No encontré información para esa consulta.<br><br>" +
      "Probá con:<br>" +
      "• inecuaciones racionales<br>" +
      "• funciones<br>" +
      "• resolución ejercicio 4"
    );
  } else {
    mensajeBot(respuesta);
  }
}
