# 🚀 Guia Completo de Deploy no Vercel

## 📋 Passo a Passo Completo

### 1️⃣ Preparar o Projeto Localmente

Primeiro, teste se está tudo funcionando:

```bash
# Instalar dependências
npm install

# Testar localmente
npm run dev
```

Acesse `http://localhost:3000` e teste se tudo funciona.

### 2️⃣ Criar Repositório no GitHub

Se ainda não tem um repositório:

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (ou **"+"** > **"New repository"**)
3. Nome: `sprite-packer-web` (ou o nome que preferir)
4. Marque como **Public** ou **Private**
5. **NÃO** marque "Initialize with README" (já temos arquivos)
6. Clique em **"Create repository"**

### 3️⃣ Fazer Upload dos Arquivos para o GitHub

No terminal, na pasta do projeto:

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Versão web do Sprite Packer - Pronto para deploy"

# Conectar ao repositório GitHub (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/sprite-packer-web.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**OU** use o GitHub Desktop ou arraste os arquivos pela interface web do GitHub.

### 4️⃣ Deploy no Vercel

#### Opção A: Via Dashboard (Mais Fácil) ⭐

1. **Acesse [vercel.com](https://vercel.com)**
   - Faça login com GitHub (recomendado)

2. **Clique em "Add New Project"** (ou **"New Project"**)

3. **Importe seu repositório**
   - Se não aparecer, clique em **"Adjust GitHub App Permissions"**
   - Selecione o repositório `sprite-packer-web`
   - Clique em **"Import"**

4. **Configurações do Projeto**
   - O Vercel detecta automaticamente que é Nuxt 3
   - **Framework Preset**: Nuxt.js (já vem selecionado)
   - **Root Directory**: `./` (deixe como está)
   - **Build Command**: `npm run build` (já vem)
   - **Output Directory**: `.output/public` (já vem)
   - **Install Command**: `npm install` (já vem)

5. **Clique em "Deploy"** 🚀

6. **Aguarde o build** (1-2 minutos)

7. **Pronto!** Seu site estará online em uma URL tipo:
   - `https://sprite-packer-web.vercel.app`
   - Ou `https://seu-projeto-aleatorio.vercel.app`

#### Opção B: Via CLI (Terminal)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# No diretório do projeto
cd C:\Users\Darcio\Desktop\sprite_packer

# Fazer login
vercel login

# Deploy
vercel

# Siga as perguntas:
# - Set up and deploy? Y
# - Which scope? (seu usuário)
# - Link to existing project? N (primeira vez)
# - Project name? sprite-packer-web
# - Directory? ./
# - Override settings? N

# Para fazer deploy em produção:
vercel --prod
```

### 5️⃣ Verificar se Funcionou

Após o deploy:

1. ✅ Acesse a URL fornecida pelo Vercel
2. ✅ Teste selecionar uma pasta
3. ✅ Teste gerar um sprite sheet
4. ✅ Teste o download

### 6️⃣ Configurar Domínio Personalizado (Opcional)

1. No Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio (ex: `spritepacker.com`)
3. Siga as instruções de DNS
4. Aguarde a propagação (pode levar algumas horas)

## 🔄 Atualizar o Site

Sempre que fizer mudanças:

```bash
# Fazer commit das mudanças
git add .
git commit -m "Descrição da mudança"
git push origin main
```

O Vercel faz deploy automático! 🎉

## ⚠️ Troubleshooting

### Erro: "Build Failed"

**Solução:**
- Verifique os logs no Vercel
- Certifique-se que `node_modules` está no `.gitignore`
- Teste `npm run build` localmente primeiro

### Erro: "Module not found"

**Solução:**
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente e veja se instala tudo

### Site não carrega

**Solução:**
- Verifique os logs de build no Vercel
- Veja se há erros no console do navegador
- Teste localmente primeiro com `npm run dev`

## 📝 Checklist Final

Antes de fazer deploy, certifique-se:

- [ ] `npm install` funciona sem erros
- [ ] `npm run dev` funciona localmente
- [ ] `npm run build` funciona sem erros
- [ ] Todos os arquivos estão commitados no Git
- [ ] Repositório está no GitHub
- [ ] `.gitignore` inclui `node_modules`

## 🎉 Pronto!

Seu site estará online e funcionando! Qualquer dúvida, me avise!

