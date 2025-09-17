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
