document.addEventListener('DOMContentLoaded', () => {
    const menuForm = document.getElementById('menu-form');

    // Função para carregar o cardápio do servidor
    async function loadMenu() {
        try {
            const response = await fetch('../../api/api.php?action=cardapio');
            if (!response.ok) {
                throw new Error('Erro ao carregar o cardápio');
            }
            const cardapio = await response.json();
            
            for (const dia in cardapio) {
                for (const refeicao in cardapio[dia]) {
                    cardapio[dia][refeicao].opcoes.forEach((opcao, index) => {
                        document.querySelector(`[name="${dia}-${refeicao}-op${index + 1}"]`).value = opcao.content || '';
                        document.querySelector(`[name="${dia}-${refeicao}-foto${index + 1}"]`).value = opcao.photo || '';
                        document.querySelector(`[name="${dia}-${refeicao}-nutri${index + 1}"]`).value = opcao.nutri || '';
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar o cardápio:', error);
            alert('Não foi possível carregar o cardápio.');
        }
    }

    // Função para salvar o cardápio
    menuForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(menuForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('../../api/api.php?action=cardapio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            const result = await response.json();
            alert(result.message);
            
            // CORREÇÃO: Redireciona para o index.html na raiz do projeto
            window.location.href = '/EEi-V2-main/EEi-V2-main/index.html'; 
            
        } catch (error) {
            console.error('Erro ao salvar o cardápio:', error);
            alert(`Erro: ${error.message}`);
        }
    });
});