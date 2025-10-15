document.addEventListener('DOMContentLoaded', () => {
  const endDate = new Date('2025-06-10T23:59:59');
  const timerElement = document.getElementById('timer');
  const rankCardsElement = document.getElementById('rank-cards');

  // Ranking inicial
  const ranking = [
      { sala: 'Berçario-A 🧤', total: 0 },
      { sala: 'Berçario-B ❄️', total: 0  },
      { sala: 'Educação Infantil-B ☃️', total: 0 },
      { sala: 'Educação Infantil-A 🧥', total: 0 },
      { sala: 'Berçario-C 👢', total: 0 },
      { sala: 'Educação Infantil-C 🧦', total: 0},
  ];

  // Atualiza o cronômetro
  function updateTimer() {
      const now = new Date();
      const timeLeft = endDate - now;

      if (timeLeft <= 0) {
          timerElement.textContent = 'A arrecadação terminou!';
          return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      timerElement.textContent = `${days} dias, ${hours}h, ${minutes}m, ${seconds}s`;
  }

  // Atualiza o ranking
  function updateRanking() {
      rankCardsElement.innerHTML = '';
      ranking
          .sort((a, b) => b.total - a.total)
          .forEach((item, index) => {
              const card = document.createElement('div');
              card.classList.add('rank-card');
              card.innerHTML = `
                  <div class="position">${index + 1}º</div>
                  <h3>${item.sala}</h3>
                  <p>${item.total} kg arrecadados</p>
              `;
              rankCardsElement.appendChild(card);
          });
  }

  // Simula doações
  function simulateDonations() {
      const randomIndex = Math.floor(Math.random() * ranking.length);
      ranking[randomIndex].total += Math.floor(Math.random() * 4 + 1);
  }

  // Atualiza ranking a cada 5 minutos (300.000 ms)
  setInterval(() => {
      simulateDonations();
      updateRanking();
  }, 70000); // 5 minutos

  setInterval(updateTimer, 1000); // Atualiza o cronômetro a cada segundo

  updateTimer();
  updateRanking();
});


  document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-control.prev');
    const nextButton = document.querySelector('.carousel-control.next');
    let currentIndex = 0;
    const totalItems = carouselItems.length;
  
    
    function updateCarousel(index) {
      const offset = -index * 100;
      carouselInner.style.transform = `translateX(${offset}%)`;
    }
  
    
    function nextImage() {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel(currentIndex);
    }
  
    
    function prevImage() {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel(currentIndex);
    }
  

    nextButton.addEventListener('click', nextImage);
    prevButton.addEventListener('click', prevImage);
  
    
    setInterval(nextImage, 3000);
  });
  
