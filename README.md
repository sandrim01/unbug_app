# Unbug Solutions TI - Sistema de Assistência Técnica

Sistema completo para gerenciamento de chamados de assistência técnica em TI.

## 🚀 Funcionalidades

- ✅ Abertura de chamados por clientes
- ✅ Painel administrativo para gestão de chamados
- ✅ Sistema de autenticação seguro
- ✅ Interface responsiva
- ✅ Banco de dados PostgreSQL

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express
- **Banco:** PostgreSQL
- **Autenticação:** JWT

## 📋 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/sandrim01/unbug_app.git
cd unbug_app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```env
DATABASE_URL=postgresql://postgres:PQTJpzRcdjSykIybaOHTuNKIrrssJNvd@crossover.proxy.rlwy.net:30176/railway
JWT_SECRET=seu_jwt_secret_aqui
ADMIN_PASSWORD=sua_senha_admin_aqui
PORT=3000
```

4. Initialize o banco de dados:
```bash
npm run init-db
```

5. Execute o servidor:
```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

## 🌐 Acesso

- **Site principal:** http://localhost:3000
- **Abertura de chamados:** http://localhost:3000/chamados
- **Painel admin:** http://localhost:3000/admin

## 📱 Estrutura do Projeto

```
/
├── public/           # Arquivos estáticos
├── views/           # Páginas HTML
├── scripts/         # Scripts de banco
├── server.js        # Servidor principal
└── package.json     # Dependências
```

## 👥 Uso

### Para Clientes:
1. Acesse a página de chamados
2. Preencha o formulário com os detalhes do problema
3. Acompanhe o status pelo número do chamado

### Para Administradores:
1. Acesse /admin
2. Faça login com a senha configurada
3. Gerencie todos os chamados
4. Atualize status e adicione observações

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Rate limiting
- Proteção CORS
- Headers de segurança

## 📞 Contato

**Unbug Solutions TI**
- Website: Em breve
- Email: contato@unbugsolutions.com.br
