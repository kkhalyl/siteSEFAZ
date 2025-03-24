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

        quadro.innerHTML = ''; // Limpa o quadro
        
        notasTecnicas.forEach(nota => {
            const item = document.createElement('div');
            item.className = 'nota-item';
            
            const link = document.createElement('a');
            link.href = nota.arquivo;
            link.textContent = nota.nome;
            link.className = 'nota-link';
            link.target = '_blank';
            
            const icone = document.createElement('span');
            icone.className = 'nota-icone';
            icone.innerHTML = '📄';
            
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