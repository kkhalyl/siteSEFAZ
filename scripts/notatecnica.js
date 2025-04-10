document.addEventListener('DOMContentLoaded', async () => {
    const quadro = document.querySelector('.quadro');
    
    try {
        const response = await fetch('/api/notas-tecnicas');
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        
        const notasTecnicas = await response.json();
        
        if (!notasTecnicas || notasTecnicas.length === 0) {
            quadro.innerHTML = '<p class="sem-documentos">Nenhuma nota técnica encontrada.</p>';
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
        console.error('Erro ao carregar notas técnicas:', error);
        quadro.innerHTML = `
            <div class="erro-carregamento">
                Não foi possível carregar as notas técnicas. ${error.message}
            </div>
        `;
    }
});