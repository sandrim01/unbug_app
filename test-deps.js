console.log('1. Iniciando...');

console.log('2. Importando express...');
const express = require('express');

console.log('3. Importando cors...');
const cors = require('cors');

console.log('4. Importando helmet...');
const helmet = require('helmet');

console.log('5. Importando rateLimit...');
const rateLimit = require('express-rate-limit');

console.log('6. Importando pg...');
const { Pool } = require('pg');

console.log('7. Importando bcrypt...');
const bcrypt = require('bcryptjs');

console.log('8. Importando jwt...');
const jwt = require('jsonwebtoken');

console.log('9. Importando path...');
const path = require('path');

console.log('10. Importando uuid...');
const { v4: uuidv4 } = require('uuid');

console.log('11. Importando dotenv...');
require('dotenv').config();

console.log('12. Todas as dependências importadas com sucesso!');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Todas as deps OK!' });
});

app.listen(PORT, () => {
  console.log('Servidor funcionando na porta', PORT);
});
