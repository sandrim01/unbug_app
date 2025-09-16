# 📧 Configuração do EmailJS para o Sistema de Chamados

Para que o sistema de chamados funcione completamente e envie e-mails automaticamente, você precisa configurar o EmailJS (serviço gratuito).

## 🔧 Passos para Configuração:

### 1. Criar Conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie sua conta gratuita
3. Confirme seu e-mail

### 2. Configurar Serviço de E-mail
1. No painel do EmailJS, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta de e-mail
5. Anote o **Service ID** gerado

### 3. Criar Template de E-mail
1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Use este template:

```
Assunto: [CHAMADO] {{subject}} - {{ticket_number}}

Corpo:
Novo chamado recebido no site Unbug Solutions TI

DADOS DO CHAMADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Número: {{ticket_number}}
📅 Data/Hora: {{date_time}}

👤 CLIENTE:
Nome: {{from_name}}
E-mail: {{from_email}}
Telefone: {{phone}}
Empresa: {{company}}

🔧 PROBLEMA:
Tipo: {{problem_type}}
Urgência: {{urgency}}
Assunto: {{subject}}

📝 Descrição:
{{description}}

🏢 Ambiente/Localização:
{{environment}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Entre em contato com o cliente o mais rápido possível.

--
Sistema Unbug Solutions TI
```

4. Anote o **Template ID** gerado

### 4. Obter Chave Pública
1. Vá em "Account" > "General"
2. Copie sua **Public Key**

### 5. Configurar no Site
Abra o arquivo `public/js/chamados.js` e substitua:

```javascript
// Linha 4: Substitua YOUR_PUBLIC_KEY
emailjs.init('SUA_CHAVE_PUBLICA_AQUI'); 

// Linhas 7-10: Substitua os IDs
const EMAIL_CONFIG = {
    serviceID: 'SEU_SERVICE_ID_AQUI',
    templateID: 'SEU_TEMPLATE_ID_AQUI'
};
```

### 6. Configurar E-mail de Destino
No arquivo `chamados.js`, linha 120, altere:
```javascript
to_email: 'SEU_EMAIL@AQUI.COM', // Substitua pelo seu e-mail
```

## 🎯 Plano Gratuito do EmailJS:
- ✅ 200 e-mails por mês
- ✅ 2 serviços de e-mail
- ✅ Templates ilimitados
- ✅ Suporte básico

## 🔍 Teste a Configuração:
1. Salve os arquivos
2. Abra o site no navegador
3. Vá para a página "Abrir Chamado"
4. Preencha e envie um teste
5. Verifique se o e-mail chegou

## 🚨 Importante:
- Mantenha suas chaves em segurança
- Para produção, considere usar variáveis de ambiente
- O EmailJS funciona apenas em HTTPS em produção

## 📞 Alternativas se o EmailJS não funcionar:
- Botão direto para WhatsApp: `https://wa.me/5511999990000`
- Link mailto com dados pré-preenchidos
- Formulário que copia dados para clipboard
- Telefone de contato direto

## 🔗 Links Úteis:
- EmailJS Dashboard: https://dashboard.emailjs.com/
- Documentação: https://www.emailjs.com/docs/
- Suporte: https://www.emailjs.com/support/
