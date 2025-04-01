document.addEventListener('DOMContentLoaded', async () => {
    const quadro = document.querySelector('.quadro');
    const voltar = document.querySelector('.voltar');
    const voltarp = document.querySelector('.voltarp');

    let todosDocumentos = []; 

    try {
        const response = await fetch('/api/prevarrecad');
        if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
        
        todosDocumentos = await response.json();
        
        if (!todosDocumentos || todosDocumentos.length === 0) {
            quadro.innerHTML = '<p class="sem-documentos">Nenhuma previsão de arrecadação encontrada.</p>';
            return;
        }

        mostrarPastas(todosDocumentos);
        
    } catch (error) {
        console.error('Erro ao carregar previsão de arrecadação:', error);
        quadro.innerHTML = `
            <div class="erro-carregamento">
                Não foi possível carregar as previsões de arrecadação. ${error.message}
            </div>
        `;
    }

    // Função para mostrar as pastas/meses
    function mostrarPastas(documentos) {
        quadro.innerHTML = '';

        voltar.style.display = 'flex';
        voltarp.style.display = 'none';
        
    
        const mesesUnicos = [];
        const mesesVistos = new Set();
        
        documentos.forEach(nota => {
            if (!mesesVistos.has(nota.mesNum)) {
                mesesVistos.add(nota.mesNum);
                mesesUnicos.push({
                    mesNum: nota.mesNum,
                    mesNome: nota.mesNome
                });
            }
        });

        // Ordena os meses
        mesesUnicos.sort((a, b) => a.mesNum - b.mesNum);

        // Cria os itens das pastas
        mesesUnicos.forEach(mes => {
            const item = document.createElement('div');
            item.className = 'nota-item pasta-item';
            
            const link = document.createElement('div');
            link.textContent = mes.mesNome;
            link.className = 'nota-link';
            
            const icone = document.createElement('img');
            icone.className = 'nota-icone';
            icone.src = '/icon4.svg';
            icone.alt = 'Ícone de pasta';
            
            item.appendChild(icone);
            item.appendChild(link);
            quadro.appendChild(item);

            // Adiciona evento de clique para mostrar arquivos do mês
            item.addEventListener('click', () => {
                mostrarArquivosDoMes(mes.mesNum);
            });
        });
    }

    // Função para mostrar arquivos de um mês específico
    function mostrarArquivosDoMes(mesNum) {
        quadro.innerHTML = '';

        voltar.style.display = 'none';
        voltarp.style.display = 'flex';

        voltarp.addEventListener("click", function() {
            mostrarPastas(todosDocumentos)
        });

        // Filtra documentos do mês selecionado
        const documentosDoMes = todosDocumentos.filter(nota => nota.mesNum === mesNum);
        
        // Cria os itens dos arquivos
        documentosDoMes.forEach(nota => {
            const item = document.createElement('a');
            item.className = 'nota-item';
            item.href = nota.arquivo;
            item.target = '_blank';
            
            const link = document.createElement('div');
            link.textContent = nota.nome;
            link.className = 'nota-link';
            
            const icone = document.createElement('img');
            icone.className = 'nota-icone';
            icone.src = '/icon4.svg';
            icone.alt = 'Ícone de documento';
            
            item.appendChild(icone);
            item.appendChild(link);
            quadro.appendChild(item);
        });
    }
});