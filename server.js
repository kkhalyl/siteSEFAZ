const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname)));
app.use('/nt', express.static(path.join(__dirname, '2025', 'nt')));
app.use('/an', express.static(path.join(__dirname, '2025', 'an')));
app.use('/pr', express.static(path.join(__dirname, '2025', 'pr')));

app.get('/notatecnica', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'notatecnica.html'));
});

app.get('/analisearrecad', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'analisearrecad.html'));
});

app.get('/prevarrecad', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'prevarrecad.html'));
});

app.get('/api/notas-tecnicas', (req, res) => {
  const docsPath = path.join(__dirname, '2025', 'nt');
  
  fs.readdir(docsPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler documentos:', err);
      return res.status(500).json({ error: 'Erro ao carregar documentos' });
    }

    const documentos = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        nome: file.replace('.pdf', ''),
        arquivo: `/nt/${encodeURIComponent(file)}`
      }))
      .sort((a, b) => {
        const numA = a.nome.match(/NOTA TÉCNICA (\d+)/)?.[1] || 0;
        const numB = b.nome.match(/NOTA TÉCNICA (\d+)/)?.[1] || 0;
        return numA - numB;
      });

    res.json(documentos);
  });
});

app.get('/api/analisearrecad', (req, res) => {
  const docsPath = path.join(__dirname, '2025', 'an');
  
  fs.readdir(docsPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler documentos:', err);
      return res.status(500).json({ error: 'Erro ao carregar documentos' });
    }

    const documentos = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        nome: file.replace('.pdf', ''),
        arquivo: `/an/${encodeURIComponent(file)}`
      }))
      .sort((a, b) => {
        const matchA = a.nome.match(/(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro) (\d{4})/i);
        const matchB = b.nome.match(/(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro) (\d{4})/i);

        if (!matchA || !matchB) return 0;
        
        const meses = {
            'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
            'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
            'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
        };
        
        const mesA = meses[matchA[1].toLowerCase()];
        const anoA = parseInt(matchA[2]);
        const mesB = meses[matchB[1].toLowerCase()];
        const anoB = parseInt(matchB[2]);
        
        return anoA - anoB || mesA - mesB;
    });

    res.json(documentos);
  });
});

app.use('/pr', express.static(path.join(__dirname, '2025', 'pr')));

app.get('/api/prevarrecad', async (req, res) => {
  const basePath = path.join(__dirname, '2025', 'pr');
  
  try {
    // Lê todos os diretórios de meses
    const mesesDirs = (await fs.promises.readdir(basePath, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .sort((a, b) => {
        // Ordena por número do mês (1.Jan, 2.Fev, etc.)
        const numA = parseInt(a.name.split('.')[0]);
        const numB = parseInt(b.name.split('.')[0]);
        return numA - numB;
      });

    let documentos = [];

    // Para cada diretório de mês
    for (const mesDir of mesesDirs) {
      const mesPath = path.join(basePath, mesDir.name);
      const files = await fs.promises.readdir(mesPath);
      
      files.filter(file => /^\d{2}\.\d{2}\.\d{4}\.pdf$/i.test(file)) // Verifica o formato DD.MM.YYYY.pdf
        .forEach(file => {
          const [dia, mes, ano] = file.split('.');
          const dataObj = new Date(`${ano}-${mes}-${dia}`);
          const mesNome = mesDir.name.split('.')[1]; // Jan, Fev, etc.
          
          documentos.push({
            nome: `${dia}/${mes}/${ano}`, // Formata como DD/MM/YYYY
            nomeOriginal: file.replace('.pdf', ''),
            arquivo: `/pr/${mesDir.name}/${encodeURIComponent(file)}`,
            data: dataObj.toISOString(), // Data em formato ISO
            mesNum: parseInt(mes),
            mesNome,
            ano: parseInt(ano)
          });
        });
    }

    // Ordena por data (mais recente primeiro)
    documentos.sort((a, b) => new Date(b.data) - new Date(a.data));

    res.json(documentos);

  } catch (err) {
    console.error('Erro ao ler documentos:', err);
    res.status(500).json({ error: 'Erro ao carregar documentos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/notatecnica`);
});