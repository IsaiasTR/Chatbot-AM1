let ejercicios = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("ejercicios.json")
    .then(response => response.json())
    .then(data => {
      ejercicios = data;
      mostrarMensajeInicial();
    })
    .catch(error => {
      console.error("Error cargando ejercicios:", error);
    });
});

function mostrarMensajeInicial() {
  const container = document.getElementById("chat-container");
  container.innerHTML = `
    <div class="mensaje-inicial">
      Escribí un tema o palabra clave para buscar ejercicios.
      <br>
      <span>Ejemplos: límite, función, continuidad</span>
    </div>
  `;
}

function buscar() {
  const texto = document
    .getElementById("inputPregunta")
    .value
    .toLowerCase()
    .trim();

  if (!texto) return;

  const resultados = [];

  ejercicios.forEach(bloque => {
    const enunciadosFiltrados = bloque.enunciados.filter(ej =>
      (ej.texto && ej.texto.toLowerCase().includes(texto)) ||
      (ej.items && ej.items.join(" ").toLowerCase().includes(texto)) ||
      (ej.funciones && ej.funciones.join(" ").toLowerCase().includes(texto))
    );

    if (enunciadosFiltrados.length > 0) {
      resultados.push({
        ...bloque,
        enunciados: enunciadosFiltrados
      });
    }
  });

  renderizarEjercicios(resultados);
}

function renderizarEjercicios(data) {
  const container = document.getElementById("chat-container");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = `
      <div class="mensaje-inicial">
        No se encontraron ejercicios para esa búsqueda.
      </div>
    `;
    return;
  }

  data.forEach(bloque => {
    const titulo = document.createElement("h2");
    titulo.className = "titulo-seccion";
    titulo.textContent = `${bloque.titulo} (pág. ${bloque.pagina})`;
    container.appendChild(titulo);

    bloque.enunciados.forEach(ej => {
      const card = document.createElement("div");
      card.className = "ejercicio-card";

      if (ej.numero) {
        const h3 = document.createElement("h3");
        h3.textContent = `Ejercicio ${ej.numero}`;
        card.appendChild(h3);
      }

      if (ej.texto) {
        const p = document.createElement("p");
        p.textContent = ej.texto;
        card.appendChild(p);
      }

      if (ej.funciones) {
        ej.funciones.forEach(f => {
          const div = document.createElement("div");
          div.className = "latex-line";
          div.innerHTML = f;
          card.appendChild(div);
        });
      }

      if (ej.items) {
        const ul = document.createElement("ul");
        ej.items.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      container.appendChild(card);
    });
  });

  if (window.MathJax) {
    MathJax.typesetPromise();
  }
}


