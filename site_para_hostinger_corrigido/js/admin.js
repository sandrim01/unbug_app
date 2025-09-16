// Admin.js - Sistema administrativo simplificado para demonstração

// Variáveis globais
let usuarioLogado = false;

// Credenciais de demonstração
const CREDENCIAIS_DEMO = {
    usuario: 'admin',
    senha: 'demo123'
};

// Dados simulados para demonstração
const DADOS_SIMULADOS = {
    estatisticas: {
        chamadosAbertos: 24,
        chamadosUrgentes: 8,
        resolvidosMes: 156,
        satisfacao: 98
    },
    chamados: [
        {
            id: '2025001',
            cliente: 'João Silva',
            assunto: 'Computador não liga',
            tipo: 'Hardware',
            urgencia: 'Alta',
            status: 'Em Andamento',
            data: '15/09/2025'
        },
        {
            id: '2025002',
            cliente: 'Maria Santos',
            assunto: 'Internet lenta',
            tipo: 'Rede',
            urgencia: 'Média',
            status: 'Aberto',
            data: '15/09/2025'
        },
        {
            id: '2025003',
            cliente: 'Pedro Costa',
            assunto: 'Erro no sistema',
            tipo: 'Software',
            urgencia: 'Baixa',
            status: 'Resolvido',
            data: '14/09/2025'
        }
    ]
};

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema administrativo carregado');
    
    // Verificar se já está logado (localStorage)
    const loginSalvo = localStorage.getItem('adminLogado');
    if (loginSalvo === 'true') {
        mostrarPainelAdmin();
    }
    
    // Configurar formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', fazerLogin);
    }
    
    // Carregar chamados do localStorage se existirem
    carregarChamadosLocais();
});

// Função para fazer login
function fazerLogin(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    
    // Validar credenciais
    if (usuario === CREDENCIAIS_DEMO.usuario && senha === CREDENCIAIS_DEMO.senha) {
        // Login bem-sucedido
        usuarioLogado = true;
        localStorage.setItem('adminLogado', 'true');
        localStorage.setItem('adminUsuario', usuario);
        
        mostrarMensagemLogin('✅ Login realizado com sucesso!', 'success');
        
        // Mostrar painel após 1 segundo
        setTimeout(() => {
            mostrarPainelAdmin();
        }, 1000);
        
    } else {
        // Login falhou
        mostrarMensagemLogin('❌ Usuário ou senha incorretos!', 'error');
        
        // Limpar campos
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';
        document.getElementById('usuario').focus();
    }
}

// Função para mostrar mensagem de login
function mostrarMensagemLogin(mensagem, tipo) {
    // Criar elemento de mensagem se não existir
    let msgElement = document.getElementById('loginMessage');
    if (!msgElement) {
        msgElement = document.createElement('div');
        msgElement.id = 'loginMessage';
        msgElement.style.marginTop = '15px';
        
        const loginForm = document.getElementById('loginForm');
        loginForm.appendChild(msgElement);
    }
    
    msgElement.className = `alert alert-${tipo === 'success' ? 'success' : 'danger'}`;
    msgElement.innerHTML = mensagem;
    msgElement.style.display = 'block';
    
    // Ocultar após 3 segundos
    setTimeout(() => {
        msgElement.style.display = 'none';
    }, 3000);
}

// Função para mostrar painel administrativo
function mostrarPainelAdmin() {
    document.getElementById('loginArea').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Atualizar estatísticas
    atualizarEstatisticas();
    
    // Mostrar seção de chamados por padrão
    mostrarSecao('chamados');
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
    // Atualizar com dados simulados ou reais do localStorage
    const chamadosLocais = JSON.parse(localStorage.getItem('chamados') || '[]');
    
    if (chamadosLocais.length > 0) {
        // Usar dados reais se existirem
        DADOS_SIMULADOS.estatisticas.chamadosAbertos = chamadosLocais.length;
        DADOS_SIMULADOS.estatisticas.resolvidosMes += chamadosLocais.length;
    }
}

// Função para carregar chamados locais
function carregarChamadosLocais() {
    const chamadosLocais = JSON.parse(localStorage.getItem('chamados') || '[]');
    
    if (chamadosLocais.length > 0) {
        // Adicionar chamados locais aos dados simulados
        chamadosLocais.forEach((chamado, index) => {
            const chamadoFormatado = {
                id: chamado.numero_chamado || `LOCAL${index + 1}`,
                cliente: chamado.nome,
                assunto: chamado.assunto,
                tipo: chamado.tipo_problema,
                urgencia: chamado.urgencia,
                status: 'Recebido',
                data: new Date(chamado.data_envio).toLocaleDateString('pt-BR')
            };
            
            // Adicionar no início da lista
            DADOS_SIMULADOS.chamados.unshift(chamadoFormatado);
        });
    }
}

// Função para mostrar seção específica
function mostrarSecao(secao) {
    // Ocultar todas as seções
    const secoes = document.querySelectorAll('.admin-section');
    secoes.forEach(s => s.style.display = 'none');
    
    // Mostrar seção selecionada
    const secaoElement = document.getElementById(`secao${secao.charAt(0).toUpperCase() + secao.slice(1)}`);
    if (secaoElement) {
        secaoElement.style.display = 'block';
    }
    
    // Carregar conteúdo específico da seção
    switch(secao) {
        case 'chamados':
            carregarTabelaChamados();
            break;
        case 'clientes':
            carregarSecaoClientes();
            break;
        case 'relatorios':
            carregarSecaoRelatorios();
            break;
        case 'configuracoes':
            carregarSecaoConfiguracoes();
            break;
    }
}

// Função para carregar tabela de chamados
function carregarTabelaChamados() {
    const tbody = document.querySelector('#secaoChamados tbody');
    if (!tbody) return;
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Adicionar chamados
    DADOS_SIMULADOS.chamados.forEach(chamado => {
        const row = document.createElement('tr');
        
        // Definir classes para badges
        const urgenciaClass = {
            'Alta': 'badge-danger',
            'Crítica': 'badge-danger',
            'Média': 'badge-warning',
            'Baixa': 'badge-info'
        };
        
        const statusClass = {
            'Aberto': 'badge-danger',
            'Recebido': 'badge-info',
            'Em Andamento': 'badge-warning',
            'Resolvido': 'badge-success',
            'Fechado': 'badge-secondary'
        };
        
        row.innerHTML = `
            <td>#${chamado.id}</td>
            <td>${chamado.cliente}</td>
            <td>${chamado.assunto}</td>
            <td>${chamado.tipo}</td>
            <td><span class="badge ${urgenciaClass[chamado.urgencia] || 'badge-secondary'}">${chamado.urgencia}</span></td>
            <td><span class="badge ${statusClass[chamado.status] || 'badge-secondary'}">${chamado.status}</span></td>
            <td>${chamado.data}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Função para carregar seção de clientes
function carregarSecaoClientes() {
    const secao = document.getElementById('secaoClientes');
    if (!secao) return;
    
    const cardBody = secao.querySelector('.card-body');
    cardBody.innerHTML = `
        <div class="alert alert-info">
            <h4>👥 Gestão de Clientes</h4>
            <p>Esta seção incluiria:</p>
            <ul>
                <li>Lista de todos os clientes cadastrados</li>
                <li>Histórico de chamados por cliente</li>
                <li>Informações de contato e empresa</li>
                <li>Estatísticas de atendimento</li>
            </ul>
            <p><strong>Status:</strong> Funcionalidade disponível na versão completa com banco de dados.</p>
        </div>
        
        <div class="row">
            <div class="col-6">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 style="color: #2563eb;">150+</h3>
                        <p>Clientes Ativos</p>
                    </div>
                </div>
            </div>
            <div class="col-6">
                <div class="card">
                    <div class="card-body text-center">
                        <h3 style="color: #16a34a;">85%</h3>
                        <p>Taxa de Retenção</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para carregar seção de relatórios
function carregarSecaoRelatorios() {
    const secao = document.getElementById('secaoRelatorios');
    if (!secao) return;
    
    const cardBody = secao.querySelector('.card-body');
    cardBody.innerHTML = `
        <div class="alert alert-info">
            <h4>📊 Relatórios e Análises</h4>
            <p>Esta seção incluiria:</p>
            <ul>
                <li>Relatórios de performance da equipe</li>
                <li>Análise de tipos de problemas mais comuns</li>
                <li>Tempo médio de resolução</li>
                <li>Gráficos de satisfação do cliente</li>
                <li>Relatórios financeiros</li>
            </ul>
        </div>
        
        <div class="row">
            <div class="col-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h4>Tempo Médio de Resolução</h4>
                        <h2 style="color: #2563eb;">4.2h</h2>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h4>Problema Mais Comum</h4>
                        <h2 style="color: #dc2626;">Hardware</h2>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card">
                    <div class="card-body text-center">
                        <h4>Técnico Destaque</h4>
                        <h2 style="color: #16a34a;">João</h2>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para carregar seção de configurações
function carregarSecaoConfiguracoes() {
    const secao = document.getElementById('secaoConfiguracoes');
    if (!secao) return;
    
    const cardBody = secao.querySelector('.card-body');
    cardBody.innerHTML = `
        <div class="alert alert-warning">
            <h4>⚙️ Configurações do Sistema</h4>
            <p>Esta seção incluiria:</p>
            <ul>
                <li>Configurações de e-mail</li>
                <li>Gestão de usuários e permissões</li>
                <li>Configurações de notificações</li>
                <li>Backup e restauração</li>
                <li>Integrações com sistemas externos</li>
            </ul>
        </div>
        
        <div class="form-group">
            <label>Tempo de resposta máximo (horas)</label>
            <input type="number" class="form-control" value="2" readonly>
        </div>
        
        <div class="form-group">
            <label>E-mail de notificações</label>
            <input type="email" class="form-control" value="admin@unbugsolutions.com.br" readonly>
        </div>
        
        <div class="form-group">
            <label>Horário de funcionamento</label>
            <input type="text" class="form-control" value="Segunda a Sexta: 8h às 18h" readonly>
        </div>
        
        <p class="text-muted">
            <em>Configurações são somente leitura nesta versão de demonstração.</em>
        </p>
    `;
}

// Função para fazer logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        usuarioLogado = false;
        localStorage.removeItem('adminLogado');
        localStorage.removeItem('adminUsuario');
        
        // Mostrar área de login
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('loginArea').style.display = 'block';
        
        // Limpar formulário
        document.getElementById('loginForm').reset();
        
        // Focar no campo usuário
        document.getElementById('usuario').focus();
        
        mostrarMensagemLogin('✅ Logout realizado com sucesso!', 'success');
    }
}

// Função para exportar dados (demonstração)
function exportarDados(tipo) {
    let dados = '';
    let filename = '';
    
    switch(tipo) {
        case 'chamados':
            dados = JSON.stringify(DADOS_SIMULADOS.chamados, null, 2);
            filename = 'chamados_' + new Date().toISOString().split('T')[0] + '.json';
            break;
        case 'estatisticas':
            dados = JSON.stringify(DADOS_SIMULADOS.estatisticas, null, 2);
            filename = 'estatisticas_' + new Date().toISOString().split('T')[0] + '.json';
            break;
    }
    
    // Criar e baixar arquivo
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensagemLogin('✅ Dados exportados com sucesso!', 'success');
}

// Adicionar atalhos de teclado
document.addEventListener('keydown', function(event) {
    // Ctrl + L = Logout (se logado)
    if (event.ctrlKey && event.key === 'l' && usuarioLogado) {
        event.preventDefault();
        logout();
    }
    
    // Enter no campo senha = fazer login
    if (event.key === 'Enter' && document.activeElement.id === 'senha') {
        event.preventDefault();
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
});
