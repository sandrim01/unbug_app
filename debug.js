console.log('Início do arquivo');

try {
  console.log('Importando express...');
  const express = require('express');
  console.log('Express OK');
  
  console.log('Criando app...');
  const app = express();
  console.log('App criado');
  
  console.log('Definindo porta...');
  const PORT = 3001;
  console.log('Porta definida:', PORT);
  
  console.log('Criando rota...');
  app.get('/', (req, res) => {
    res.json({ status: 'OK' });
  });
  console.log('Rota criada');
  
  console.log('Iniciando servidor...');
  app.listen(PORT, () => {
    console.log('Servidor rodando na porta', PORT);
  });
  console.log('Listen executado');
  
} catch (error) {
  console.error('ERRO:', error);
}
