const { Pool } = require('pg');
require('dotenv').config();

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('🗄️ Conectando ao banco de dados...');
    
    // Verificar conexão
    await pool.query('SELECT NOW()');
    console.log('✅ Conexão com o banco estabelecida');

    console.log('🧹 Limpando tabelas existentes...');
    
    // Dropar tabelas existentes (se houver) em ordem devido às foreign keys
    await pool.query('DROP TABLE IF EXISTS vendas_itens CASCADE');
    await pool.query('DROP TABLE IF EXISTS vendas CASCADE');
    await pool.query('DROP TABLE IF EXISTS ordens_servico_itens CASCADE');
    await pool.query('DROP TABLE IF EXISTS ordens_servico CASCADE');
    await pool.query('DROP TABLE IF EXISTS movimentacoes_financeiras CASCADE');
    await pool.query('DROP TABLE IF EXISTS produtos CASCADE');
    await pool.query('DROP TABLE IF EXISTS chamados CASCADE');
    await pool.query('DROP TABLE IF EXISTS clientes CASCADE');
    await pool.query('DROP TABLE IF EXISTS usuarios CASCADE');
    console.log('✅ Tabelas existentes removidas');

    console.log('🏗️ Criando tabelas...');

    // Criar tabela de usuários (funcionários)
    await pool.query(`
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('administrador', 'assistente_tecnico')),
        telefone VARCHAR(20),
        cpf VARCHAR(14),
        data_admissao DATE,
        salario DECIMAL(10,2),
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "usuarios" criada');

    // Criar tabela de clientes
    await pool.query(`
      CREATE TABLE clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telefone VARCHAR(20),
        cpf_cnpj VARCHAR(18),
        endereco TEXT,
        cidade VARCHAR(100),
        estado VARCHAR(2),
        cep VARCHAR(10),
        tipo_cliente VARCHAR(20) DEFAULT 'pessoa_fisica' CHECK (tipo_cliente IN ('pessoa_fisica', 'pessoa_juridica')),
        observacoes TEXT,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "clientes" criada');

    // Criar tabela de produtos
    await pool.query(`
      CREATE TABLE produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        categoria VARCHAR(100),
        preco_venda DECIMAL(10,2),
        preco_custo DECIMAL(10,2),
        estoque_atual INTEGER DEFAULT 0,
        estoque_minimo INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "produtos" criada');

    // Atualizar tabela de chamados para referenciar clientes
    await pool.query(`
      CREATE TABLE chamados (
        id SERIAL PRIMARY KEY,
        cliente_id INTEGER REFERENCES clientes(id),
        usuario_responsavel_id INTEGER REFERENCES usuarios(id),
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        empresa VARCHAR(255),
        tipo_problema VARCHAR(100) NOT NULL DEFAULT 'geral',
        descricao TEXT NOT NULL,
        urgencia VARCHAR(20) DEFAULT 'media' CHECK (urgencia IN ('baixa', 'media', 'alta', 'critica')),
        status VARCHAR(20) DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado')),
        observacoes_admin TEXT,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "chamados" criada');

    // Criar tabela de ordens de serviço
    await pool.query(`
      CREATE TABLE ordens_servico (
        id SERIAL PRIMARY KEY,
        numero_os VARCHAR(50) UNIQUE NOT NULL,
        cliente_id INTEGER NOT NULL REFERENCES clientes(id),
        usuario_criacao_id INTEGER NOT NULL REFERENCES usuarios(id),
        usuario_responsavel_id INTEGER REFERENCES usuarios(id),
        chamado_id INTEGER REFERENCES chamados(id),
        tipo_servico VARCHAR(100) NOT NULL,
        descricao_problema TEXT NOT NULL,
        descricao_solucao TEXT,
        valor_mao_obra DECIMAL(10,2) DEFAULT 0,
        valor_total DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_andamento', 'aguardando_peca', 'finalizada', 'cancelada')),
        prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
        data_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_previsao TIMESTAMP WITH TIME ZONE,
        data_conclusao TIMESTAMP WITH TIME ZONE,
        observacoes TEXT,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "ordens_servico" criada');

    // Criar tabela de itens da ordem de serviço
    await pool.query(`
      CREATE TABLE ordens_servico_itens (
        id SERIAL PRIMARY KEY,
        ordem_servico_id INTEGER NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
        produto_id INTEGER REFERENCES produtos(id),
        descricao VARCHAR(255) NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        valor_unitario DECIMAL(10,2) NOT NULL,
        valor_total DECIMAL(10,2) NOT NULL,
        tipo_item VARCHAR(20) DEFAULT 'produto' CHECK (tipo_item IN ('produto', 'servico'))
      )
    `);
    console.log('✅ Tabela "ordens_servico_itens" criada');

    // Criar tabela de vendas
    await pool.query(`
      CREATE TABLE vendas (
        id SERIAL PRIMARY KEY,
        numero_venda VARCHAR(50) UNIQUE NOT NULL,
        cliente_id INTEGER REFERENCES clientes(id),
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
        valor_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
        valor_desconto DECIMAL(10,2) DEFAULT 0,
        valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
        forma_pagamento VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'cancelada')),
        observacoes TEXT,
        data_venda TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "vendas" criada');

    // Criar tabela de itens da venda
    await pool.query(`
      CREATE TABLE vendas_itens (
        id SERIAL PRIMARY KEY,
        venda_id INTEGER NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
        produto_id INTEGER NOT NULL REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        valor_unitario DECIMAL(10,2) NOT NULL,
        valor_total DECIMAL(10,2) NOT NULL
      )
    `);
    console.log('✅ Tabela "vendas_itens" criada');

    // Criar tabela de movimentações financeiras
    await pool.query(`
      CREATE TABLE movimentacoes_financeiras (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
        categoria VARCHAR(100) NOT NULL,
        descricao TEXT NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        forma_pagamento VARCHAR(50),
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
        venda_id INTEGER REFERENCES vendas(id),
        ordem_servico_id INTEGER REFERENCES ordens_servico(id),
        data_movimentacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        observacoes TEXT,
        data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('✅ Tabela "movimentacoes_financeiras" criada');

    // Criar índices para melhor performance
    await pool.query('CREATE INDEX idx_chamados_status ON chamados(status)');
    await pool.query('CREATE INDEX idx_chamados_data_criacao ON chamados(data_criacao DESC)');
    await pool.query('CREATE INDEX idx_chamados_cliente ON chamados(cliente_id)');
    await pool.query('CREATE INDEX idx_clientes_nome ON clientes(nome)');
    await pool.query('CREATE INDEX idx_clientes_email ON clientes(email)');
    await pool.query('CREATE INDEX idx_usuarios_email ON usuarios(email)');
    await pool.query('CREATE INDEX idx_ordens_servico_numero ON ordens_servico(numero_os)');
    await pool.query('CREATE INDEX idx_ordens_servico_status ON ordens_servico(status)');
    await pool.query('CREATE INDEX idx_vendas_numero ON vendas(numero_venda)');
    await pool.query('CREATE INDEX idx_movimentacoes_tipo ON movimentacoes_financeiras(tipo)');
    await pool.query('CREATE INDEX idx_movimentacoes_data ON movimentacoes_financeiras(data_movimentacao DESC)');
    console.log('✅ Índices criados');

    // Inserir dados de exemplo (opcional)
    console.log('📊 Inserindo dados de exemplo...');
    
    // Inserir usuários administradores (senhas serão hashadas no sistema real)
    await pool.query(`
      INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone, cpf, data_admissao, salario) VALUES
      ('Admin Sistema', 'admin@unbugsolutions.com.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', '(11) 99999-0001', '123.456.789-00', '2024-01-01', 8000.00),
      ('João Técnico', 'joao@unbugsolutions.com.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'assistente_tecnico', '(11) 99999-0002', '123.456.789-01', '2024-02-01', 4500.00),
      ('Maria Técnica', 'maria@unbugsolutions.com.br', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'assistente_tecnico', '(11) 99999-0003', '123.456.789-02', '2024-03-01', 4200.00)
    `);
    console.log('✅ Usuários inseridos');

    // Inserir clientes
    await pool.query(`
      INSERT INTO clientes (nome, email, telefone, cpf_cnpj, endereco, cidade, estado, cep, tipo_cliente) VALUES
      ('Empresa ABC Ltda', 'contato@empresaabc.com', '(11) 3333-1111', '12.345.678/0001-90', 'Rua das Empresas, 123', 'São Paulo', 'SP', '01234-567', 'pessoa_juridica'),
      ('João Silva', 'joao.silva@email.com', '(11) 99999-1111', '123.456.789-10', 'Rua A, 456', 'São Paulo', 'SP', '01234-000', 'pessoa_fisica'),
      ('Maria Santos', 'maria.santos@email.com', '(11) 99999-2222', '123.456.789-20', 'Rua B, 789', 'São Paulo', 'SP', '01235-000', 'pessoa_fisica'),
      ('Empresa XYZ S.A.', 'admin@empresaxyz.com', '(11) 3333-2222', '98.765.432/0001-10', 'Av. Comercial, 1000', 'São Paulo', 'SP', '01236-000', 'pessoa_juridica'),
      ('Pedro Costa', 'pedro.costa@email.com', '(11) 99999-3333', '123.456.789-30', 'Rua C, 321', 'São Paulo', 'SP', '01237-000', 'pessoa_fisica')
    `);
    console.log('✅ Clientes inseridos');

    // Inserir produtos
    await pool.query(`
      INSERT INTO produtos (nome, descricao, categoria, preco_venda, preco_custo, estoque_atual, estoque_minimo) VALUES
      ('Memória RAM 8GB DDR4', 'Memória RAM 8GB DDR4 2400MHz', 'Hardware', 180.00, 120.00, 25, 5),
      ('SSD 240GB SATA', 'SSD SATA III 240GB para notebooks e desktops', 'Hardware', 150.00, 100.00, 30, 8),
      ('Fonte ATX 500W', 'Fonte de alimentação ATX 500W 80+ Bronze', 'Hardware', 220.00, 150.00, 15, 3),
      ('Cabo HDMI 2m', 'Cabo HDMI 2.0 de 2 metros', 'Acessórios', 35.00, 20.00, 50, 10),
      ('Teclado USB', 'Teclado USB padrão ABNT2', 'Periféricos', 45.00, 25.00, 20, 5),
      ('Mouse Óptico', 'Mouse óptico USB 1000 DPI', 'Periféricos', 25.00, 15.00, 35, 10),
      ('Formatação Windows', 'Serviço de formatação e instalação do Windows', 'Serviços', 80.00, 0, 0, 0),
      ('Limpeza de Vírus', 'Serviço de remoção de vírus e malware', 'Serviços', 60.00, 0, 0, 0),
      ('Backup de Dados', 'Serviço de backup e recuperação de dados', 'Serviços', 100.00, 0, 0, 0),
      ('Configuração de Rede', 'Serviço de configuração de rede e internet', 'Serviços', 120.00, 0, 0, 0)
    `);
    console.log('✅ Produtos inseridos');
    
    // Inserir chamados
    await pool.query(`
      INSERT INTO chamados (cliente_id, usuario_responsavel_id, nome, email, telefone, empresa, tipo_problema, descricao, urgencia, status) VALUES
      (1, 2, 'João Silva', 'joao@empresa1.com', '(11) 99999-1111', 'Empresa ABC', 'hardware', 'Computador não liga, possível problema na fonte', 'alta', 'aberto'),
      (2, 3, 'Maria Santos', 'maria@empresa2.com', '(11) 99999-2222', 'Empresa XYZ', 'software', 'Sistema travando constantemente, precisa de verificação', 'media', 'em_andamento'),
      (3, 2, 'Pedro Costa', 'pedro@empresa3.com', '(11) 99999-3333', 'Empresa 123', 'rede', 'Sem acesso à internet em toda a empresa', 'critica', 'aberto'),
      (4, 3, 'Ana Oliveira', 'ana@empresa4.com', '(11) 99999-4444', 'Empresa DEF', 'email', 'Não consegue enviar emails, erro no servidor', 'alta', 'resolvido'),
      (5, 2, 'Carlos Ferreira', 'carlos@empresa5.com', '(11) 99999-5555', 'Empresa GHI', 'backup', 'Backup não está funcionando há 3 dias', 'media', 'fechado')
    `);
    console.log('✅ Chamados inseridos');

    // Inserir ordens de serviço
    await pool.query(`
      INSERT INTO ordens_servico (numero_os, cliente_id, usuario_criacao_id, usuario_responsavel_id, chamado_id, tipo_servico, descricao_problema, descricao_solucao, valor_mao_obra, valor_total, status, prioridade, data_previsao) VALUES
      ('OS2024001', 1, 1, 2, 1, 'Reparo Hardware', 'Computador não liga', 'Substituição da fonte de alimentação', 80.00, 300.00, 'em_andamento', 'alta', NOW() + INTERVAL '2 days'),
      ('OS2024002', 2, 1, 3, 2, 'Manutenção Software', 'Sistema lento', 'Limpeza de vírus e otimização', 60.00, 60.00, 'finalizada', 'media', NOW() - INTERVAL '1 day'),
      ('OS2024003', 3, 1, 2, 3, 'Configuração Rede', 'Problemas de conectividade', NULL, 120.00, 120.00, 'aberta', 'urgente', NOW() + INTERVAL '1 day')
    `);
    console.log('✅ Ordens de serviço inseridas');

    // Inserir itens das ordens de serviço
    await pool.query(`
      INSERT INTO ordens_servico_itens (ordem_servico_id, produto_id, descricao, quantidade, valor_unitario, valor_total, tipo_item) VALUES
      (1, 3, 'Fonte ATX 500W', 1, 220.00, 220.00, 'produto'),
      (1, 7, 'Formatação Windows', 1, 80.00, 80.00, 'servico'),
      (2, 8, 'Limpeza de Vírus', 1, 60.00, 60.00, 'servico'),
      (3, 10, 'Configuração de Rede', 1, 120.00, 120.00, 'servico')
    `);
    console.log('✅ Itens das ordens de serviço inseridos');

    // Inserir vendas
    await pool.query(`
      INSERT INTO vendas (numero_venda, cliente_id, usuario_id, valor_subtotal, valor_desconto, valor_total, forma_pagamento, status, data_venda) VALUES
      ('VD2024001', 2, 2, 205.00, 10.00, 195.00, 'Dinheiro', 'paga', NOW() - INTERVAL '1 day'),
      ('VD2024002', 4, 3, 70.00, 0, 70.00, 'Cartão Débito', 'paga', NOW() - INTERVAL '2 days'),
      ('VD2024003', 1, 2, 400.00, 20.00, 380.00, 'PIX', 'pendente', NOW())
    `);
    console.log('✅ Vendas inseridas');

    // Inserir itens das vendas
    await pool.query(`
      INSERT INTO vendas_itens (venda_id, produto_id, quantidade, valor_unitario, valor_total) VALUES
      (1, 1, 1, 180.00, 180.00),
      (1, 5, 1, 25.00, 25.00),
      (2, 4, 2, 35.00, 70.00),
      (3, 2, 2, 150.00, 300.00),
      (3, 6, 4, 25.00, 100.00)
    `);
    console.log('✅ Itens das vendas inseridos');

    // Inserir movimentações financeiras
    await pool.query(`
      INSERT INTO movimentacoes_financeiras (tipo, categoria, descricao, valor, forma_pagamento, usuario_id, venda_id, data_movimentacao) VALUES
      ('entrada', 'Venda', 'Venda de produtos - VD2024001', 195.00, 'Dinheiro', 2, 1, NOW() - INTERVAL '1 day'),
      ('entrada', 'Venda', 'Venda de produtos - VD2024002', 70.00, 'Cartão Débito', 3, 2, NOW() - INTERVAL '2 days'),
      ('saida', 'Compras', 'Compra de estoque - Memórias RAM', 1200.00, 'Transferência', 1, NULL, NOW() - INTERVAL '3 days'),
      ('saida', 'Despesas', 'Pagamento de aluguel', 2500.00, 'Transferência', 1, NULL, NOW() - INTERVAL '5 days'),
      ('entrada', 'Serviços', 'Ordem de Serviço OS2024002', 60.00, 'PIX', 3, NULL, NOW() - INTERVAL '1 day')
    `);
    console.log('✅ Movimentações financeiras inseridas');

    // Verificar se os dados foram inseridos
    const resultChamados = await pool.query('SELECT COUNT(*) FROM chamados');
    const resultClientes = await pool.query('SELECT COUNT(*) FROM clientes');
    const resultUsuarios = await pool.query('SELECT COUNT(*) FROM usuarios');
    const resultProdutos = await pool.query('SELECT COUNT(*) FROM produtos');
    const resultOrdens = await pool.query('SELECT COUNT(*) FROM ordens_servico');
    
    console.log(`📈 Dados inseridos:`);
    console.log(`   - ${resultUsuarios.rows[0].count} usuários`);
    console.log(`   - ${resultClientes.rows[0].count} clientes`);
    console.log(`   - ${resultProdutos.rows[0].count} produtos`);
    console.log(`   - ${resultChamados.rows[0].count} chamados`);
    console.log(`   - ${resultOrdens.rows[0].count} ordens de serviço`);

    console.log('🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📋 Estrutura criada:');
    console.log('   ✓ Tabela: usuarios (funcionários com níveis de acesso)');
    console.log('   ✓ Tabela: clientes (com histórico completo)');
    console.log('   ✓ Tabela: produtos (para loja e serviços)');
    console.log('   ✓ Tabela: chamados (vinculados a clientes)');
    console.log('   ✓ Tabela: ordens_servico (com itens)');
    console.log('   ✓ Tabela: vendas (com itens)');
    console.log('   ✓ Tabela: movimentacoes_financeiras');
    console.log('   ✓ Dados de exemplo inseridos');
    console.log('\n🔐 Credenciais de teste:');
    console.log('   Admin: admin@unbugsolutions.com.br / senha: password');
    console.log('   Técnico: joao@unbugsolutions.com.br / senha: password');
    console.log('\n🚀 Você pode agora executar: npm start');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    console.error('Detalhes:', error.message);
  } finally {
    await pool.end();
  }
}

// Executar inicialização
initDatabase();
