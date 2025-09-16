// Chamados.js - Sistema de envio de chamados via EmailJS
// Configuração do EmailJS (você precisará configurar sua conta)

// Inicializar EmailJS quando a página carregar
(function() {
    // Substitua 'YOUR_PUBLIC_KEY' pela sua chave pública do EmailJS
    // Para obter: https://www.emailjs.com/
    emailjs.init('YOUR_PUBLIC_KEY'); 
})();

// Configuração do serviço (substitua pelos seus IDs do EmailJS)
const EMAIL_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',
    templateID: 'YOUR_TEMPLATE_ID'
};

// Variáveis globais
let formEnviado = false;

// Quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema de chamados carregado');
    
    // Configurar máscara de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // Configurar envio do formulário
    const form = document.getElementById('chamadoForm');
    if (form) {
        form.addEventListener('submit', enviarChamado);
    }

    // Verificar se EmailJS está disponível
    if (typeof emailjs === 'undefined') {
        mostrarMensagem('⚠️ Sistema de e-mail não configurado. Configure o EmailJS para envio automático.', 'warning');
    }
});

// Função para enviar chamado
async function enviarChamado(event) {
    event.preventDefault();
    
    if (formEnviado) {
        mostrarMensagem('⚠️ Aguarde! Um chamado já está sendo enviado.', 'warning');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('chamadoForm');
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Desabilitar botão e mostrar loading
    formEnviado = true;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Enviando...';
    
    try {
        // Coletar dados do formulário
        const dadosFormulario = coletarDadosFormulario();
        
        // Verificar se EmailJS está configurado
        if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.serviceID !== 'YOUR_SERVICE_ID') {
            // Tentar enviar via EmailJS
            await enviarViaEmailJS(dadosFormulario);
        } else {
            // Simular envio (para demonstração)
            await simularEnvio(dadosFormulario);
        }
        
        // Sucesso
        mostrarMensagem(
            '✅ Chamado enviado com sucesso! Nossa equipe entrará em contato em breve.', 
            'success'
        );
        
        // Limpar formulário após sucesso
        setTimeout(() => {
            limparFormulario();
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao enviar chamado:', error);
        
        // Mostrar opções alternativas em caso de erro
        mostrarMensagemComAlternativas();
        
    } finally {
        // Reabilitar botão
        formEnviado = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = '📩 Enviar Chamado';
    }
}

// Função para coletar dados do formulário
function coletarDadosFormulario() {
    return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        empresa: document.getElementById('empresa').value,
        tipo_problema: document.getElementById('tipo_problema').value,
        urgencia: document.getElementById('urgencia').value,
        assunto: document.getElementById('assunto').value,
        descricao: document.getElementById('descricao').value,
        ambiente: document.getElementById('ambiente').value,
        data_hora: new Date().toLocaleString('pt-BR'),
        numero_chamado: gerarNumeroChamado()
    };
}

// Função para enviar via EmailJS
async function enviarViaEmailJS(dados) {
    const templateParams = {
        to_email: 'contato@unbugsolutions.com.br', // E-mail de destino
        from_name: dados.nome,
        from_email: dados.email,
        phone: dados.telefone,
        company: dados.empresa,
        problem_type: dados.tipo_problema,
        urgency: dados.urgencia,
        subject: dados.assunto,
        description: dados.descricao,
        environment: dados.ambiente,
        ticket_number: dados.numero_chamado,
        date_time: dados.data_hora
    };

    const response = await emailjs.send(
        EMAIL_CONFIG.serviceID,
        EMAIL_CONFIG.templateID,
        templateParams
    );

    if (response.status !== 200) {
        throw new Error('Falha no envio do e-mail');
    }
    
    // Salvar no localStorage para histórico local
    salvarChamadoLocal(dados);
}

// Função para simular envio (demonstração)
async function simularEnvio(dados) {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Salvar no localStorage
    salvarChamadoLocal(dados);
    
    console.log('Chamado simulado enviado:', dados);
}

// Função para salvar chamado no localStorage
function salvarChamadoLocal(dados) {
    let chamados = JSON.parse(localStorage.getItem('chamados') || '[]');
    
    const chamado = {
        ...dados,
        id: chamados.length + 1,
        status: 'enviado',
        data_envio: new Date().toISOString()
    };
    
    chamados.push(chamado);
    localStorage.setItem('chamados', JSON.stringify(chamados));
}

// Função para gerar número do chamado
function gerarNumeroChamado() {
    const ano = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `CH${ano}${timestamp}`;
}

// Função para mostrar mensagem
function mostrarMensagem(mensagem, tipo = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    
    statusDiv.className = `alert alert-${tipo}`;
    statusDiv.innerHTML = mensagem;
    statusDiv.style.display = 'block';
    
    // Scroll para a mensagem
    statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Ocultar automaticamente após 8 segundos para mensagens de sucesso
    if (tipo === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 8000);
    }
}

// Função para mostrar mensagem com alternativas de contato
function mostrarMensagemComAlternativas() {
    const mensagem = `
        <div>
            <h4>⚠️ Não foi possível enviar automaticamente</h4>
            <p><strong>Mas não se preocupe!</strong> Entre em contato conosco por um destes meios:</p>
            <div style="margin: 20px 0;">
                <a href="tel:11999990000" class="btn btn-danger" style="margin-right: 10px;">
                    📞 (11) 99999-0000
                </a>
                <a href="mailto:contato@unbugsolutions.com.br?subject=Chamado de Suporte&body=Por favor, inclua uma descrição detalhada do seu problema." 
                   class="btn btn-primary" style="margin-right: 10px;">
                    📧 Enviar E-mail
                </a>
                <a href="https://wa.me/5511999990000" target="_blank" class="btn btn-success">
                    📱 WhatsApp
                </a>
            </div>
            <p style="font-size: 0.9rem; color: #666;">
                <strong>Dica:</strong> Copie as informações do formulário antes de sair da página para não perdê-las.
            </p>
        </div>
    `;
    
    mostrarMensagem(mensagem, 'warning');
}

// Função para limpar formulário
function limparFormulario() {
    const form = document.getElementById('chamadoForm');
    if (form) {
        form.reset();
        
        // Focar no primeiro campo
        const primeiroInput = form.querySelector('input[type="text"]');
        if (primeiroInput) {
            primeiroInput.focus();
        }
    }
    
    // Ocultar mensagem de status
    const statusDiv = document.getElementById('statusMessage');
    if (statusDiv) {
        statusDiv.style.display = 'none';
    }
}

// Função para copiar dados do formulário (útil em caso de erro)
function copiarDadosFormulario() {
    const dados = coletarDadosFormulario();
    
    let texto = `DADOS DO CHAMADO:\n\n`;
    texto += `Nome: ${dados.nome}\n`;
    texto += `E-mail: ${dados.email}\n`;
    texto += `Telefone: ${dados.telefone}\n`;
    texto += `Empresa: ${dados.empresa}\n`;
    texto += `Tipo: ${dados.tipo_problema}\n`;
    texto += `Urgência: ${dados.urgencia}\n`;
    texto += `Assunto: ${dados.assunto}\n`;
    texto += `Descrição: ${dados.descricao}\n`;
    texto += `Ambiente: ${dados.ambiente}\n`;
    texto += `Data/Hora: ${dados.data_hora}\n`;
    
    // Tentar copiar para clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarMensagem('✅ Dados copiados para a área de transferência!', 'success');
        });
    } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        mostrarMensagem('✅ Dados copiados para a área de transferência!', 'success');
    }
}

// Adicionar botão para copiar dados (em caso de erro)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chamadoForm');
    if (form) {
        const botaoCopiar = document.createElement('button');
        botaoCopiar.type = 'button';
        botaoCopiar.className = 'btn btn-info';
        botaoCopiar.innerHTML = '📋 Copiar Dados';
        botaoCopiar.onclick = copiarDadosFormulario;
        botaoCopiar.style.marginLeft = '15px';
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.parentNode.appendChild(botaoCopiar);
    }
});
