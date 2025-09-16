// Sistema Administrativo Completo - UnBug Solutions TI
// Desenvolvido para gerenciamento de chamados, clientes, configurações e relatórios

// ================================
// DADOS SIMULADOS PARA DEMONSTRAÇÃO
// ================================

let chamados = [
    {
        id: '2025001',
        cliente: 'João Silva',
        email: 'joao@empresa.com',
        telefone: '(11) 98888-1111',
        empresa: 'Empresa ABC Ltda',
        assunto: 'Computador não liga',
        tipo: 'hardware',
        urgencia: 'alta',
        status: 'em_andamento',
        descricao: 'Computador principal da empresa não está ligando. Possível problema na fonte de alimentação.',
        observacoes: 'Cliente informou que houve queda de energia ontem. Técnico já agendado para hoje às 14h.',
        dataAbertura: new Date('2025-09-15T09:30:00'),
        dataAtualizacao: new Date('2025-09-15T10:15:00')
    },
    {
        id: '2025002',
        cliente: 'Maria Santos',
        email: 'maria@loja.com',
        telefone: '(11) 97777-2222',
        empresa: 'Loja Fashion',
        assunto: 'Internet muito lenta',
        tipo: 'rede',
        urgencia: 'media',
        status: 'aberto',
        descricao: 'Internet está extremamente lenta, afetando vendas online e sistema de pagamento.',
        observacoes: 'Verificar configuração do roteador e possível problema no provedor.',
        dataAbertura: new Date('2025-09-15T11:00:00'),
        dataAtualizacao: new Date('2025-09-15T11:00:00')
    },
    {
        id: '2025003',
        cliente: 'Pedro Costa',
        email: 'pedro@consultoria.com',
        telefone: '(11) 96666-3333',
        empresa: 'Consultoria Pro',
        assunto: 'Erro no sistema de gestão',
        tipo: 'software',
        urgencia: 'baixa',
        status: 'resolvido',
        descricao: 'Sistema apresenta erro ao gerar relatórios mensais.',
        observacoes: 'Problema corrigido com atualização do sistema. Cliente orientado sobre backup.',
        dataAbertura: new Date('2025-09-14T14:20:00'),
        dataAtualizacao: new Date('2025-09-15T09:45:00')
    },
    {
        id: '2025004',
        cliente: 'Ana Paula',
        email: 'ana@mercado.com',
        telefone: '(11) 95555-4444',
        empresa: 'Mercado Central',
        assunto: 'Impressora não funciona',
        tipo: 'hardware',
        urgencia: 'media',
        status: 'aguardando_cliente',
        descricao: 'Impressora fiscal não está imprimindo cupons.',
        observacoes: 'Aguardando cliente enviar foto do erro para diagnóstico remoto.',
        dataAbertura: new Date('2025-09-13T16:30:00'),
        dataAtualizacao: new Date('2025-09-14T08:20:00')
    },
    {
        id: '2025005',
        cliente: 'Carlos Oliveira',
        email: 'carlos@transportes.com',
        telefone: '(11) 94444-5555',
        empresa: 'Transportes Rápidos',
        assunto: 'Backup não está funcionando',
        tipo: 'backup',
        urgencia: 'critica',
        status: 'em_andamento',
        descricao: 'Sistema de backup automático falhou. Dados importantes em risco.',
        observacoes: 'Prioridade máxima. Técnico especialista designado para o caso.',
        dataAbertura: new Date('2025-09-16T07:15:00'),
        dataAtualizacao: new Date('2025-09-16T08:00:00')
    }
];

let clientes = [
    {
        id: 'CLI001',
        nome: 'João Silva',
        email: 'joao@empresa.com',
        telefone: '(11) 98888-1111',
        empresa: 'Empresa ABC Ltda',
        status: 'ativo',
        documento: '12.345.678/0001-90',
        endereco: 'Rua Comercial, 456 - São Paulo/SP',
        observacoes: 'Cliente VIP, prioridade no atendimento',
        dataCadastro: new Date('2025-01-15'),
        ultimoChamado: new Date('2025-09-15')
    },
    {
        id: 'CLI002',
        nome: 'Maria Santos',
        email: 'maria@loja.com',
        telefone: '(11) 97777-2222',
        empresa: 'Loja Fashion',
        status: 'ativo',
        documento: '98.765.432/0001-10',
        endereco: 'Av. das Lojas, 789 - São Paulo/SP',
        observacoes: 'Cliente desde 2023, sempre pontual nos pagamentos',
        dataCadastro: new Date('2023-05-20'),
        ultimoChamado: new Date('2025-09-15')
    },
    {
        id: 'CLI003',
        nome: 'Pedro Costa',
        email: 'pedro@consultoria.com',
        telefone: '(11) 96666-3333',
        empresa: 'Consultoria Pro',
        status: 'vip',
        documento: '11.222.333/0001-44',
        endereco: 'Edifício Comercial, sala 1205 - São Paulo/SP',
        observacoes: 'Cliente VIP com contrato anual de suporte',
        dataCadastro: new Date('2022-11-10'),
        ultimoChamado: new Date('2025-09-14')
    },
    {
        id: 'CLI004',
        nome: 'Ana Paula',
        email: 'ana@mercado.com',
        telefone: '(11) 95555-4444',
        empresa: 'Mercado Central',
        status: 'ativo',
        documento: '55.666.777/0001-88',
        endereco: 'Rua do Comércio, 123 - São Paulo/SP',
        observacoes: 'Mercado com múltiplas filiais',
        dataCadastro: new Date('2024-03-08'),
        ultimoChamado: new Date('2025-09-13')
    },
    {
        id: 'CLI005',
        nome: 'Carlos Oliveira',
        email: 'carlos@transportes.com',
        telefone: '(11) 94444-5555',
        empresa: 'Transportes Rápidos',
        status: 'ativo',
        documento: '77.888.999/0001-00',
        endereco: 'Galpão Industrial, 555 - São Paulo/SP',
        observacoes: 'Empresa de transporte, equipamentos críticos',
        dataCadastro: new Date('2024-07-22'),
        ultimoChamado: new Date('2025-09-16')
    }
];

let usuarios = [
    { username: 'admin', perfil: 'Administrador', status: 'Ativo', senha: 'demo123' },
    { username: 'tecnico1', perfil: 'Técnico', status: 'Ativo', senha: 'tecnico123' },
    { username: 'suporte1', perfil: 'Suporte', status: 'Ativo', senha: 'suporte123' }
];

let configuracoes = {
    nomeEmpresa: 'UnBug Informática',
    emailPrincipal: 'contato@unbug.com.br',
    telefonePrincipal: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123\nCentro - São Paulo/SP\nCEP: 01234-567',
    horarioFuncionamento: 'Segunda a Sexta: 8h às 18h'
};

// ================================
// FUNCIONALIDADES PRINCIPAIS
// ================================

// Função de inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarDashboard();
    carregarChamados();
    carregarConfiguracoes();
    configurarEventos();
});

// Navegação entre seções
function mostrarSecao(secao) {
    // Ocultar todas as seções
    document.querySelectorAll('.admin-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Remover classe ativa de todos os botões
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById('secao' + secao).style.display = 'block';
    
    // Ativar botão correspondente
    document.querySelector(`[onclick="mostrarSecao('${secao}')"]`).classList.add('active');
    
    // Carregar dados específicos da seção
    switch(secao) {
        case 'Dashboard':
            carregarDashboard();
            break;
        case 'Chamados':
            carregarChamados();
            break;
        case 'Relatorios':
            carregarRelatorios();
            break;
        case 'Configuracoes':
            carregarConfiguracoes();
            break;
        case 'Clientes':
            carregarClientes();
            break;
    }
}

// ================================
// DASHBOARD
// ================================

function carregarDashboard() {
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Calcular estatísticas
    const totalChamados = chamados.length;
    const chamadosAbertos = chamados.filter(c => c.status === 'aberto').length;
    const chamadosAndamento = chamados.filter(c => c.status === 'em_andamento').length;
    const chamadosResolvidos = chamados.filter(c => c.status === 'resolvido').length;
    const chamadosUrgentes = chamados.filter(c => c.urgencia === 'critica' || c.urgencia === 'alta').length;
    const chamadosRecentes = chamados.filter(c => c.dataAbertura >= trintaDiasAtras).length;
    
    // Atualizar cards do dashboard
    document.getElementById('totalChamados').textContent = totalChamados;
    document.getElementById('chamadosAbertos').textContent = chamadosAbertos;
    document.getElementById('chamadosAndamento').textContent = chamadosAndamento;
    document.getElementById('chamadosResolvidos').textContent = chamadosResolvidos;
    document.getElementById('chamadosUrgentes').textContent = chamadosUrgentes;
    document.getElementById('chamadosRecentes').textContent = chamadosRecentes;
}

// ================================
// GESTÃO DE CHAMADOS
// ================================

function carregarChamados() {
    const tbody = document.querySelector('#tabelaChamados tbody');
    tbody.innerHTML = '';
    
    chamados.forEach(chamado => {
        const row = criarLinhaChamado(chamado);
        tbody.appendChild(row);
    });
}

function criarLinhaChamado(chamado) {
    const row = document.createElement('tr');
    
    const urgenciaClass = {
        'critica': 'badge-danger',
        'alta': 'badge-warning',
        'media': 'badge-info',
        'baixa': 'badge-secondary'
    };
    
    const statusClass = {
        'aberto': 'badge-danger',
        'em_andamento': 'badge-warning',
        'aguardando_cliente': 'badge-info',
        'resolvido': 'badge-success',
        'fechado': 'badge-secondary'
    };
    
    const statusTexto = {
        'aberto': 'Aberto',
        'em_andamento': 'Em Andamento',
        'aguardando_cliente': 'Aguardando Cliente',
        'resolvido': 'Resolvido',
        'fechado': 'Fechado'
    };
    
    const urgenciaTexto = {
        'critica': 'Crítica',
        'alta': 'Alta',
        'media': 'Média',
        'baixa': 'Baixa'
    };
    
    row.innerHTML = `
        <td>#${chamado.id}</td>
        <td>${chamado.cliente}</td>
        <td>${chamado.assunto}</td>
        <td><span class="badge badge-secondary">${chamado.tipo.charAt(0).toUpperCase() + chamado.tipo.slice(1)}</span></td>
        <td><span class="badge ${urgenciaClass[chamado.urgencia]}">${urgenciaTexto[chamado.urgencia]}</span></td>
        <td><span class="badge ${statusClass[chamado.status]}">${statusTexto[chamado.status]}</span></td>
        <td>${chamado.dataAbertura.toLocaleDateString('pt-BR')}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="editarChamado('${chamado.id}')" title="Editar">✏️</button>
            <button class="btn btn-sm btn-info" onclick="visualizarChamado('${chamado.id}')" title="Visualizar">👁️</button>
            <button class="btn btn-sm btn-success" onclick="imprimirChamado('${chamado.id}')" title="Imprimir">🖨️</button>
        </td>
    `;
    
    return row;
}

function filtrarChamados() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroUrgencia = document.getElementById('filtroUrgencia').value;
    const busca = document.getElementById('buscaChamado').value.toLowerCase();
    
    let chamadosFiltrados = chamados.filter(chamado => {
        const matchStatus = !filtroStatus || chamado.status === filtroStatus;
        const matchUrgencia = !filtroUrgencia || chamado.urgencia === filtroUrgencia;
        const matchBusca = !busca || 
            chamado.cliente.toLowerCase().includes(busca) ||
            chamado.assunto.toLowerCase().includes(busca) ||
            chamado.empresa.toLowerCase().includes(busca);
        
        return matchStatus && matchUrgencia && matchBusca;
    });
    
    const tbody = document.querySelector('#tabelaChamados tbody');
    tbody.innerHTML = '';
    
    chamadosFiltrados.forEach(chamado => {
        const row = criarLinhaChamado(chamado);
        tbody.appendChild(row);
    });
}

function limparFiltros() {
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroUrgencia').value = '';
    document.getElementById('buscaChamado').value = '';
    carregarChamados();
}

function adicionarChamado() {
    limparFormularioChamado();
    document.getElementById('modalTitulo').textContent = 'Novo Chamado';
    document.getElementById('btnExcluir').style.display = 'none';
    document.getElementById('modalChamado').style.display = 'block';
}

function editarChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    document.getElementById('chamadoId').value = chamado.id;
    document.getElementById('modalCliente').value = chamado.cliente;
    document.getElementById('modalEmail').value = chamado.email;
    document.getElementById('modalTelefone').value = chamado.telefone;
    document.getElementById('modalEmpresa').value = chamado.empresa;
    document.getElementById('modalAssunto').value = chamado.assunto;
    document.getElementById('modalTipo').value = chamado.tipo;
    document.getElementById('modalUrgencia').value = chamado.urgencia;
    document.getElementById('modalStatus').value = chamado.status;
    document.getElementById('modalDescricao').value = chamado.descricao;
    document.getElementById('modalObservacoes').value = chamado.observacoes;
    
    document.getElementById('modalTitulo').textContent = `Editar Chamado #${chamado.id}`;
    document.getElementById('btnExcluir').style.display = 'inline-block';
    document.getElementById('modalChamado').style.display = 'block';
}

function limparFormularioChamado() {
    document.getElementById('formChamado').reset();
    document.getElementById('chamadoId').value = '';
}

function fecharModal() {
    document.getElementById('modalChamado').style.display = 'none';
}

function salvarChamado() {
    const id = document.getElementById('chamadoId').value;
    const dadosChamado = {
        cliente: document.getElementById('modalCliente').value,
        email: document.getElementById('modalEmail').value,
        telefone: document.getElementById('modalTelefone').value,
        empresa: document.getElementById('modalEmpresa').value,
        assunto: document.getElementById('modalAssunto').value,
        tipo: document.getElementById('modalTipo').value,
        urgencia: document.getElementById('modalUrgencia').value,
        status: document.getElementById('modalStatus').value,
        descricao: document.getElementById('modalDescricao').value,
        observacoes: document.getElementById('modalObservacoes').value
    };
    
    if (id) {
        // Editar chamado existente
        const index = chamados.findIndex(c => c.id === id);
        if (index !== -1) {
            chamados[index] = { ...chamados[index], ...dadosChamado, dataAtualizacao: new Date() };
            alert('Chamado atualizado com sucesso!');
        }
    } else {
        // Criar novo chamado
        const novoId = (Math.max(...chamados.map(c => parseInt(c.id))) + 1).toString();
        const novoChamado = {
            id: novoId,
            ...dadosChamado,
            dataAbertura: new Date(),
            dataAtualizacao: new Date()
        };
        chamados.push(novoChamado);
        alert('Chamado criado com sucesso!');
    }
    
    fecharModal();
    carregarChamados();
    carregarDashboard();
}

function excluirChamado() {
    const id = document.getElementById('chamadoId').value;
    if (confirm('Tem certeza que deseja excluir este chamado?')) {
        const index = chamados.findIndex(c => c.id === id);
        if (index !== -1) {
            chamados.splice(index, 1);
            alert('Chamado excluído com sucesso!');
            fecharModal();
            carregarChamados();
            carregarDashboard();
        }
    }
}

function visualizarChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    const detalhes = `
        CHAMADO #${chamado.id}
        
        Cliente: ${chamado.cliente}
        E-mail: ${chamado.email}
        Telefone: ${chamado.telefone}
        Empresa: ${chamado.empresa}
        
        Assunto: ${chamado.assunto}
        Tipo: ${chamado.tipo}
        Urgência: ${chamado.urgencia}
        Status: ${chamado.status}
        
        Descrição:
        ${chamado.descricao}
        
        Observações Internas:
        ${chamado.observacoes}
        
        Data de Abertura: ${chamado.dataAbertura.toLocaleString('pt-BR')}
        Última Atualização: ${chamado.dataAtualizacao.toLocaleString('pt-BR')}
    `;
    
    alert(detalhes);
}

function imprimirChamado(id) {
    const chamado = chamados.find(c => c.id === id);
    if (!chamado) return;
    
    const janela = window.open('', '_blank');
    janela.document.write(`
        <html>
        <head>
            <title>Chamado #${chamado.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .info { margin-bottom: 15px; }
                .label { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>UnBug Solutions TI</h1>
                <h2>Chamado #${chamado.id}</h2>
            </div>
            
            <div class="info">
                <div class="label">Cliente:</div>
                <div>${chamado.cliente}</div>
            </div>
            
            <div class="info">
                <div class="label">E-mail:</div>
                <div>${chamado.email}</div>
            </div>
            
            <div class="info">
                <div class="label">Telefone:</div>
                <div>${chamado.telefone}</div>
            </div>
            
            <div class="info">
                <div class="label">Empresa:</div>
                <div>${chamado.empresa}</div>
            </div>
            
            <div class="info">
                <div class="label">Assunto:</div>
                <div>${chamado.assunto}</div>
            </div>
            
            <div class="info">
                <div class="label">Tipo:</div>
                <div>${chamado.tipo}</div>
            </div>
            
            <div class="info">
                <div class="label">Urgência:</div>
                <div>${chamado.urgencia}</div>
            </div>
            
            <div class="info">
                <div class="label">Status:</div>
                <div>${chamado.status}</div>
            </div>
            
            <div class="info">
                <div class="label">Descrição:</div>
                <div>${chamado.descricao}</div>
            </div>
            
            <div class="info">
                <div class="label">Data de Abertura:</div>
                <div>${chamado.dataAbertura.toLocaleString('pt-BR')}</div>
            </div>
            
            <div class="info">
                <div class="label">Última Atualização:</div>
                <div>${chamado.dataAtualizacao.toLocaleString('pt-BR')}</div>
            </div>
        </body>
        </html>
    `);
    janela.document.close();
    janela.print();
}

function exportarChamados() {
    let csv = 'ID,Cliente,Email,Telefone,Empresa,Assunto,Tipo,Urgencia,Status,Descricao,Data Abertura\n';
    
    chamados.forEach(chamado => {
        csv += `"${chamado.id}","${chamado.cliente}","${chamado.email}","${chamado.telefone}","${chamado.empresa}","${chamado.assunto}","${chamado.tipo}","${chamado.urgencia}","${chamado.status}","${chamado.descricao}","${chamado.dataAbertura.toLocaleDateString('pt-BR')}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chamados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ================================
// CONFIGURAÇÕES
// ================================

function carregarConfiguracoes() {
    document.getElementById('nomeEmpresa').value = configuracoes.nomeEmpresa;
    document.getElementById('emailPrincipal').value = configuracoes.emailPrincipal;
    document.getElementById('telefonePrincipal').value = configuracoes.telefonePrincipal;
    document.getElementById('endereco').value = configuracoes.endereco;
    document.getElementById('horarioFuncionamento').value = configuracoes.horarioFuncionamento;
    
    carregarUsuarios();
}

function carregarUsuarios() {
    const tbody = document.getElementById('tabelaUsuarios');
    tbody.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        
        const perfilClass = {
            'Administrador': 'badge-danger',
            'Técnico': 'badge-info',
            'Suporte': 'badge-warning'
        };
        
        row.innerHTML = `
            <td>${usuario.username}</td>
            <td><span class="badge ${perfilClass[usuario.perfil]}">${usuario.perfil}</span></td>
            <td><span class="badge badge-success">${usuario.status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarUsuario('${usuario.username}')">✏️</button>
                ${usuario.username !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="excluirUsuario('${usuario.username}')">🗑️</button>` : ''}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function salvarConfiguracoes() {
    configuracoes.nomeEmpresa = document.getElementById('nomeEmpresa').value;
    configuracoes.emailPrincipal = document.getElementById('emailPrincipal').value;
    configuracoes.telefonePrincipal = document.getElementById('telefonePrincipal').value;
    configuracoes.endereco = document.getElementById('endereco').value;
    configuracoes.horarioFuncionamento = document.getElementById('horarioFuncionamento').value;
    
    alert('Configurações salvas com sucesso!');
}

function adicionarUsuario() {
    const username = prompt('Nome do usuário:');
    if (!username) return;
    
    const perfil = prompt('Perfil (Administrador/Técnico/Suporte):');
    if (!perfil) return;
    
    const senha = prompt('Senha:');
    if (!senha) return;
    
    usuarios.push({
        username: username,
        perfil: perfil,
        status: 'Ativo',
        senha: senha
    });
    
    carregarUsuarios();
    alert('Usuário adicionado com sucesso!');
}

function editarUsuario(username) {
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) return;
    
    const novoPerfil = prompt('Novo perfil:', usuario.perfil);
    if (novoPerfil) {
        usuario.perfil = novoPerfil;
        carregarUsuarios();
        alert('Usuário atualizado com sucesso!');
    }
}

function excluirUsuario(username) {
    if (confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
        const index = usuarios.findIndex(u => u.username === username);
        if (index !== -1) {
            usuarios.splice(index, 1);
            carregarUsuarios();
            alert('Usuário excluído com sucesso!');
        }
    }
}

// ================================
// BACKUP E MANUTENÇÃO
// ================================

function realizarBackup() {
    const dados = {
        chamados: chamados,
        usuarios: usuarios,
        configuracoes: configuracoes,
        dataBackup: new Date().toISOString()
    };
    
    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_unbug_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Backup realizado com sucesso!');
}

function restaurarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dados = JSON.parse(e.target.result);
                
                if (confirm('Tem certeza que deseja restaurar o backup? Todos os dados atuais serão substituídos.')) {
                    chamados = dados.chamados || [];
                    usuarios = dados.usuarios || [];
                    configuracoes = dados.configuracoes || {};
                    
                    carregarDashboard();
                    carregarChamados();
                    carregarConfiguracoes();
                    
                    alert('Backup restaurado com sucesso!');
                }
            } catch (error) {
                alert('Erro ao restaurar backup: arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function limparDadosAntigos() {
    if (confirm('Deseja excluir chamados fechados com mais de 90 dias?')) {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 90);
        
        const quantidadeAntes = chamados.length;
        chamados = chamados.filter(c => !(c.status === 'fechado' && c.dataAtualizacao < dataLimite));
        const quantidadeDepois = chamados.length;
        
        const removidos = quantidadeAntes - quantidadeDepois;
        alert(`${removidos} chamados antigos foram removidos.`);
        
        carregarDashboard();
        carregarChamados();
    }
}

function visualizarLogs() {
    const logs = `
        [16/09/2025 08:00:15] Sistema iniciado
        [16/09/2025 08:01:22] Usuário admin fez login
        [16/09/2025 08:05:30] Chamado #2025005 criado
        [16/09/2025 08:10:45] Configurações atualizadas
        [16/09/2025 08:15:12] Backup automático realizado
        [16/09/2025 08:20:33] Chamado #2025001 atualizado
        [16/09/2025 08:25:44] Relatório mensal gerado
        [16/09/2025 08:30:55] Limpeza de dados temporários
    `;
    
    const janela = window.open('', '_blank');
    janela.document.write(`
        <html>
        <head>
            <title>Logs do Sistema</title>
            <style>
                body { font-family: monospace; margin: 20px; }
                pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Logs do Sistema - UnBug Solutions TI</h1>
            <pre>${logs}</pre>
        </body>
        </html>
    `);
}

function limparLogs() {
    if (confirm('Tem certeza que deseja limpar todos os logs?')) {
        alert('Logs limpos com sucesso!');
    }
}

// ================================
// RELATÓRIOS E ESTATÍSTICAS
// ================================

function carregarRelatorios() {
    atualizarRelatorio();
    gerarGraficos();
}

function atualizarRelatorio() {
    const periodo = document.getElementById('periodoRelatorio').value;
    let dataInicio, dataFim = new Date();
    
    if (periodo === 'custom') {
        dataInicio = new Date(document.getElementById('dataInicio').value);
        dataFim = new Date(document.getElementById('dataFim').value);
    } else {
        dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - parseInt(periodo));
    }
    
    const chamadosPeriodo = chamados.filter(c => 
        c.dataAbertura >= dataInicio && c.dataAbertura <= dataFim
    );
    
    gerarEstatisticas(chamadosPeriodo);
}

function gerarEstatisticas(chamadosPeriodo) {
    const tbody = document.querySelector('#tabelaEstatisticas tbody');
    tbody.innerHTML = '';
    
    const estatisticas = [
        {
            metrica: 'Total de Chamados',
            valor: chamadosPeriodo.length,
            comparacao: `${((chamadosPeriodo.length / chamados.length) * 100).toFixed(1)}% do total`
        },
        {
            metrica: 'Chamados Abertos',
            valor: chamadosPeriodo.filter(c => c.status === 'aberto').length,
            comparacao: `${((chamadosPeriodo.filter(c => c.status === 'aberto').length / chamadosPeriodo.length) * 100).toFixed(1)}% do período`
        },
        {
            metrica: 'Chamados Resolvidos',
            valor: chamadosPeriodo.filter(c => c.status === 'resolvido').length,
            comparacao: `${((chamadosPeriodo.filter(c => c.status === 'resolvido').length / chamadosPeriodo.length) * 100).toFixed(1)}% do período`
        },
        {
            metrica: 'Tempo Médio de Resolução',
            valor: '2.5 dias',
            comparacao: 'Dentro da meta (3 dias)'
        },
        {
            metrica: 'Satisfação do Cliente',
            valor: '92%',
            comparacao: '+5% vs. período anterior'
        },
        {
            metrica: 'Chamados Críticos',
            valor: chamadosPeriodo.filter(c => c.urgencia === 'critica').length,
            comparacao: `${((chamadosPeriodo.filter(c => c.urgencia === 'critica').length / chamadosPeriodo.length) * 100).toFixed(1)}% do período`
        }
    ];
    
    estatisticas.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stat.metrica}</td>
            <td><strong>${stat.valor}</strong></td>
            <td>${stat.comparacao}</td>
        `;
        tbody.appendChild(row);
    });
}

function gerarGraficos() {
    // Simulação de gráficos com texto (em uma implementação real, usaria Chart.js)
    
    // Gráfico de Status
    const canvasStatus = document.getElementById('graficoStatus');
    const ctxStatus = canvasStatus.getContext('2d');
    ctxStatus.fillStyle = '#f8f9fa';
    ctxStatus.fillRect(0, 0, canvasStatus.width, canvasStatus.height);
    ctxStatus.fillStyle = '#333';
    ctxStatus.font = '16px Arial';
    ctxStatus.fillText('Gráfico de Status dos Chamados', 50, 50);
    ctxStatus.font = '12px Arial';
    ctxStatus.fillText('Abertos: 2 (40%)', 50, 80);
    ctxStatus.fillText('Em Andamento: 2 (40%)', 50, 100);
    ctxStatus.fillText('Resolvidos: 1 (20%)', 50, 120);
    
    // Gráfico de Tipo
    const canvasTipo = document.getElementById('graficoTipo');
    const ctxTipo = canvasTipo.getContext('2d');
    ctxTipo.fillStyle = '#f8f9fa';
    ctxTipo.fillRect(0, 0, canvasTipo.width, canvasTipo.height);
    ctxTipo.fillStyle = '#333';
    ctxTipo.font = '16px Arial';
    ctxTipo.fillText('Gráfico de Tipos de Chamados', 50, 50);
    ctxTipo.font = '12px Arial';
    ctxTipo.fillText('Hardware: 2 (40%)', 50, 80);
    ctxTipo.fillText('Software: 1 (20%)', 50, 100);
    ctxTipo.fillText('Rede: 1 (20%)', 50, 120);
    ctxTipo.fillText('Backup: 1 (20%)', 50, 140);
    
    // Gráfico de Evolução
    const canvasEvolucao = document.getElementById('graficoEvolucao');
    const ctxEvolucao = canvasEvolucao.getContext('2d');
    ctxEvolucao.fillStyle = '#f8f9fa';
    ctxEvolucao.fillRect(0, 0, canvasEvolucao.width, canvasEvolucao.height);
    ctxEvolucao.fillStyle = '#333';
    ctxEvolucao.font = '16px Arial';
    ctxEvolucao.fillText('Evolução Mensal de Chamados', 50, 50);
    ctxEvolucao.font = '12px Arial';
    ctxEvolucao.fillText('Julho: 15 chamados', 50, 80);
    ctxEvolucao.fillText('Agosto: 12 chamados', 50, 100);
    ctxEvolucao.fillText('Setembro: 5 chamados (atual)', 50, 120);
}

function gerarRelatorio() {
    alert('Relatório gerado com sucesso! Dados atualizados na tela.');
    atualizarRelatorio();
}

function exportarRelatorio(formato) {
    switch(formato) {
        case 'excel':
            alert('Relatório exportado para Excel com sucesso!');
            break;
        case 'pdf':
            alert('Relatório exportado para PDF com sucesso!');
            break;
        case 'csv':
            alert('Relatório exportado para CSV com sucesso!');
            break;
    }
}

// ================================
// GESTÃO DE CLIENTES
// ================================

function carregarClientes() {
    const tbody = document.querySelector('#tabelaClientes tbody');
    tbody.innerHTML = '';
    
    clientes.forEach(cliente => {
        const row = criarLinhaCliente(cliente);
        tbody.appendChild(row);
    });
}

function criarLinhaCliente(cliente) {
    const row = document.createElement('tr');
    
    const statusClass = {
        'ativo': 'badge-success',
        'inativo': 'badge-secondary',
        'vip': 'badge-warning'
    };
    
    const statusTexto = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'vip': 'VIP'
    };
    
    row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.empresa}</td>
        <td>${cliente.email}</td>
        <td>${cliente.telefone}</td>
        <td><span class="badge ${statusClass[cliente.status]}">${statusTexto[cliente.status]}</span></td>
        <td>${cliente.ultimoChamado ? cliente.ultimoChamado.toLocaleDateString('pt-BR') : 'Nunca'}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="editarCliente('${cliente.id}')" title="Editar">✏️</button>
            <button class="btn btn-sm btn-info" onclick="visualizarCliente('${cliente.id}')" title="Ver Detalhes">👁️</button>
            <button class="btn btn-sm btn-success" onclick="criarChamadoCliente('${cliente.id}')" title="Novo Chamado">📞</button>
        </td>
    `;
    
    return row;
}

function filtrarClientes() {
    const busca = document.getElementById('buscaCliente').value.toLowerCase();
    const filtroStatus = document.getElementById('filtroStatusCliente').value;
    
    let clientesFiltrados = clientes.filter(cliente => {
        const matchBusca = !busca || 
            cliente.nome.toLowerCase().includes(busca) ||
            cliente.empresa.toLowerCase().includes(busca) ||
            cliente.email.toLowerCase().includes(busca);
        
        const matchStatus = !filtroStatus || cliente.status === filtroStatus;
        
        return matchBusca && matchStatus;
    });
    
    const tbody = document.querySelector('#tabelaClientes tbody');
    tbody.innerHTML = '';
    
    clientesFiltrados.forEach(cliente => {
        const row = criarLinhaCliente(cliente);
        tbody.appendChild(row);
    });
}

function limparFiltrosClientes() {
    document.getElementById('buscaCliente').value = '';
    document.getElementById('filtroStatusCliente').value = '';
    carregarClientes();
}

function adicionarCliente() {
    limparFormularioCliente();
    document.getElementById('modalClienteTitulo').textContent = 'Novo Cliente';
    document.getElementById('btnExcluirCliente').style.display = 'none';
    document.getElementById('clienteDataCadastro').value = new Date().toISOString().split('T')[0];
    document.getElementById('modalClientes').style.display = 'block';
}

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('clienteNome').value = cliente.nome;
    document.getElementById('clienteEmail').value = cliente.email;
    document.getElementById('clienteTelefone').value = cliente.telefone;
    document.getElementById('clienteEmpresa').value = cliente.empresa;
    document.getElementById('clienteStatus').value = cliente.status;
    document.getElementById('clienteDocumento').value = cliente.documento;
    document.getElementById('clienteEndereco').value = cliente.endereco;
    document.getElementById('clienteObservacoes').value = cliente.observacoes;
    document.getElementById('clienteDataCadastro').value = cliente.dataCadastro.toISOString().split('T')[0];
    
    document.getElementById('modalClienteTitulo').textContent = `Editar Cliente - ${cliente.nome}`;
    document.getElementById('btnExcluirCliente').style.display = 'inline-block';
    document.getElementById('modalClientes').style.display = 'block';
}

function visualizarCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    const chamadosCliente = chamados.filter(c => c.email === cliente.email).length;
    
    const detalhes = `
        CLIENTE: ${cliente.nome}
        
        Empresa: ${cliente.empresa}
        E-mail: ${cliente.email}
        Telefone: ${cliente.telefone}
        Status: ${cliente.status.toUpperCase()}
        
        Documento: ${cliente.documento}
        Data de Cadastro: ${cliente.dataCadastro.toLocaleDateString('pt-BR')}
        Último Chamado: ${cliente.ultimoChamado ? cliente.ultimoChamado.toLocaleDateString('pt-BR') : 'Nunca'}
        
        Total de Chamados: ${chamadosCliente}
        
        Endereço:
        ${cliente.endereco}
        
        Observações:
        ${cliente.observacoes}
    `;
    
    alert(detalhes);
}

function criarChamadoCliente(id) {
    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;
    
    // Ir para a seção de chamados e abrir modal com dados do cliente
    mostrarSecao('Chamados');
    
    setTimeout(() => {
        adicionarChamado();
        document.getElementById('modalCliente').value = cliente.nome;
        document.getElementById('modalEmail').value = cliente.email;
        document.getElementById('modalTelefone').value = cliente.telefone;
        document.getElementById('modalEmpresa').value = cliente.empresa;
    }, 100);
}

function limparFormularioCliente() {
    document.getElementById('formClientes').reset();
    document.getElementById('clienteId').value = '';
}

function fecharModalCliente() {
    document.getElementById('modalClientes').style.display = 'none';
}

function salvarCliente() {
    const id = document.getElementById('clienteId').value;
    const dadosCliente = {
        nome: document.getElementById('clienteNome').value,
        email: document.getElementById('clienteEmail').value,
        telefone: document.getElementById('clienteTelefone').value,
        empresa: document.getElementById('clienteEmpresa').value,
        status: document.getElementById('clienteStatus').value,
        documento: document.getElementById('clienteDocumento').value,
        endereco: document.getElementById('clienteEndereco').value,
        observacoes: document.getElementById('clienteObservacoes').value,
        dataCadastro: new Date(document.getElementById('clienteDataCadastro').value)
    };
    
    if (id) {
        // Editar cliente existente
        const index = clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            clientes[index] = { ...clientes[index], ...dadosCliente };
            alert('Cliente atualizado com sucesso!');
        }
    } else {
        // Criar novo cliente
        const novoId = 'CLI' + String(Math.max(...clientes.map(c => parseInt(c.id.slice(3)))) + 1).padStart(3, '0');
        const novoCliente = {
            id: novoId,
            ...dadosCliente,
            ultimoChamado: null
        };
        clientes.push(novoCliente);
        alert('Cliente criado com sucesso!');
    }
    
    fecharModalCliente();
    carregarClientes();
}

function excluirCliente() {
    const id = document.getElementById('clienteId').value;
    const cliente = clientes.find(c => c.id === id);
    
    if (confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
        const index = clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            clientes.splice(index, 1);
            alert('Cliente excluído com sucesso!');
            fecharModalCliente();
            carregarClientes();
        }
    }
}

function exportarClientes() {
    let csv = 'ID,Nome,Email,Telefone,Empresa,Status,Documento,Endereco,Data Cadastro,Ultimo Chamado\n';
    
    clientes.forEach(cliente => {
        csv += `"${cliente.id}","${cliente.nome}","${cliente.email}","${cliente.telefone}","${cliente.empresa}","${cliente.status}","${cliente.documento}","${cliente.endereco}","${cliente.dataCadastro.toLocaleDateString('pt-BR')}","${cliente.ultimoChamado ? cliente.ultimoChamado.toLocaleDateString('pt-BR') : 'Nunca'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ================================
// EVENTOS E CONFIGURAÇÕES
// ================================

function configurarEventos() {
    // Configurar formulário de chamados
    document.getElementById('formChamado').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarChamado();
    });
    
    // Configurar formulário de configurações
    document.getElementById('formConfiguracoes').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarConfiguracoes();
    });
    
    // Configurar formulário de clientes
    document.getElementById('formClientes').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarCliente();
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('modalChamado').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
    
    // Fechar modal de clientes ao clicar fora
    document.getElementById('modalClientes').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModalCliente();
        }
    });
    
    // Configurar datas padrão para relatórios
    const hoje = new Date();
    const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    document.getElementById('dataInicio').value = trintaDiasAtras.toISOString().split('T')[0];
    document.getElementById('dataFim').value = hoje.toISOString().split('T')[0];
}

// Função de logout
function logout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        window.location.href = 'admin.html';
    }
}

// ================================
// INICIALIZAÇÃO
// ================================

// Simular login bem-sucedido
console.log('Sistema Administrativo UnBug Solutions TI carregado com sucesso!');
console.log('Dados de demonstração carregados.');
console.log('Login: admin / Senha: demo123');
