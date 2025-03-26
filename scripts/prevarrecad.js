document.addEventListener('DOMContentLoaded', async () => {
    const quadro = document.querySelector('.quadro');
    
    try {
        const response = await fetch('/api/prevarrecad');
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        
        const notasTecnicas = await response.json();
        
        if (!notasTecnicas || notasTecnicas.length === 0) {
            quadro.innerHTML = '<p class="sem-documentos">Nenhuma previsão de arrecadação encontrada.</p>';
            return;
        }

        quadro.innerHTML = '';
        
        notasTecnicas.forEach(nota => {
            const item = document.createElement('a');
            item.className = 'nota-item';
            item.href = nota.arquivo
            
            const link = document.createElement('div');
            link.textContent = nota.nome;
            link.className = 'nota-link';
            link.target = '_blank';
            
            const icone = document.createElement('img');
            icone.className = 'nota-icone';
            icone.src = '/icon4.svg';
            icone.alt = 'Ícone de documento'
            
            item.appendChild(icone);
            item.appendChild(link);
            quadro.appendChild(item);
        });
        
    } catch (error) {
        console.error('Erro ao carregar previsão de arrecadação:', error);
        quadro.innerHTML = `
            <div class="erro-carregamento">
                Não foi possível carregar as previsões de arrecadação. ${error.message}
            </div>
        `;
    }
});