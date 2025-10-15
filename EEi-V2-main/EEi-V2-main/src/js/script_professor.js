document.addEventListener("DOMContentLoaded", () => {
    

    const { professor, turma } = professorData;

    // Atualizar banner de boas-vindas
    document.querySelector(".welcome-banner h2").textContent = `Professor ${professor.nome}`;
    document.querySelector(".welcome-banner p").textContent = `Turma: ${turma ? turma.nome : "Sem turma atribuída"}`;

    // Atualizar card "Meu Perfil"
    const profileInfo = document.querySelector(".profile-info");
    if (profileInfo) {
        profileInfo.querySelector("h5").textContent = professor.nome;
        profileInfo.querySelector("p").textContent = `Código: ${professor.codigo}`;
    }

    const profileStats = document.querySelectorAll(".profile-stats .stat-item strong");
    if (profileStats.length >= 3) {
        profileStats[0].textContent = professor.turno || "-";
        profileStats[1].textContent = professor.idade ? `${professor.idade} anos` : "-";
        profileStats[2].textContent = professor.status || "Ativo";
    }

    // Atualizar estatísticas fictícias da turma
    const alunosCard = document.querySelector(".card-alunos h3");
    if (alunosCard) {
        alunosCard.innerHTML = `${turma ? turma.total_alunos : 0} <small>alunos</small>`;
    }

    console.log("Dashboard carregado com dados:", professorData);
});
