document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".login-card");
  let current = 0;
  let autoRotate = true; 
  let interval;

  function updateCards() {
    cards.forEach((card, index) => {
      card.classList.remove("central", "left", "right");

      if (index === current) {
        card.classList.add("central");
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

  // Clicar em qualquer card -> vira central
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      current = index;
      updateCards();
    });

    // Quando usuário digitar algo em input -> parar rotação
    card.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        if (card.classList.contains("central")) {
          stopRotation();
        }
      });
    });
  });

  // Inicia
  updateCards();
  startRotation();
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".login-card");
  const nav = document.querySelector("nav");
  let current = 0;
  let autoRotate = true; 
  let interval;

  // Mapeamento de cores por classe
  const cardColors = {
    professor: "#00B5FF",
    responsavel: "#FF4C97",
    secretario: "#2bc055"
  };

  function updateCards() {
    cards.forEach((card, index) => {
      card.classList.remove("central", "left", "right");

      if (index === current) {
        card.classList.add("central");

        // Pega a classe do card central e troca cor da navbar
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

  // Clique em qualquer card -> vira central
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      current = index;
      updateCards();
    });

    // Quando usuário digitar algo em input -> parar rotação
    card.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", () => {
        if (card.classList.contains("central")) {
          stopRotation();
        }
      });
    });
  });

  // Inicia
  updateCards();
  startRotation();
});
// Função para abrir o modal
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = "block";

    // Adiciona a classe que desativa a rolagem do body
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = "none";

    // Remove a classe e restaura a rolagem do body
    document.body.style.overflow = '';
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
            // Restaura a rolagem do body ao fechar o modal
            document.body.style.overflow = '';
        }
    });
}
 // NOVO CÓDIGO PARA O HAMBÚRGUER
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');

            // Previne o scroll da página quando o menu está aberto
            if (navMenu.classList.contains('is-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = ''; // Restaura o scroll
            }
        });

        // Fechar o menu ao clicar em um link (opcional, mas boa prática)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('is-active');
                navMenu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
}