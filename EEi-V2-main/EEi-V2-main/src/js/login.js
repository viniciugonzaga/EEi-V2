document.addEventListener("DOMContentLoaded", () => {
 // ----------------- ANIMAÇÃO DOS CARDS -----------------
 const cards = document.querySelectorAll(".login-card");
 const nav = document.querySelector("nav");
 let current = 0;
 let autoRotate = true;
 let interval;

 const cardColors = {
 professor: "#00B5FF",
 responsavel: "#FF4C97",
 secretario: "#2bc055",
 };

 function updateCards() {
 cards.forEach((card, index) => {
 card.classList.remove("central", "left", "right");

 if (index === current) {
 card.classList.add("central");
 for (const key in cardColors) {
 if (card.classList.contains(key)) {
 nav.style.borderBottomColor = cardColors[key];
}
}
 } else if (index === (current + 1) % cards.length) {
 card.classList.add("right");
} else if (index === (current + cards.length - 1) % cards.length) {
 card.classList.add("left");
 }
 });
 }

 function nextCard() {
 if (autoRotate) {
 current = (current + 1) % cards.length;
updateCards();
 }
}

 function startRotation() {
 interval = setInterval(nextCard, 10000);
 }

 function stopRotation() {
 autoRotate = false;
 clearInterval(interval);
 }

 cards.forEach((card, index) => {
 card.addEventListener("click", () => {
 current = index;
 updateCards();
 });

 card.querySelectorAll("input").forEach((input) => {
input.addEventListener("input", () => {
if (card.classList.contains("central")) {
 stopRotation();
 }
 });
});
 });

 updateCards();
 startRotation();

// ----------------- LOGIN PROFESSOR -----------------
 const formProfessor = document.getElementById("login-form-professor");
 if (formProfessor) {
 formProfessor.addEventListener("submit", async (e) => {
 e.preventDefault();

const formData = new FormData(formProfessor);
try {
 // CORRIGIDO: Adicionado o aninhamento duplo para o Professor
 const response = await fetch("/EEi-V2-main/EEi-V2-main/api/login_professor.php", { 
 method: "POST",
 body: formData,
 });
 const result = await response.json();

if (result.success) {
window.location.href = "/src/html/dashboard-professor.html";
 } else {
formProfessor.querySelector(".error-message").textContent =
result.message;
}
} catch (err) {
 formProfessor.querySelector(".error-message").textContent = 
"Erro ao conectar com o servidor.";
} 
 });
 }

// ----------------- LOGIN SECRETÁRIO -----------------
const formSecretario = document.getElementById("login-form-secretario");
if (formSecretario) {
formSecretario.addEventListener("submit", async (e) => {
e.preventDefault();

const formData = new FormData(formSecretario);
try {
 // CAMINHO CORRETO (Aninhamento duplo + underscore)
// O ÚLTIMO RECURSO: Caminho relativo sem a barra inicial (Funciona melhor com aninhamento)
const response = await fetch("/EEi-V2-main/EEi-V2-main/api/login_secretario.php", {
    method: "POST",
    body: formData,
});

const result = await response.json();

if (result.success) {
window.location.href = "/src/html/index_secretaria.html";
} else {
 // CORREÇÃO: Usa o seletor de classe dentro do formulário
formSecretario.querySelector(".error-message").textContent = result.message;
}
} catch (err) {
 // CORREÇÃO: Usa o seletor de classe dentro do formulário
formSecretario.querySelector(".error-message").textContent =
 "Erro ao conectar com o servidor.";
}
});
}
});