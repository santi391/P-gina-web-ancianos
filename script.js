// MI PRIMER NEGOCIO - JavaScript
"use strict";

// Navegación entre secciones
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(button => button.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (!page) return;
  page.classList.add("active");
  const navButton = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (navButton) navButton.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});
document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});
document.querySelectorAll(".brand[data-page]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

// Ideas de negocio
const businessIdeas = {
  cocina: [
    ["Venta de postres caseros", "Prepara gelatinas, queques o arroz con leche."],
    ["Comida preparada", "Ofrece almuerzos o platos tradicionales por encargo."],
    ["Bocaditos para reuniones", "Prepara pequeños aperitivos para celebraciones."]
  ],
  manualidades: [
    ["Tejidos hechos a mano", "Elabora bufandas, gorros, prendas o accesorios."],
    ["Regalos personalizados", "Crea detalles para cumpleaños y ocasiones especiales."],
    ["Decoraciones artesanales", "Diseña adornos para hogares y eventos."]
  ],
  plantas: [
    ["Venta de plantas", "Cultiva y vende plantas ornamentales."],
    ["Macetas decoradas", "Decora macetas y ofrece pequeños arreglos."],
    ["Jardinería", "Ofrece ayuda para cuidar jardines y plantas."]
  ],
  servicios: [
    ["Arreglos de ropa", "Ofrece servicios sencillos de costura."],
    ["Apoyo en el hogar", "Ofrece servicios domésticos según tus habilidades."],
    ["Clases o asesorías", "Comparte tus conocimientos y experiencia."]
  ]
};

document.getElementById("recommendBtn").addEventListener("click", () => {
  const ideas = businessIdeas[document.getElementById("skill").value] || [];
  const container = document.getElementById("ideas");
  container.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = "Ideas que podrías explorar";
  container.appendChild(heading);
  ideas.forEach(([name, description], index) => {
    const card = document.createElement("article");
    card.className = "idea-item";
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${name}`;
    const text = document.createElement("p");
    text.textContent = description;
    card.append(title, text);
    container.appendChild(card);
  });
  const advice = document.createElement("p");
  advice.className = "small-note";
  advice.textContent = "Consejo: conversa con posibles clientes y revisa qué recursos tienes antes de invertir.";
  container.appendChild(advice);
});

// Calculadora de precio
document.getElementById("calculateBtn").addEventListener("click", () => {
  const name = document.getElementById("productName").value.trim();
  const costInput = document.getElementById("cost").value;
  const profitInput = document.getElementById("profit").value;
  const cost = Number(costInput);
  const profit = Number(profitInput);
  const result = document.getElementById("calculationResult");

  if (!name || costInput === "" || profitInput === "" ||
      !Number.isFinite(cost) || !Number.isFinite(profit) || cost < 0 || profit < 0) {
    result.textContent = "Completa todos los campos con cantidades válidas (cero o más).";
    return;
  }
  const price = cost + profit;
  result.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = `Resultado para ${name}`;
  const detail = document.createElement("p");
  detail.textContent = `Costo: S/ ${cost.toFixed(2)} · Ganancia deseada: S/ ${profit.toFixed(2)}`;
  const total = document.createElement("strong");
  total.textContent = `Precio sugerido: S/ ${price.toFixed(2)}`;
  result.append(title, detail, total);
});

// Registro de ingresos y gastos con almacenamiento local
const STORAGE_KEY = "miPrimerNegocioMovements";
let movements = [];
try {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (Array.isArray(stored)) movements = stored.filter(item =>
    item && (item.type === "income" || item.type === "expense") &&
    typeof item.description === "string" &&
    Number.isFinite(item.amount) && item.amount > 0
  );
} catch (error) {
  movements = [];
}

function saveMovements() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
    return true;
  } catch (error) {
    document.getElementById("movementMessage").textContent =
      "No se pudieron guardar los datos en este navegador.";
    return false;
  }
}

function updateMoney() {
  const income = movements.filter(item => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = movements.filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  document.getElementById("totalIncome").textContent = `S/ ${income.toFixed(2)}`;
  document.getElementById("totalExpense").textContent = `S/ ${expense.toFixed(2)}`;
  document.getElementById("balance").textContent = `S/ ${(income - expense).toFixed(2)}`;

  const list = document.getElementById("movementList");
  list.replaceChildren();
  if (movements.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Todavía no hay movimientos registrados.";
    list.appendChild(empty);
    return;
  }
  movements.slice().reverse().forEach(item => {
    const row = document.createElement("div");
    row.className = "movement-item";
    const info = document.createElement("div");
    const description = document.createElement("strong");
    description.textContent = item.description;
    const type = document.createElement("small");
    type.textContent = item.type === "income" ? "Ingreso / venta" : "Gasto / compra";
    info.append(description, type);
    const amount = document.createElement("span");
    amount.className = item.type === "income" ? "income-value" : "expense-value";
    amount.textContent = `${item.type === "income" ? "+" : "−"} S/ ${item.amount.toFixed(2)}`;
    row.append(info, amount);
    list.appendChild(row);
  });
}

document.getElementById("addMovementBtn").addEventListener("click", () => {
  const type = document.getElementById("movementType").value;
  const description = document.getElementById("movementDescription").value.trim();
  const amountRaw = document.getElementById("movementAmount").value;
  const amount = Number(amountRaw);
  const message = document.getElementById("movementMessage");

  if (!description || amountRaw === "" || !Number.isFinite(amount) || amount <= 0) {
    message.textContent = "Escribe una descripción y una cantidad mayor que cero.";
    return;
  }
  movements.push({ type, description, amount, date: new Date().toLocaleDateString("es-PE") });
  saveMovements();
  updateMoney();
  document.getElementById("movementDescription").value = "";
  document.getElementById("movementAmount").value = "";
  message.textContent = "Movimiento registrado correctamente.";
});

document.getElementById("clearMovementsBtn").addEventListener("click", () => {
  if (!movements.length) {
    document.getElementById("movementMessage").textContent = "No hay registros que borrar.";
    return;
  }
  if (!window.confirm("¿Seguro que deseas borrar todos los movimientos guardados en este dispositivo?")) return;
  movements = [];
  saveMovements();
  updateMoney();
  document.getElementById("movementMessage").textContent = "Se borraron los movimientos.";
});

// Lectura en voz alta
document.getElementById("voiceBtn").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    window.alert("Este navegador no admite lectura por voz.");
    return;
  }
  const activePage = document.querySelector(".page.active");
  if (!activePage) return;
  window.speechSynthesis.cancel();
  const speech = new SpeechSynthesisUtterance(activePage.innerText);
  speech.lang = "es-ES";
  speech.rate = 0.9;
  window.speechSynthesis.speak(speech);
});

// Texto grande
document.getElementById("fontBtn").addEventListener("click", () => {
  const enabled = document.body.classList.toggle("large-text");
  document.getElementById("fontBtn").textContent = enabled ? "A−" : "A+";
});

updateMoney();
showPage("home");
