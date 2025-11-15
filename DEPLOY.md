# 🚀 Guia de Deploy - Vercel

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Repositório no GitHub/GitLab/Bitbucket
3. Node.js 18+ instalado localmente (para testar)

## Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Adiciona versão web do Sprite Packer"
git push origin main
```

### 2. Deploy via Dashboard do Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe seu repositório
4. O Vercel detectará automaticamente que é um projeto Nuxt 3
5. Configure:
   - **Framework Preset**: Nuxt.js (deve detectar automaticamente)
   - **Build Command**: `npm run build` (padrão)
   - **Output Directory**: `.output/public` (padrão)
   - **Install Command**: `npm install` (padrão)
6. Clique em **"Deploy"**

### 3. Deploy via CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# No diretório do projeto
vercel

# Siga as instruções:
# - Login (se necessário)
# - Link ao projeto existente ou criar novo
# - Confirmar configurações
```

### 4. Variáveis de Ambiente (se necessário)

Se precisar de variáveis de ambiente:
1. Vá em **Settings** > **Environment Variables**
2. Adicione as variáveis necessárias
3. Faça um novo deploy

## Configurações Automáticas

O arquivo `vercel.json` já está configurado com:
- Build command correto
- Output directory correto
- Framework detection

## Verificações Pós-Deploy

Após o deploy, verifique:
- ✅ Site está acessível
- ✅ Upload de arquivos funciona
- ✅ Processamento de imagens funciona
- ✅ Download do sprite sheet funciona

## Domínio Personalizado

1. Vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Siga as instruções de DNS

## Troubleshooting

### Build falha
- Verifique se `node_modules` está no `.gitignore`
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique os logs de build no Vercel

### Erro de módulo não encontrado
- Execute `npm install` localmente e verifique se instala corretamente
- Verifique se todas as dependências estão listadas

### Erro de TypeScript
- O projeto usa TypeScript, mas o Vercel deve compilar automaticamente
- Se houver erros, verifique `nuxt.config.ts`

## Atualizações Futuras

Para atualizar o site:
1. Faça suas alterações
2. Commit e push para o repositório
3. O Vercel fará deploy automático (se configurado)
4. Ou faça deploy manual: `vercel --prod`

## Recursos do Vercel

- **Plano Gratuito**: Perfeito para este projeto
- **Deploy automático**: A cada push no branch principal
- **Preview deployments**: Para cada PR
- **Analytics**: Disponível no plano Pro

