console.log('📝 Iniciando servidor Unbug Solutions TI...');

const express = require('express');
console.log('✅ Express carregado');

const cors = require('cors');
console.log('✅ CORS carregado');

const helmet = require('helmet');
console.log('✅ Helmet carregado');

const rateLimit = require('express-rate-limit');
console.log('✅ Rate limit carregado');

const { Pool } = require('pg');
console.log('✅ PostgreSQL carregado');

const bcrypt = require('bcryptjs');
console.log('✅ BCrypt carregado');

const jwt = require('jsonwebtoken');
console.log('✅ JWT carregado');

const path = require('path');
console.log('✅ Path carregado');

const { v4: uuidv4 } = require('uuid');
console.log('✅ UUID carregado');

require('dotenv').config();
console.log('✅ DotEnv configurado');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔗 Conectando ao banco de dados...');

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log('✅ Pool do banco criado');

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

// Middleware para verificar se é administrador
const requireAdmin = (req, res, next) => {
  if (req.user.tipo_usuario !== 'administrador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Função para gerar próximo número de OS
async function gerarProximoNumeroOS() {
  const year = new Date().getFullYear();
  const result = await pool.query(
    'SELECT COUNT(*) FROM ordens_servico WHERE numero_os LIKE $1',
    [`OS${year}%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `OS${year}${count.toString().padStart(3, '0')}`;
}

// Função para gerar próximo número de venda
async function gerarProximoNumeroVenda() {
  const year = new Date().getFullYear();
  const result = await pool.query(
    'SELECT COUNT(*) FROM vendas WHERE numero_venda LIKE $1',
    [`VD${year}%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `VD${year}${count.toString().padStart(3, '0')}`;
}

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

app.get('/loja', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'loja.html'));
});

// === API ROUTES ===

// Login do sistema (admin e técnicos)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário no banco
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];

    // Verificar senha (para este exemplo, usando senha simples 'password')
    // Em produção, usar bcrypt.compare(senha, usuario.senha)
    if (senha !== 'password') {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
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

// === ROTAS DE USUÁRIOS ===

// Listar usuários (apenas admin)
app.get('/api/usuarios', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, tipo_usuario, telefone, cpf, data_admissao, salario, ativo FROM usuarios ORDER BY nome'
    );

    res.json({
      success: true,
      usuarios: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar usuário (apenas admin)
app.post('/api/usuarios', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nome, email, tipo_usuario, telefone, cpf, data_admissao, salario } = req.body;

    // Validação básica
    if (!nome || !email || !tipo_usuario) {
      return res.status(400).json({ error: 'Nome, email e tipo de usuário são obrigatórios' });
    }

    // Hash da senha padrão
    const senhaHash = await bcrypt.hash('password', 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, cpf, data_admissao, salario)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nome, email, tipo_usuario`,
      [nome, email, senhaHash, tipo_usuario, telefone, cpf, data_admissao, salario]
    );

    res.status(201).json({
      success: true,
      usuario: result.rows[0],
      message: 'Usuário criado com sucesso! Senha padrão: password'
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.code === '23505') { // Violação de unicidade
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE CLIENTES ===

// Listar clientes
app.get('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE ativo = true ORDER BY nome'
    );

    res.json({
      success: true,
      clientes: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar cliente
app.post('/api/clientes', authenticateToken, async (req, res) => {
  try {
    const { nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep, tipo_cliente, observacoes } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const result = await pool.query(
      `INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep, tipo_cliente, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep, tipo_cliente || 'pessoa_fisica', observacoes]
    );

    res.status(201).json({
      success: true,
      cliente: result.rows[0],
      message: 'Cliente criado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Histórico completo do cliente
app.get('/api/clientes/:id/historico', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar dados do cliente
    const cliente = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    
    if (cliente.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Buscar chamados
    const chamados = await pool.query(
      'SELECT * FROM chamados WHERE cliente_id = $1 ORDER BY data_criacao DESC',
      [id]
    );

    // Buscar ordens de serviço
    const ordensServico = await pool.query(
      `SELECT os.*, u.nome as usuario_responsavel 
       FROM ordens_servico os 
       LEFT JOIN usuarios u ON os.usuario_responsavel_id = u.id 
       WHERE os.cliente_id = $1 ORDER BY os.data_criacao DESC`,
      [id]
    );

    // Buscar vendas
    const vendas = await pool.query(
      `SELECT v.*, u.nome as vendedor
       FROM vendas v 
       LEFT JOIN usuarios u ON v.usuario_id = u.id 
       WHERE v.cliente_id = $1 ORDER BY v.data_venda DESC`,
      [id]
    );

    res.json({
      success: true,
      cliente: cliente.rows[0],
      historico: {
        chamados: chamados.rows,
        ordens_servico: ordensServico.rows,
        vendas: vendas.rows
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE PRODUTOS ===

// Listar produtos
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

// Criar produto (apenas admin)
app.post('/api/produtos', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nome, descricao, categoria, preco_venda, preco_custo, estoque_atual, estoque_minimo } = req.body;

    if (!nome || !preco_venda) {
      return res.status(400).json({ error: 'Nome e preço de venda são obrigatórios' });
    }

    const result = await pool.query(
      `INSERT INTO produtos (nome, descricao, categoria, preco_venda, preco_custo, estoque_atual, estoque_minimo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nome, descricao, categoria, preco_venda, preco_custo, estoque_atual || 0, estoque_minimo || 0]
    );

    res.status(201).json({
      success: true,
      produto: result.rows[0],
      message: 'Produto criado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE ORDENS DE SERVIÇO ===

// Listar ordens de serviço
app.get('/api/ordens-servico', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT os.*, c.nome as cliente_nome, u.nome as responsavel_nome
      FROM ordens_servico os
      LEFT JOIN clientes c ON os.cliente_id = c.id
      LEFT JOIN usuarios u ON os.usuario_responsavel_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND os.status = $${params.length}`;
    }

    // Técnicos só veem suas próprias OS
    if (req.user.tipo_usuario === 'assistente_tecnico') {
      params.push(req.user.id);
      query += ` AND os.usuario_responsavel_id = $${params.length}`;
    }

    query += ' ORDER BY os.data_criacao DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      ordens_servico: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar ordens de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar ordem de serviço
app.post('/api/ordens-servico', authenticateToken, async (req, res) => {
  try {
    const { cliente_id, chamado_id, tipo_servico, descricao_problema, valor_mao_obra, prioridade, data_previsao, itens } = req.body;

    if (!cliente_id || !tipo_servico || !descricao_problema) {
      return res.status(400).json({ error: 'Cliente, tipo de serviço e descrição são obrigatórios' });
    }

    const numeroOS = await gerarProximoNumeroOS();

    // Calcular valor total dos itens
    let valorTotalItens = 0;
    if (itens && itens.length > 0) {
      valorTotalItens = itens.reduce((total, item) => total + (item.quantidade * item.valor_unitario), 0);
    }

    const valorTotal = (valor_mao_obra || 0) + valorTotalItens;

    const result = await pool.query(
      `INSERT INTO ordens_servico (numero_os, cliente_id, usuario_criacao_id, usuario_responsavel_id, chamado_id, 
       tipo_servico, descricao_problema, valor_mao_obra, valor_total, prioridade, data_previsao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [numeroOS, cliente_id, req.user.id, req.user.id, chamado_id, tipo_servico, descricao_problema, 
       valor_mao_obra || 0, valorTotal, prioridade || 'media', data_previsao]
    );

    const ordemServico = result.rows[0];

    // Inserir itens se existirem
    if (itens && itens.length > 0) {
      for (const item of itens) {
        await pool.query(
          `INSERT INTO ordens_servico_itens (ordem_servico_id, produto_id, descricao, quantidade, valor_unitario, valor_total, tipo_item)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [ordemServico.id, item.produto_id, item.descricao, item.quantidade, item.valor_unitario, 
           item.quantidade * item.valor_unitario, item.tipo_item || 'produto']
        );
      }
    }

    res.status(201).json({
      success: true,
      ordem_servico: ordemServico,
      message: `Ordem de serviço ${numeroOS} criada com sucesso!`
    });

  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE VENDAS ===

// Criar venda
app.post('/api/vendas', authenticateToken, async (req, res) => {
  try {
    const { cliente_id, itens, forma_pagamento, valor_desconto, observacoes } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ error: 'É necessário incluir pelo menos um item' });
    }

    const numeroVenda = await gerarProximoNumeroVenda();

    // Calcular valores
    const valorSubtotal = itens.reduce((total, item) => total + (item.quantidade * item.valor_unitario), 0);
    const valorTotal = valorSubtotal - (valor_desconto || 0);

    const result = await pool.query(
      `INSERT INTO vendas (numero_venda, cliente_id, usuario_id, valor_subtotal, valor_desconto, valor_total, forma_pagamento, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [numeroVenda, cliente_id, req.user.id, valorSubtotal, valor_desconto || 0, valorTotal, forma_pagamento, observacoes]
    );

    const venda = result.rows[0];

    // Inserir itens da venda
    for (const item of itens) {
      await pool.query(
        `INSERT INTO vendas_itens (venda_id, produto_id, quantidade, valor_unitario, valor_total)
         VALUES ($1, $2, $3, $4, $5)`,
        [venda.id, item.produto_id, item.quantidade, item.valor_unitario, item.quantidade * item.valor_unitario]
      );

      // Atualizar estoque
      await pool.query(
        'UPDATE produtos SET estoque_atual = estoque_atual - $1 WHERE id = $2',
        [item.quantidade, item.produto_id]
      );
    }

    // Registrar movimentação financeira
    await pool.query(
      `INSERT INTO movimentacoes_financeiras (tipo, categoria, descricao, valor, forma_pagamento, usuario_id, venda_id)
       VALUES ('entrada', 'Venda', $1, $2, $3, $4, $5)`,
      [`Venda de produtos - ${numeroVenda}`, valorTotal, forma_pagamento, req.user.id, venda.id]
    );

    res.status(201).json({
      success: true,
      venda,
      message: `Venda ${numeroVenda} realizada com sucesso!`
    });

  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS FINANCEIRAS ===

// Listar movimentações financeiras (apenas admin)
app.get('/api/financeiro/movimentacoes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { tipo, data_inicio, data_fim } = req.query;
    let query = `
      SELECT mf.*, u.nome as usuario_nome, v.numero_venda, os.numero_os
      FROM movimentacoes_financeiras mf
      LEFT JOIN usuarios u ON mf.usuario_id = u.id
      LEFT JOIN vendas v ON mf.venda_id = v.id
      LEFT JOIN ordens_servico os ON mf.ordem_servico_id = os.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo) {
      params.push(tipo);
      query += ` AND mf.tipo = $${params.length}`;
    }

    if (data_inicio) {
      params.push(data_inicio);
      query += ` AND mf.data_movimentacao >= $${params.length}`;
    }

    if (data_fim) {
      params.push(data_fim);
      query += ` AND mf.data_movimentacao <= $${params.length}`;
    }

    query += ' ORDER BY mf.data_movimentacao DESC';

    const result = await pool.query(query, params);

    res.json({
      success: true,
      movimentacoes: result.rows
    });
  } catch (error) {
    console.error('Erro ao listar movimentações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Resumo financeiro (apenas admin)
app.get('/api/financeiro/resumo', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { periodo = '30' } = req.query; // Últimos 30 dias por padrão

    const result = await pool.query(`
      SELECT 
        SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as total_saidas,
        COUNT(CASE WHEN tipo = 'entrada' THEN 1 END) as num_entradas,
        COUNT(CASE WHEN tipo = 'saida' THEN 1 END) as num_saidas
      FROM movimentacoes_financeiras 
      WHERE data_movimentacao >= NOW() - INTERVAL '${periodo} days'
    `);

    const resumo = result.rows[0];
    const saldo = parseFloat(resumo.total_entradas || 0) - parseFloat(resumo.total_saidas || 0);

    res.json({
      success: true,
      resumo: {
        ...resumo,
        saldo,
        periodo_dias: periodo
      }
    });

  } catch (error) {
    console.error('Erro ao gerar resumo financeiro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS ORIGINAIS DE CHAMADOS (compatibilidade) ===

// Criar novo chamado (público)
app.post('/api/chamados', chamadosLimiter, async (req, res) => {
  try {
    const { nome, email, telefone, empresa, tipo_problema, descricao, urgencia } = req.body;

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

// Listar todos os chamados (autenticado)
app.get('/api/admin/chamados', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT c.*, cl.nome as cliente_nome, u.nome as responsavel_nome
      FROM chamados c
      LEFT JOIN clientes cl ON c.cliente_id = cl.id
      LEFT JOIN usuarios u ON c.usuario_responsavel_id = u.id
    `;

    // Técnicos só veem seus próprios chamados
    if (req.user.tipo_usuario === 'assistente_tecnico') {
      query += ' WHERE c.usuario_responsavel_id = $1';
      const result = await pool.query(query + ' ORDER BY c.data_criacao DESC', [req.user.id]);
      res.json({ success: true, chamados: result.rows });
    } else {
      const result = await pool.query(query + ' ORDER BY c.data_criacao DESC');
      res.json({ success: true, chamados: result.rows });
    }

  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do chamado (autenticado)
app.patch('/api/admin/chamados/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, observacoes_admin } = req.body;

    let query = `
      UPDATE chamados 
      SET status = COALESCE($1, status), 
          observacoes_admin = COALESCE($2, observacoes_admin),
          data_atualizacao = NOW()
      WHERE id = $3
    `;
    let params = [status, observacoes_admin, id];

    // Técnicos só podem atualizar seus próprios chamados
    if (req.user.tipo_usuario === 'assistente_tecnico') {
      query += ' AND usuario_responsavel_id = $4';
      params.push(req.user.id);
    }

    query += ' RETURNING *';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chamado não encontrado ou sem permissão' });
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

// Estatísticas (autenticado)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    let whereClause = '';
    let params = [];

    // Técnicos só veem estatísticas dos seus chamados
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

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros globais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

console.log('📝 Iniciando servidor Unbug Solutions TI...');
console.log('🔗 Conectando ao banco de dados...');

// Inicializar servidor
app.listen(PORT, () => {
  console.log('✅ Servidor iniciado com sucesso!');
  console.log(`🚀 Servidor Unbug Solutions TI rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🔐 Login: admin@unbugsolutions.com.br / password`);
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
