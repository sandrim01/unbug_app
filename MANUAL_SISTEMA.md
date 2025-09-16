# 🛠️ Manual de Configuração e Uso - Unbug Solutions TI

## 📋 Resumo do Sistema

O sistema **Unbug Solutions TI** é uma aplicação web completa para gerenciamento de chamados de assistência técnica, desenvolvida com as tecnologias solicitadas:

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL (Railway)
- **Repositório**: https://github.com/sandrim01/unbug_app

## 🗄️ Banco de Dados

### Status Atual
✅ **Banco configurado e funcionando**
- Tabelas existentes foram limpas
- Nova estrutura criada com sucesso
- Dados de exemplo inseridos
- Conexão testada e validada

### Estrutura de Tabelas

#### Tabela: `chamados`
```sql
- id (SERIAL PRIMARY KEY)
- nome (VARCHAR 255, NOT NULL)
- email (VARCHAR 255, NOT NULL)
- telefone (VARCHAR 20)
- empresa (VARCHAR 255)
- tipo_problema (VARCHAR 100, DEFAULT 'geral')
- descricao (TEXT, NOT NULL)
- urgencia (ENUM: baixa, media, alta, critica)
- status (ENUM: aberto, em_andamento, aguardando_cliente, resolvido, fechado)
- observacoes_admin (TEXT)
- data_criacao (TIMESTAMP)
- data_atualizacao (TIMESTAMP)
```

### Índices Criados
- `idx_chamados_status` - Para filtros por status
- `idx_chamados_data_criacao` - Para ordenação cronológica
- `idx_chamados_email` - Para busca por email

## 🌐 Páginas do Sistema

### 1. Página Principal (`/`)
- **Arquivo**: `views/index.html`
- **Funcionalidades**:
  - Landing page da empresa
  - Apresentação dos serviços
  - Consulta de status de chamados
  - Informações de contato
  - Design responsivo

### 2. Abertura de Chamados (`/chamados`)
- **Arquivo**: `views/chamados.html`
- **Funcionalidades**:
  - Formulário completo para abertura de chamados
  - Validação em tempo real
  - Formatação automática de telefone
  - Feedback imediato de sucesso/erro
  - Proteção contra spam (rate limiting)

### 3. Painel Administrativo (`/admin`)
- **Arquivo**: `views/admin.html`
- **Funcionalidades**:
  - Login com senha (configurada em `.env`)
  - Dashboard com estatísticas
  - Lista completa de chamados
  - Filtros por status, urgência e busca
  - Edição de status e observações
  - Exclusão de chamados
  - Visualização detalhada

## 🔑 Credenciais de Acesso

### Administrador
- **URL**: http://localhost:3000/admin
- **Senha**: `UnbugAdmin2024!` (configurada no arquivo `.env`)

### Banco de Dados
- **URL**: `postgresql://postgres:PQTJpzRcdjSykIybaOHTuNKIrrssJNvd@crossover.proxy.rlwy.net:30176/railway`
- **Status**: ✅ Conectado e funcionando

## 🚀 Como Executar

### 1. Instalação (já executada)
```bash
npm install
```

### 2. Inicialização do Banco (já executada)
```bash
npm run init-db
```

### 3. Executar o Servidor
```bash
npm start
```

### 4. Acessar o Sistema
- **Site Principal**: http://localhost:3000
- **Abertura de Chamados**: http://localhost:3000/chamados
- **Painel Admin**: http://localhost:3000/admin

## 📊 Dados de Exemplo

O sistema já possui 5 chamados de exemplo com diferentes status:
1. **Chamado #1**: Hardware - Alta urgência - Aberto
2. **Chamado #2**: Software - Média urgência - Em andamento
3. **Chamado #3**: Rede - Crítica urgência - Aberto
4. **Chamado #4**: Email - Alta urgência - Resolvido
5. **Chamado #5**: Backup - Média urgência - Fechado

## 🔒 Segurança Implementada

- **Rate Limiting**: 5 chamados por IP a cada 10 minutos
- **Helmet**: Headers de segurança
- **CORS**: Configurado corretamente
- **JWT**: Autenticação de administradores
- **Validação**: Inputs sanitizados
- **SSL**: Conexão segura com banco PostgreSQL

## 📱 Funcionalidades do Sistema

### Para Clientes:
1. ✅ Abertura de chamados online 24/7
2. ✅ Consulta de status por número do chamado
3. ✅ Interface responsiva (mobile-friendly)
4. ✅ Validação automática de formulários

### Para Administradores:
1. ✅ Login seguro com senha
2. ✅ Dashboard com estatísticas em tempo real
3. ✅ Gestão completa de chamados
4. ✅ Filtros avançados (status, urgência, busca)
5. ✅ Edição de status e observações
6. ✅ Visualização detalhada de chamados
7. ✅ Exclusão de chamados

## 🌟 Recursos Técnicos

### Frontend:
- **CSS Grid/Flexbox**: Layout responsivo
- **JavaScript ES6+**: Funcionalidades modernas
- **Fetch API**: Comunicação com backend
- **LocalStorage**: Persistência de autenticação
- **Animações CSS**: Interface fluida

### Backend:
- **Express.js**: Framework web robusto
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação stateless
- **bcryptjs**: Hash de senhas
- **Rate Limiting**: Proteção contra abuso

## 📈 Estatísticas do Sistema

O painel administrativo exibe em tempo real:
- Total de chamados
- Chamados abertos
- Chamados em andamento
- Chamados resolvidos

## 🔧 Manutenção

### Logs do Sistema
O servidor exibe logs detalhados no console, incluindo:
- Conexões de banco
- Requisições HTTP
- Erros e exceções
- Autenticações

### Backup do Banco
O banco PostgreSQL está hospedado no Railway com backup automático.

### Atualizações
Para atualizar o código:
```bash
git pull origin main
npm install  # se houver novas dependências
npm restart  # se necessário
```

## 📞 Suporte Técnico

Para suporte técnico ou dúvidas sobre o sistema:
- **Sistema funcionando**: ✅ Testado e validado
- **Banco de dados**: ✅ Conectado e operacional
- **Todas as funcionalidades**: ✅ Implementadas e testadas

---

**Status do Projeto**: ✅ **COMPLETO E FUNCIONANDO**

O sistema está 100% operacional e pronto para uso em produção!
