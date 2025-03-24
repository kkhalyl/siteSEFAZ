const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Configuração do middleware
app.use(express.static(path.join(__dirname)));
app.use('/nt', express.static(path.join(__dirname, 'nt')));

// Rota principal
app.get('/notatecnica', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginas', 'notatecnica.html'));
});

// Rota da API para documentos
app.get('/api/notas-tecnicas', (req, res) => {
  const docsPath = path.join(__dirname, 'nt', 'nt_2025');
  
  fs.readdir(docsPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler documentos:', err);
      return res.status(500).json({ error: 'Erro ao carregar documentos' });
    }

    const documentos = files
      .filter(file => file.toLowerCase().endsWith('.pdf'))
      .map(file => ({
        nome: file.replace('.pdf', ''),
        arquivo: `/nt/nt_2025/${encodeURIComponent(file)}`
      }))
      .sort((a, b) => {
        // Ordena por número da nota técnica
        const numA = a.nome.match(/NOTA TÉCNICA (\d+)/)?.[1] || 0;
        const numB = b.nome.match(/NOTA TÉCNICA (\d+)/)?.[1] || 0;
        return numA - numB;
      });

    res.json(documentos);
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/notatecnica`);
});