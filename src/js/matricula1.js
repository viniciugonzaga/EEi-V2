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
        let contador = 1;
        setInterval(() => {
            document.getElementById('imagem' + contador).checked = true;
            contador++;
            if (contador > 3) {
                contador = 1;
            }
        }, 3000); // Troca de imagem a cada 3 segundos

        document.addEventListener('DOMContentLoaded', () => {

    const carouselContainer = document.getElementById('animated-carousel');
    const carouselTrack = carouselContainer.querySelector('.carousel-track');
    const slides = Array.from(carouselTrack.children);
    const totalSlides = slides.length;
    
    // Lista de URLs das imagens para pré-carregamento
    const imageUrls = slides.map(slide => slide.querySelector('img').src);
    
    // Função para pré-carregar as imagens
    const preloadImages = (urls) => {
        return Promise.all(urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
            });
        }));
    };

    let currentSlideIndex = 0;

    const slideTo = (index) => {
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    };

    const nextSlide = () => {
        currentSlideIndex++;
        
        // Verifica se é o último slide para um loop suave
        if (currentSlideIndex > totalSlides - 1) {
            
            // Move para o slide extra clonado com transição
            carouselTrack.style.transform = `translateX(-${totalSlides * 100}%)`;
            
            // Após a transição, reseta instantaneamente para o primeiro slide
            setTimeout(() => {
                carouselTrack.style.transition = 'none';
                currentSlideIndex = 0;
                carouselTrack.style.transform = `translateX(0)`;
                
                // Restaura a transição para a próxima animação
                setTimeout(() => {
                    carouselTrack.style.transition = 'transform 1.5s cubic-bezier(0.8, 0, 0.2, 1)';
                }, 50);
                
            }, 1500); // O tempo do setTimeout deve ser igual à duração da transição
        } else {
            slideTo(currentSlideIndex);
        }
    };
    
    // 1. Pré-carrega as imagens antes de iniciar o carrossel
    preloadImages(imageUrls)
        .then(() => {
            console.log('Todas as imagens foram pré-carregadas!');
            // 2. Clona o primeiro slide e adiciona ao final para o loop suave
            const firstSlideClone = slides[0].cloneNode(true);
            carouselTrack.appendChild(firstSlideClone);

            // 3. Inicia o carrossel automático
            setInterval(nextSlide, 5000); 
        })
        .catch(error => {
            console.error('Erro ao pré-carregar imagens:', error);
            // Inicia o carrossel mesmo com erro para não travar a página
            const firstSlideClone = slides[0].cloneNode(true);
            carouselTrack.appendChild(firstSlideClone);
            setInterval(nextSlide, 5000); 
        });
});

(() => {
  /* ---------- Utils ---------- */
  const $ = sel => Array.from(document.querySelectorAll(sel));
  const one = sel => document.querySelector(sel);

  /* ---------- Entrance observer ---------- */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in-view');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.fade-up, .bercario-card, .atividade-card, .process-step').forEach(el=> io.observe(el));

  /* ---------- Atividades sequential zoom (JS controlled) ---------- */
  const atividadeCards = $('.atividade-card');
  let seqIndex = 0;
  let seqTimer = null;
  const seqDelay = 1600; // tempo entre animações

  function startSequence(){
    stopSequence();
    seqTimer = setInterval(() => {
      // remove classes
      atividadeCards.forEach(c => c.classList.remove('zooming'));
      // add to current
      atividadeCards[seqIndex].classList.add('zooming');
      seqIndex = (seqIndex + 1) % atividadeCards.length;
    }, seqDelay);
  }
  function stopSequence(){
    if(seqTimer){ clearInterval(seqTimer); seqTimer = null; }
    atividadeCards.forEach(c => c.classList.remove('zooming'));
  }

  // pause on hover/focus
  atividadeCards.forEach(c => {
    c.addEventListener('mouseenter', stopSequence);
    c.addEventListener('mouseleave', () => { if(!seqTimer) startSequence(); });
    c.addEventListener('focusin', stopSequence);
    c.addEventListener('focusout', () => { if(!seqTimer) startSequence(); });
  });

  if(atividadeCards.length) startSequence();

  /* ---------- CAROUSEL center/swap logic ---------- */
  // markup expects .carousel-container > .carousel-item*
  const carouselContainers = document.querySelectorAll('.carousel-container');
  carouselContainers.forEach(container => {
    const items = Array.from(container.children);
    if(items.length < 1) return;
    // set center index initially to middle
    let centerIdx = Math.floor(items.length / 2);

    // helper to apply classes
    function render(){
      items.forEach((it, i) => {
        it.classList.remove('center','small');
        if(i === centerIdx) it.classList.add('center');
        else it.classList.add('small');
      });
    }

    // click on any item -> swap with center (animated)
    items.forEach((it, idx) => it.addEventListener('click', () => {
      if(idx === centerIdx) return;
      // swap DOM nodes so visual order updates naturally
      const centerNode = items[centerIdx];
      const clickedNode = items[idx];
      // swap positions in container
      if(idx < centerIdx){
        container.insertBefore(centerNode, clickedNode);
        container.insertBefore(clickedNode, items[centerIdx+1] || null);
      } else {
        container.insertBefore(clickedNode, centerNode);
      }
      // requery items and recalc center index
      const newItems = Array.from(container.children);
      // set center to new middle position:
      centerIdx = Math.floor(newItems.length / 2);
      // update items[] reference
      items.length = 0; newItems.forEach(n=> items.push(n));
      // small timeout to let DOM reflow then animate classes
      setTimeout(render, 30);
    }));

    render();
  });

  /* ---------- Micro tilt effect for carousel images ---------- */
  function addTilt(imgSel){
    document.querySelectorAll(imgSel).forEach(img => {
      img.addEventListener('mousemove', e => {
        const rect = img.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width/2;
        const y = (e.clientY - rect.top) - rect.height/2;
        img.style.transform = `perspective(800px) rotateY(${x/40}deg) rotateX(${ - y/60 }deg) scale(1.02)`;
      });
      img.addEventListener('mouseleave', ()=> img.style.transform = '');
    });
  }
  addTilt('.carousel-item img');

  /* ---------- Accessibility: pause animations if user prefers reduced motion ---------- */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    stopSequence();
  }

})();


// Espera o documento ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona a barra de navegação
    const navBar = document.querySelector('nav');

    // 2. Seleciona todas as seções relevantes com classes específicas
    const secoes = {
        pedagogica: document.querySelector('.pedagogical-section'),
        matricula: document.querySelector('.matricula-section.matricula--verde'),
        atividades: document.querySelector('.matricula-section.matricula--rosa')
    };

    // 3. Função para mudar a cor da borda da nav bar
    function mudarCorBorda() {
        const scrollPosicao = window.scrollY;

        for (const chave in secoes) {
            if (secoes.hasOwnProperty(chave)) {
                const secao = secoes[chave];
                if (secao) {
                    const pontoDeAtivacao = secao.offsetTop - (window.innerHeight * 0.25);

                    if (scrollPosicao >= pontoDeAtivacao) {
                        let novaCor = '';
                        switch (chave) {
                            case 'pedagogica':
                                novaCor = 'var(--cor-borda-pedagogica)';
                                break;
                            case 'matricula':
                                novaCor = 'var(--cor-borda-matricula)';
                                break;
                            case 'atividades':
                                novaCor = 'var(--cor-borda-alimentacao)';
                                break;
                        }
                        navBar.style.borderBottomColor = novaCor;
                    }
                }
            }
        }
    }

    // 4. Escuta o scroll
    window.addEventListener('scroll', mudarCorBorda);

    // 5. Executa logo de início
    mudarCorBorda();
});
