console.log('Teste iniciando...');

const express = require('express');
console.log('Express carregado');

const app = express();
console.log('App criado');

const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});
console.log('Rota definida');

const server = app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT);
});

console.log('Servidor iniciado');
