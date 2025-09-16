const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use(limiter);

// Rate limiting específico para chamados
const chamadosLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5 // máximo 5 chamados por IP
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas para servir páginas HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/chamados', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chamados.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API Routes

// Login do administrador
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    // Verificar senha (comparação simples para este exemplo)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo chamado
app.post('/api/chamados', chamadosLimiter, async (req, res) => {
  try {
    const { nome, email, telefone, empresa, tipo_problema, descricao, urgencia } = req.body;

    // Validação básica
    if (!nome || !email || !descricao) {
      return res.status(400).json({ error: 'Nome, email e descrição são obrigatórios' });
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

// Listar todos os chamados (admin apenas)
app.get('/api/admin/chamados', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM chamados ORDER BY data_criacao DESC`
    );

    res.json({
      success: true,
      chamados: result.rows
    });

  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do chamado (admin apenas)
app.patch('/api/admin/chamados/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacoes_admin } = req.body;

    const result = await pool.query(
      `UPDATE chamados 
       SET status = COALESCE($1, status), 
           observacoes_admin = COALESCE($2, observacoes_admin),
           data_atualizacao = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, observacoes_admin, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    res.json({
      success: true,
      chamado: result.rows[0],
      message: 'Chamado atualizado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar chamado (admin apenas)
app.delete('/api/admin/chamados/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM chamados WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    res.json({
      success: true,
      message: 'Chamado deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar chamado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas (admin apenas)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_chamados,
        COUNT(*) FILTER (WHERE status = 'aberto') as chamados_abertos,
        COUNT(*) FILTER (WHERE status = 'em_andamento') as chamados_em_andamento,
        COUNT(*) FILTER (WHERE status = 'resolvido') as chamados_resolvidos,
        COUNT(*) FILTER (WHERE status = 'fechado') as chamados_fechados
      FROM chamados
    `);

    res.json({
      success: true,
      stats: stats.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Unbug Solutions TI rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});

// Tratamento de shutdown graceful
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, finalizando servidor...');
  pool.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, finalizando servidor...');
  pool.end();
  process.exit(0);
});
