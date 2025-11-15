# 🎨 Sprite Packer PRO

Ferramenta completa para criar sprite sheets a partir de múltiplas imagens PNG. Disponível em duas versões:

- **Desktop**: Aplicação Python com interface gráfica (Tkinter)
- **Web**: Aplicação Nuxt 3 hospedável no Vercel

## 📦 Versão Desktop

### Requisitos
```bash
pip install pillow
```

### Como usar
```bash
python main.py
```

1. Selecione a pasta com os sprites PNG
2. Escolha onde salvar o arquivo final
3. Clique em "GERAR IMAGEM GIGANTE"

### Características
- ✅ Interface gráfica moderna com tema dark
- ✅ Busca recursiva de arquivos PNG
- ✅ Algoritmo de empacotamento skyline otimizado
- ✅ Barra de progresso em tempo real
- ✅ Log detalhado do processo
- ✅ Validação de imagens corrompidas
- ✅ Tratamento de erros robusto

## 🌐 Versão Web (Nuxt 3)

### Requisitos
```bash
node >= 18
npm ou yarn
```

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

Acesse `http://localhost:3000`

### Build para produção
```bash
npm run build
```

### Deploy no Vercel

1. **Conecte seu repositório GitHub ao Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório
   - O Vercel detecta automaticamente Nuxt 3

2. **Ou use a CLI do Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

### Características da versão web
- ✅ Processamento 100% no navegador (privacidade total)
- ✅ Interface responsiva e moderna
- ✅ Drag & drop de arquivos
- ✅ Preview do sprite sheet gerado
- ✅ Download direto do resultado
- ✅ Mesmo algoritmo skyline da versão desktop
- ✅ Sem limites de timeout (processamento no cliente)

## 🧠 Algoritmo

O projeto utiliza o algoritmo **Skyline** para empacotamento de sprites:
- Ordena imagens por tamanho (maiores primeiro)
- Tenta encaixar em linhas existentes
- Cria novas linhas quando necessário
- Espaçamento configurável entre imagens (padrão: 10px)

## 📁 Estrutura do Projeto

```
sprite_packer/
├── main.py                 # Versão desktop
├── requirements.txt        # Dependências Python
├── package.json            # Dependências Node.js
├── nuxt.config.ts          # Configuração Nuxt
├── app.vue                 # Página principal web
├── components/
│   └── SpritePacker.vue    # Componente principal
├── composables/
│   └── useSpritePacker.ts # Lógica de empacotamento
├── assets/
│   └── css/
│       └── main.css        # Estilos globais
└── vercel.json             # Configuração Vercel
```

## 🚀 Tecnologias

### Desktop
- Python 3
- Pillow (PIL)
- Tkinter

### Web
- Nuxt 3
- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Canvas API

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.
