document.addEventListener('DOMContentLoaded', function() {
    // --- Rolagem Suave ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Lógica do Calendário e Agendamento ---
    const calendarEl = document.getElementById('calendar');
    const horariosListaEl = document.getElementById('horarios-lista');
    const modalEl = document.getElementById('agendamento-modal');
    const modalHorarioTextoEl = document.getElementById('modal-horario-selecionado');
    const formAgendamento = document.getElementById('form-agendamento');
    const closeModalBtn = document.querySelector('.modal-close-button');

    let dataSelecionada = null;
    let horarioSelecionado = null;

    const horariosDisponiveis = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: { left: 'prev', center: 'title', right: 'next' },
        selectable: true,
        validRange: { start: new Date().toISOString().split('T')[0] },
        
        // Função para habilitar/desabilitar dias
        selectAllow: function(selectInfo) {
            const isoDate = selectInfo.startStr;
            return diasDisponiveis.includes(isoDate);
        },

        // Estiliza os dias que não estão disponíveis
        dayCellDidMount: function(info) {
            const isoDate = info.date.toISOString().split('T')[0];
            if (!diasDisponiveis.includes(isoDate)) {
                info.el.classList.add('fc-day-disabled');
            }
        },

        dateClick: function(info) {
            const isoDate = info.dateStr;
            if (!diasDisponiveis.includes(isoDate)) {
                return; // Não faz nada se o dia não estiver disponível
            }

            dataSelecionada = isoDate;
            horariosListaEl.innerHTML = '';

            document.querySelectorAll('.fc-daygrid-day.selected-day').forEach(el => el.classList.remove('selected-day'));
            info.dayEl.classList.add('selected-day');

            horariosDisponiveis.forEach(horario => {
                const horarioBtn = document.createElement('button');
                horarioBtn.className = 'horario-button';
                horarioBtn.innerText = horario;
                horarioBtn.onclick = () => {
                    horarioSelecionado = horario;
                    const dataFormatada = new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR');
                    modalHorarioTextoEl.innerText = `${dataFormatada} às ${horarioSelecionado}`;
                    modalEl.style.display = 'flex';
                };
                horariosListaEl.appendChild(horarioBtn);
            });
        }
    });

    calendar.render();

    // --- Lógica do Modal ---
    closeModalBtn.addEventListener('click', () => {
        modalEl.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modalEl) {
            modalEl.style.display = 'none';
        }
    });

    formAgendamento.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('cliente-nome').value;
        const telefone = document.getElementById('cliente-telefone').value;
        const endereco = document.getElementById('cliente-endereco').value;

        if (dataSelecionada && horarioSelecionado && nome && telefone && endereco) {
            const dataFormatada = new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR');
            const textoWhatsapp = `*Novo Agendamento*
-------------------------
*Cliente:* ${nome}
*Telefone:* ${telefone}
*Endereço:* ${endereco}
*Horário:* ${dataFormatada} às ${horarioSelecionado}
-------------------------
`;
            const linkWhatsapp = `https://api.whatsapp.com/send?phone=SEUNUMERO&text=${encodeURIComponent(textoWhatsapp)}`;
            
            window.open(linkWhatsapp, '_blank');
            
            alert('Agendamento quase finalizado! Confirme a mensagem no WhatsApp.');
            modalEl.style.display = 'none';
            formAgendamento.reset();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    // --- Lógica do Menu Hamburguer ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link (para rolagem suave)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
