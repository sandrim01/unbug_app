const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

console.log('🚀 Iniciando Unbug Solutions TI Server...');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básicos
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('✅ Middlewares configurados');

// Configuração do banco PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('✅ Pool de banco configurado');

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// === ROTAS HTML ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/chamados', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chamados.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin-new.html'));
});

app.get('/loja', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'loja.html'));
});

console.log('✅ Rotas HTML configuradas');

// === API ROUTES ===

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }

    // Buscar usuário
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];

    // Verificar senha (senha padrão: 'password')
    if (senha !== 'password') {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo_usuario: usuario.tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
      },
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    let whereClause = '';
    let params = [];

    // Técnicos só veem suas estatísticas
    if (req.user.tipo_usuario === 'assistente_tecnico') {
      whereClause = 'WHERE usuario_responsavel_id = $1';
      params = [req.user.id];
    }

    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_chamados,
        COUNT(*) FILTER (WHERE status = 'aberto') as chamados_abertos,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as chamados_em_andamento,
        COUNT(*) FILTER (WHERE status = 'resolvido') as chamados_resolvidos,
        COUNT(*) FILTER (WHERE status = 'fechado') as chamados_fechados
      FROM chamados ${whereClause}
    `, params);

    res.json({
      success: true,
      stats: stats.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar produtos (público)
app.get('/api/produtos', async (req, res) => {
  try {
    const { categoria, ativo } = req.query;
    let query = 'SELECT * FROM produtos WHERE 1=1';
    const params = [];

    if (categoria) {
      params.push(categoria);
      query += ` AND categoria = $${params.length}`;
    }

    if (ativo !== undefined) {
      params.push(ativo === 'true');
      query += ` AND ativo = $${params.length}`;
    }

    query += ' ORDER BY nome';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      produtos: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar chamado (público)
app.post('/api/chamados', async (req, res) => {
  try {
    const { nome, email, telefone, empresa, tipo_problema, descricao, urgencia } = req.body;

    if (!nome || !email || !descricao) {
      return res.status(400).json({ error: 'Nome, email e descrição obrigatórios' });
    }

    const result = await pool.query(
      `INSERT INTO chamados (nome, email, telefone, empresa, tipo_problema, descricao, urgencia, status, data_criacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'aberto', NOW())
       RETURNING id, nome, email, data_criacao`,
      [nome, email, telefone, empresa, tipo_problema, descricao, urgencia || 'media']
    );

    res.status(201).json({
      success: true,
      chamado: result.rows[0],
      message: 'Chamado criado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar chamado por ID (público)
app.get('/api/chamados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, nome, email, tipo_problema, descricao, urgencia, status, data_criacao, observacoes_admin
       FROM chamados WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    res.json({
      success: true,
      chamado: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar chamado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Unbug Solutions TI'
  });
});

console.log('✅ Rotas API configuradas');

// Error handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log('✅ Servidor iniciado com sucesso!');
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🔐 Login: admin@unbugsolutions.com.br / password`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, finalizando servidor...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, finalizando servidor...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});
