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
    
    // Dropar tabelas existentes (se houver)
    await pool.query('DROP TABLE IF EXISTS chamados CASCADE');
    console.log('✅ Tabelas existentes removidas');

    console.log('🏗️ Criando tabelas...');

    // Criar tabela de chamados
    await pool.query(`
      CREATE TABLE chamados (
        id SERIAL PRIMARY KEY,
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

    // Criar índices para melhor performance
    await pool.query('CREATE INDEX idx_chamados_status ON chamados(status)');
    await pool.query('CREATE INDEX idx_chamados_data_criacao ON chamados(data_criacao DESC)');
    await pool.query('CREATE INDEX idx_chamados_email ON chamados(email)');
    console.log('✅ Índices criados');

    // Inserir dados de exemplo (opcional)
    console.log('📊 Inserindo dados de exemplo...');
    
    await pool.query(`
      INSERT INTO chamados (nome, email, telefone, empresa, tipo_problema, descricao, urgencia, status) VALUES
      ('João Silva', 'joao@empresa1.com', '(11) 99999-1111', 'Empresa ABC', 'hardware', 'Computador não liga, possível problema na fonte', 'alta', 'aberto'),
      ('Maria Santos', 'maria@empresa2.com', '(11) 99999-2222', 'Empresa XYZ', 'software', 'Sistema travando constantemente, precisa de verificação', 'media', 'em_andamento'),
      ('Pedro Costa', 'pedro@empresa3.com', '(11) 99999-3333', 'Empresa 123', 'rede', 'Sem acesso à internet em toda a empresa', 'critica', 'aberto'),
      ('Ana Oliveira', 'ana@empresa4.com', '(11) 99999-4444', 'Empresa DEF', 'email', 'Não consegue enviar emails, erro no servidor', 'alta', 'resolvido'),
      ('Carlos Ferreira', 'carlos@empresa5.com', '(11) 99999-5555', 'Empresa GHI', 'backup', 'Backup não está funcionando há 3 dias', 'media', 'fechado')
    `);
    console.log('✅ Dados de exemplo inseridos');

    // Verificar se os dados foram inseridos
    const result = await pool.query('SELECT COUNT(*) FROM chamados');
    console.log(`📈 Total de chamados na base: ${result.rows[0].count}`);

    console.log('🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📋 Estrutura criada:');
    console.log('   ✓ Tabela: chamados (com índices)');
    console.log('   ✓ Dados de exemplo inseridos');
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
