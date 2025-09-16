console.log('1. Importando dependências...');
const express = require('express');
console.log('2. Express importado');

const app = express();
const PORT = process.env.PORT || 3000;
console.log('3. App criado, porta:', PORT);

app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

console.log('4. Rota criada');

app.listen(PORT, () => {
  console.log('5. Servidor iniciado na porta', PORT);
});

console.log('6. Listen chamado');
