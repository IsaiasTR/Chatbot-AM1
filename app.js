let ejercicios = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("ejercicios.json")
    .then(r => r.json())
    .then(data => {
      ejercicios = data;
      mensajeBot(
        "Hola 👋 Soy el asistente virtual de <strong>Análisis Matemático 1</strong>.<br>" +
        "Cátedra: <strong>Vázquez Magnani</strong>.<br><br>" +
        "Podés buscar por tema (ej: funciones lineales) o pedir la <em>resolución del ejercicio 1</em>."
      );
    })
    .catch(() => {
      mensajeBot("Error al cargar los ejercicios.");
    });
});

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
  if (window.MathJax) MathJax.typesetPromise();
}

function buscar() {
  const input = document.getElementById("inputPregunta");
  const textoOriginal = input.value.trim();
  const texto = textoOriginal.toLowerCase();
  if (!texto) return;

  mensajeUsuario(textoOriginal);
  input.value = "";

  let respuesta = "";
  let encontrados = 0;

  // detectar pedido de resolución
  const pedirResolucion = texto.includes("resolucion");
  const numeroMatch = texto.match(/\d+/);
  const numeroEjercicio = numeroMatch ? parseInt(numeroMatch[0]) : null;

  ejercicios.forEach(bloque => {
    bloque.ejercicios.forEach(ej => {

      const contenido =
        bloque.titulo +
        " " +
        ej.enunciado +
        " " +
        (ej.funciones ? ej.funciones.join(" ") : "") +
        (ej.consignas ? ej.consignas.join(" ") : "");

      // PEDIDO DE RESOLUCIÓN
      if (pedirResolucion && numeroEjercicio === ej.numero && ej.resolucion) {
        respuesta += `<strong>${bloque.titulo}</strong> (pág. ${bloque.pagina})<br>`;
        respuesta += `<strong>Ejercicio ${ej.numero}</strong><br>`;
        respuesta += `<em>${ej.enunciado}</em><br><br>`;
        respuesta += "<strong>Resolución:</strong><ul>";
        ej.resolucion.forEach(r => {
          respuesta += `<li>${r}</li>`;
        });
        respuesta += "</ul><br>";
        encontrados++;
      }

      // BÚSQUEDA NORMAL
      if (!pedirResolucion && contenido.toLowerCase().includes(texto) && encontrados < 3) {

        respuesta += `<strong>${bloque.titulo}</strong> (pág. ${bloque.pagina})<br>`;
        respuesta += `<strong>Ejercicio ${ej.numero}</strong><br>`;
        respuesta += `${ej.enunciado}<br>`;

        if (ej.funciones) {
          respuesta += "<ul>";
          ej.funciones.forEach(f => {
            respuesta += `<li>${f}</li>`;
          });
          respuesta += "</ul>";
        }

        if (ej.consignas) {
          respuesta += "<ul>";
          ej.consignas.forEach(c => {
            respuesta += `<li>${c}</li>`;
          });
          respuesta += "</ul>";
        }

        respuesta += "<br>";
        encontrados++;
      }
    });
  });

  if (respuesta === "") {
    mensajeBot(
      "No encontré información para esa consulta.<br>" +
      "Probá con:<br>" +
      "• funciones lineales<br>" +
      "• resolución ejercicio 1"
    );
  } else {
    mensajeBot(respuesta);
  }
}
