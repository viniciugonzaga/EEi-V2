document.addEventListener('DOMContentLoaded', () => {

    // LÓGICA DO HAMBÚRGUER
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburgerButton && navMenu) {
        hamburgerButton.addEventListener('click', () => {
            hamburgerButton.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');

            if (navMenu.classList.contains('is-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburgerButton.classList.remove('is-active');
                navMenu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    // LÓGICA DO CARROSSEL ANIMADO
    const carouselContainer = document.getElementById('animated-carousel');
    if (carouselContainer) {
        const carouselTrack = carouselContainer.querySelector('.carousel-track');
        const slides = Array.from(carouselTrack.children);
        const totalSlides = slides.length;
        const imageUrls = slides.map(slide => slide.querySelector('img').src);

        const preloadImages = (urls) => {
            return new Promise(resolve => {
                const loadedImages = urls.map(url => {
                    return new Promise((res) => {
                        const img = new Image();
                        img.src = url;
                        img.onload = res;
                        img.onerror = res;
                    });
                });
                Promise.all(loadedImages).then(resolve);
            });
        };

        let currentSlideIndex = 0;

        const slideTo = (index) => {
            carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        };

        const nextSlide = () => {
            currentSlideIndex++;
            if (currentSlideIndex > totalSlides - 1) {
                carouselTrack.style.transform = `translateX(-${totalSlides * 100}%)`;
                setTimeout(() => {
                    carouselTrack.style.transition = 'none';
                    currentSlideIndex = 0;
                    carouselTrack.style.transform = `translateX(0)`;
                    setTimeout(() => {
                        carouselTrack.style.transition = 'transform 1.5s cubic-bezier(0.8, 0, 0.2, 1)';
                    }, 50);
                }, 1500);
            } else {
                slideTo(currentSlideIndex);
            }
        };

        preloadImages(imageUrls)
            .then(() => {
                const firstSlideClone = slides[0].cloneNode(true);
                carouselTrack.appendChild(firstSlideClone);
                setInterval(nextSlide, 5000);
            })
            .catch(error => {
                console.error('Erro ao pré-carregar imagens:', error);
                const firstSlideClone = slides[0].cloneNode(true);
                carouselTrack.appendChild(firstSlideClone);
                setInterval(nextSlide, 5000);
            });
    }

    // LÓGICA DOS CARDS PEDAGÓGICOS
    const pedagogicalCards = document.querySelectorAll('.pedagogical-card');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    pedagogicalCards.forEach(card => observer.observe(card));

    // LÓGICA DOS CARDS DE MATRÍCULA
    const matriculaCards = document.querySelectorAll('.matricula-card');
    if (matriculaCards.length > 0) {
        let currentIndex = 0;
        const intervalTime = 2500;

        function animateCard() {
            const currentCard = matriculaCards[currentIndex];
            const prevIndex = (currentIndex === 0) ? matriculaCards.length - 1 : currentIndex - 1;
            const prevCard = matriculaCards[prevIndex];
            
            prevCard.classList.remove('active-shake');
            prevCard.classList.remove('border-fill');
            currentCard.classList.add('active-shake');
            currentCard.classList.add('border-fill');

            currentIndex++;
            if (currentIndex >= matriculaCards.length) {
                currentIndex = 0;
            }
        }
        animateCard();
        setInterval(animateCard, intervalTime);
    }
    
    // LÓGICA DA ANIMAÇÃO DE PATINHAS
    const main = document.querySelector('main');
    const imagemPatinhas = document.querySelector('.trilha-patinhas');
    if (main && imagemPatinhas) {
        function animarPatinhas() {
            const mainLargura = main.offsetWidth;
            const mainAltura = main.offsetHeight;
            imagemPatinhas.style.display = 'block';
            const imagemLargura = imagemPatinhas.offsetWidth;
            const imagemAltura = imagemPatinhas.offsetHeight;
            const margemLargura = mainLargura * 0.2;
            const margemAltura = mainAltura * 0.2;
            const topAleatorio = Math.random() * (mainAltura - margemAltura * 2) + margemAltura;
            const leftAleatorio = Math.random() * (mainLargura - margemLargura * 2) + margemLargura;
            imagemPatinhas.style.top = `${topAleatorio}px`;
            imagemPatinhas.style.left = `${leftAleatorio}px`;
            imagemPatinhas.style.animation = 'none';
            imagemPatinhas.offsetHeight;
            imagemPatinhas.style.animation = null;
        }
        animarPatinhas();
        setInterval(animarPatinhas, 6000);
    }

    // LÓGICA DE MUDANÇA DE COR DA BORDA
    const navBar = document.querySelector('nav');
    const secoes = {
        pedagogica: document.querySelector('.pedagogical-section'),
        matricula: document.querySelector('.matricula-section'),
        alimentacao: document.querySelector('.alimentacao')
    };
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
                            case 'alimentacao':
                                novaCor = 'var(--cor-borda-alimentacao)';
                                break;
                        }
                        navBar.style.borderBottomColor = novaCor;
                    }
                }
            }
        }
    }
    window.addEventListener('scroll', mudarCorBorda);
    mudarCorBorda();

    // ----------------------------------------------------
    // CÓDIGO CARDÁPIO DINÂMICO
    // ----------------------------------------------------

    const days = {
        segunda: "Segunda-feira",
        terca: "Terça-feira",
        quarta: "Quarta-feira",
        quinta: "Quinta-feira",
        sexta: "Sexta-feira"
    };

    const meals = {
        manha: "Café da Manhã",
        almoco: "Almoço",
        tarde: "Lanche da Tarde"
    };

    let allCardapioData = {};

    async function carregarCardapio() {
        try {
            const response = await fetch(`/EEi-V2-main/EEi-V2-main/api/api.php/cardapio?nocache=${Date.now()}`, {
                cache: "no-store"
            });
            if (!response.ok) throw new Error("Erro ao carregar cardápio");

            allCardapioData = await response.json();

            // 🔄 Normaliza as chaves recebidas da API
            const mapRefeicoes = {
                cafe_manha: "manha",
                almoco: "almoco",
                lanche_tarde: "tarde",
                manha: "manha",
                tarde: "tarde"
            };

            for (const dia in allCardapioData) {
                if (!allCardapioData.hasOwnProperty(dia)) continue;

                const refeicoes = allCardapioData[dia];
                const normalizadas = {};

                for (const refKey in refeicoes) {
                    const novoNome = mapRefeicoes[refKey] || refKey;
                    normalizadas[novoNome] = refeicoes[refKey];
                }

                allCardapioData[dia] = normalizadas;
            }

            renderDayCards();
            addEventListenersCardapio();

        } catch (err) {
            console.error("Erro ao carregar cardápio:", err);
            const alimentacaoLista = document.getElementById("alimentacao-lista");
            alimentacaoLista.innerHTML = '<p>Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
        }
    }

    function renderDayCards() {
        const alimentacaoLista = document.getElementById("alimentacao-lista");
        alimentacaoLista.innerHTML = '';
        for (const dayKey in days) {
            const dayCardHTML = `
                <div class="alimentacao-item" data-dia="${dayKey}">
                    <span>${days[dayKey]}</span>
                    <span class="seta">⌄</span>
                </div>
            `;
            alimentacaoLista.insertAdjacentHTML('beforeend', dayCardHTML);
        }
    }

    function renderMealsModal(dayKey) {
        const modalId = `modal-refeicoes-${dayKey}`;
        let modal = document.getElementById(modalId);
        
        if (modal) modal.remove();

        const refeicoesOrdenadas = ['manha', 'almoco', 'tarde'];

        const mealsHTML = refeicoesOrdenadas.map((mealKey) => {
            const mealName = meals[mealKey];
            return `
                <div class="refeicao-card" data-dia="${dayKey}" data-refeicao="${mealKey}">
                    <h3>${mealName}</h3>
                </div>
            `;
        }).join('');
        
        const modalHTML = `
            <div id="${modalId}" class="modal-nutricional modal-refeicoes-dia">
                <div class="modal-content">
                    <span class="fechar">&times;</span>
                    <h2>Cardápio de ${days[dayKey]}</h2>
                    <div class="refeicao-card-container">
                        ${mealsHTML}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        modal.classList.add('is-visible');

        modal.querySelectorAll('.refeicao-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-card'); 
        });
    }

    function renderNutritionalModal(dayKey, mealKey) {
        const mealData = allCardapioData[dayKey][mealKey];
        if (!mealData || !mealData.opcoes) {
            console.error("Dados da refeição não encontrados.", dayKey, mealKey);
            return;
        }

        const modalId = `modal-nutri-${dayKey}-${mealKey}`;
        let modal = document.getElementById(modalId);

        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('is-visible');
            return;
        }

        const nutriContent = mealData.opcoes.slice(0, 4).map((opcao, index) => {
            const photoPath = opcao.photo ? `public/images/${opcao.photo}` : 'public/images/default-image.png';

            
            return `
                <div class="nutri-info-card">
                    <h4 class="nutri-info-card-title">Refeição ${index + 1}</h4>
                    <img src="${photoPath}" alt="${opcao.content}">
                    <h4>${opcao.content || "Sem nome"}</h4>
                    <p>${opcao.nutri || "Informação não disponível."}</p>
                </div>
            `;
        }).join('');

        const modalHTML = `
            <div id="${modalId}" class="modal-nutricional modal-nutri-detalhe">
                <div class="modal-content">
                    <span class="fechar">&times;</span>
                    <h2>${meals[mealKey]}</h2>
                    <div class="nutri-grid">
                        ${nutriContent}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById(modalId);
        modal.style.display = 'flex';
        modal.classList.add('is-visible');
    }

    function addEventListenersCardapio() {
        document.querySelectorAll('.alimentacao-item').forEach(item => {
            item.addEventListener('click', () => {
                const dayKey = item.getAttribute('data-dia');
                renderMealsModal(dayKey);
            });
        });

        document.addEventListener('click', (event) => {
            const refeicaoCard = event.target.closest('.refeicao-card');
            if (refeicaoCard) {
                const dayKey = refeicaoCard.getAttribute('data-dia');
                const mealKey = refeicaoCard.getAttribute('data-refeicao');
                renderNutritionalModal(dayKey, mealKey);

                const mealsModal = document.getElementById(`modal-refeicoes-${dayKey}`);
                if (mealsModal) {
                    mealsModal.style.display = 'none';
                    mealsModal.classList.remove('is-visible');
                }
            }
        });

        document.addEventListener('click', (event) => {
            const modalDetalhe = event.target.closest('.modal-nutri-detalhe');
            if (modalDetalhe && event.target.classList.contains('fechar')) {
                modalDetalhe.style.display = 'none';
                modalDetalhe.classList.remove('is-visible');

                const dayKey = modalDetalhe.id.split('-')[2];
                const mealsModal = document.getElementById(`modal-refeicoes-${dayKey}`);
                if (mealsModal) {
                    mealsModal.style.display = 'flex';
                    mealsModal.classList.add('is-visible');
                }
            }
            else if (event.target.classList.contains('modal-nutri-detalhe')) {
                event.target.style.display = 'none';
                event.target.classList.remove('is-visible');
            }

            const modalRefeicoes = event.target.closest('.modal-refeicoes-dia');
            if (modalRefeicoes && event.target.classList.contains('fechar')) {
                modalRefeicoes.style.display = 'none';
                modalRefeicoes.classList.remove('is-visible');
            }
        });
    }

    carregarCardapio();
});
