// Função para abrir o modal do aluno e definir as informações
function mostrarAluno(nome, idade, descricao, foto) {
    document.getElementById("alunoNome").textContent = nome;
    document.getElementById("alunoIdade").textContent = `Idade: ${idade}`;
    document.getElementById("alunoDescricao").textContent = descricao;
    document.getElementById("alunoFoto").src = foto;
    document.getElementById("modalAluno").style.display = "block";
}

// Função para fechar o modal do aluno
function fecharModal1() {
    document.getElementById("modalAluno").style.display = "none";
}

// Função para abrir o modal de alerta dentro do modal do aluno
function abrirModalAlerta(titulo, problemas) {
    document.getElementById("alertaTitulo").textContent = titulo;
    const problemasLista = document.getElementById("alertaProblemas");
    problemasLista.innerHTML = ""; // Limpa a lista de problemas

    problemas.forEach(problema => {
        const listItem = document.createElement("li");
        listItem.textContent = problema;
        problemasLista.appendChild(listItem);
    });

    document.getElementById("modalAlerta").style.display = "block";
}

// Função para fechar o modal de alerta
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}


function mostrarAluno(nome, idade, descricao, foto) {
    document.getElementById("alunoNome").innerText = "Nome: " + nome;
    document.getElementById("alunoIdade").innerText = "Idade: " + idade;
    document.getElementById("alunoDescricao").innerText = "Descrição: " + descricao;
    document.getElementById("alunoFoto").src = foto;

    // Verifique se o aluno é a Mariana para mostrar o alerta
    if (nome === "Maria Luisa" || nome== "Felipe Oliveira") {
        document.querySelector(".botao").style.display = "block";  // Exibe o botão de alerta para a Mariana
    } else {
        document.querySelector(".botao").style.display = "none";  // Esconde o botão de alerta para outros alunos
    }

    document.getElementById("modalAluno").style.display = "block";
}

function fecharModal1() {
    document.getElementById("modalAluno").style.display = "none";
}

// Função para abrir o modal de alerta
function abrirModalAlerta(titulo, problemas) {
    document.getElementById("alertaTitulo").innerText = titulo;
    const listaProblemas = document.getElementById("alertaProblemas");
    listaProblemas.innerHTML = "";  // Limpa a lista antes de adicionar novos itens

    // Adiciona os problemas à lista
    problemas.forEach(function(problema) {
        const item = document.createElement("li");
        item.innerText = problema;
        listaProblemas.appendChild(item);
    });

    document.getElementById("modalAlerta").style.display = "block";
}

// Função para fechar o modal de alerta
function fecharModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}






