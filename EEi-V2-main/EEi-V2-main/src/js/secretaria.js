// Dados para compromissos fictícios
const appointmentsData = {
    // Usando o formato 'dia/mês'
    "08/09": [
        "14:00: Reunião com a Diretoria",
        "15:30: Feira de Ciências",
        "17:00: Atendimento aos Pais"
    ],
    "09/09": [
        "09:00: Planejamento Pedagógico",
        "11:00: Treinamento de Professores"
    ],
    "10/09": [
        "08:00: Avaliação de Desempenho",
        "10:30: Entrega de Documentos"
    ],
    "11/09": [
        "14:00: Reunião com a Coordenação",
        "16:00: Encontro de Professores"
    ],
    "12/09": [
        "10:00: Apresentação de projeto",
        "14:00: Workshop de tecnologia"
    ],
    "13/09": [
        "09:30: Reunião de equipe",
        "15:00: Mentoria com alunos"
    ],
};

document.addEventListener('DOMContentLoaded', () => {
    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const currentMonthDisplay = document.getElementById('current-month-display');
    const calendarDaysContainer = document.getElementById('calendar-days-container');
    const currentDateHeader = document.getElementById('current-date-header');
    const appointmentsList = document.getElementById('appointments-list');

    // Funções de formatação de data
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    // Função principal para popular a lista de compromissos
    const updateAppointments = (date, dayElement) => {
        // Remove a classe 'active' de todos os dias
        document.querySelectorAll('.day-number.active').forEach(el => el.classList.remove('active'));
        // Adiciona a classe 'active' apenas ao dia clicado
        dayElement.classList.add('active');
        
        const formattedDate = formatDate(date);
        currentDateHeader.textContent = formattedDate;

        appointmentsList.innerHTML = '';
        const dailyAppointments = appointmentsData[formattedDate] || [];

        if (dailyAppointments.length > 0) {
            dailyAppointments.forEach(appointment => {
                const listItem = document.createElement('li');
                const [time, description] = appointment.split(': ');
                
                const timeSpan = document.createElement('span');
                timeSpan.textContent = `${time}:`;
                listItem.appendChild(timeSpan);
                
                const descriptionText = document.createTextNode(` ${description}`);
                listItem.appendChild(descriptionText);
                
                appointmentsList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Nenhum compromisso agendado para esta data.';
            appointmentsList.appendChild(listItem);
        }
    };

    // 1. Lógica do Calendário (Geração e Eventos)
    const today = new Date();
    const currentMonth = today.getMonth();

    currentMonthDisplay.textContent = `Mês ${currentMonth + 1}`;

    calendarDaysContainer.innerHTML = '';
    
    // Geração dos dias do calendário (hoje + 2 próximos dias)
    for (let i = 0; i < 3; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);

        const dayItem = document.createElement('div');
        dayItem.classList.add('day-item');

        const dayName = document.createElement('span');
        dayName.classList.add('day-name');
        dayName.textContent = dayNames[nextDay.getDay()];

        const dayNumber = document.createElement('span');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = nextDay.getDate();

        // Armazena a data completa no elemento, para facilitar o acesso
        dayNumber.dataset.fullDate = nextDay.toISOString();

        // Adiciona a classe 'active' para o dia atual e exibe seus compromissos
        if (i === 0) {
            dayNumber.classList.add('active');
            updateAppointments(nextDay, dayNumber);
        }

        // Adiciona o evento de clique a cada dia
        dayNumber.addEventListener('click', () => {
            const clickedDate = new Date(dayNumber.dataset.fullDate);
            updateAppointments(clickedDate, dayNumber);
        });

        dayItem.appendChild(dayName);
        dayItem.appendChild(dayNumber);
        calendarDaysContainer.appendChild(dayItem);
    }

    // Lógica da navegação (botões de nav-bar)
    const navLinks = document.querySelectorAll('.icon-sidebar ul li a');
    let activeLink = document.querySelector('.icon-sidebar ul li a.active');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (link !== activeLink) {
                activeLink.classList.remove('active');
                link.classList.add('hover-highlight');
            }
        });

        link.addEventListener('mouseleave', () => {
            activeLink.classList.add('active');
            link.classList.remove('hover-highlight');
        });

        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (activeLink) {
                activeLink.classList.remove('active');
            }
            link.classList.add('active');
            activeLink = link;
            link.classList.remove('hover-highlight');
        });
    });
});