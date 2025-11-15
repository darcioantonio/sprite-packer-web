<template>
  <div class="min-h-screen bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-cyan-400 mb-2">
          🎨 Sprite Packer PRO
        </h1>
        <p class="text-gray-400">Crie sprite sheets online de forma rápida e fácil</p>
      </div>

      <!-- Card Principal -->
      <div class="bg-gray-800 rounded-xl shadow-2xl p-6 mb-6">
        <!-- Upload Area -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-white mb-2">
            📁 Selecione a pasta com os sprites PNG:
          </label>
          <div class="flex items-center gap-3">
            <input
              ref="folderInput"
              type="file"
              webkitdirectory
              directory
              multiple
              accept="image/png"
              @change="handleFolderSelect"
              class="hidden"
            />
            <button
              @click="$refs.folderInput?.click()"
              class="btn-secondary"
            >
              📂 Selecionar Pasta
            </button>
            <span v-if="selectedFiles.length > 0" class="text-sm text-gray-400">
              {{ selectedFiles.length }} arquivo(s) encontrado(s)
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            Busca recursiva em todas as subpastas (igual ao Python)
          </p>
        </div>

        <!-- Lista de Arquivos -->
        <div v-if="selectedFiles.length > 0" class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-white">
              📦 Arquivos encontrados: {{ selectedFiles.length }}
            </span>
            <button
              @click="clearFiles"
              class="text-sm text-red-400 hover:text-red-300"
            >
              Limpar tudo
            </button>
          </div>
          <div class="max-h-40 overflow-y-auto space-y-1">
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between bg-gray-700 rounded px-3 py-2 text-sm"
            >
              <span class="text-gray-300 truncate flex-1" :title="file.webkitRelativePath || file.name">
                {{ getFilePath(file) }}
              </span>
              <button
                @click="removeFile(index)"
                class="text-red-400 hover:text-red-300 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <!-- Nome do arquivo de saída -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-white mb-2">
            💾 Nome do arquivo de saída:
          </label>
          <input
            v-model="outputFilename"
            type="text"
            placeholder="sprite-sheet.png"
            class="input-field w-full"
          />
        </div>

        <!-- Botão Gerar -->
        <button
          @click="generateSpriteSheet"
          :disabled="isProcessing || selectedFiles.length === 0"
          class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isProcessing">🚀 GERAR SPRITE SHEET</span>
          <span v-else>⏳ Processando...</span>
        </button>

        <!-- Barra de Progresso -->
        <div v-if="isProcessing" class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-cyan-400">
              {{ progressMessage }}
            </span>
            <span class="text-sm font-bold text-cyan-400">{{ progress }}%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-3">
            <div
              class="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="resultCanvas" class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-white">
              ✅ Sprite Sheet gerado!
            </span>
            <span class="text-xs text-gray-400">
              {{ resultWidth }} x {{ resultHeight }} px
            </span>
          </div>
          <div class="bg-gray-700 rounded-lg p-4 overflow-auto max-h-96">
            <img
              :src="resultCanvas.toDataURL()"
              alt="Sprite Sheet Preview"
              class="mx-auto"
            />
          </div>
          <button
            @click="downloadResult"
            class="btn-secondary w-full mt-4"
          >
            💾 Baixar Sprite Sheet
          </button>
        </div>

        <!-- Log -->
        <div v-if="logs.length > 0" class="mt-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-white">📋 Log:</span>
            <button
              @click="clearLogs"
              class="text-sm text-gray-400 hover:text-gray-300"
            >
              Limpar
            </button>
          </div>
          <div class="bg-gray-950 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="text-cyan-400 mb-1"
            >
              {{ log }}
            </div>
          </div>
        </div>
      </div>

      <!-- Info -->
      <div class="text-center text-sm text-gray-500">
        <p>
          ✨ Processamento de sprite sheet 100% no navegador - 
          Site Criado por 
          <a 
            href="https://wa.me/5514988035885" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            Darcio
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { packSprites, downloadCanvas, collectPngFiles } = useSpritePacker()

const folderInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>([])
const isProcessing = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const resultCanvas = ref<HTMLCanvasElement | null>(null)
const resultWidth = ref(0)
const resultHeight = ref(0)
const outputFilename = ref('sprite-sheet.png')
const logs = ref<string[]>([])

const getFilePath = (file: File) => {
  // Mostra o caminho relativo se disponível (webkitRelativePath)
  if ((file as any).webkitRelativePath) {
    return (file as any).webkitRelativePath
  }
  return file.name
}

const handleFolderSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    // Limpa arquivos anteriores
    selectedFiles.value = []
    clearLogs()
    
    // Processa pasta recursivamente (como no Python)
    collectPngFiles(Array.from(target.files), (msg) => {
      addLog(msg)
    }).then((pngFiles) => {
      selectedFiles.value = pngFiles
      addLog(`✅ Total: ${pngFiles.length} arquivo(s) PNG encontrado(s)`)
    })
  }
  // Limpa o input para permitir selecionar a mesma pasta novamente
  target.value = ''
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
  selectedFiles.value = []
  resultCanvas.value = null
  addLog('🗑️ Arquivos limpos')
}

const addLog = (message: string) => {
  logs.value.push(message)
  if (logs.value.length > 50) {
    logs.value.shift()
  }
}

const clearLogs = () => {
  logs.value = []
}

const generateSpriteSheet = async () => {
  if (selectedFiles.value.length === 0) {
    alert('Selecione pelo menos uma imagem!')
    return
  }

  isProcessing.value = true
  progress.value = 0
  resultCanvas.value = null
  clearLogs()

  try {
    const result = await packSprites(selectedFiles.value, (prog, msg) => {
      progress.value = prog
      progressMessage.value = msg
      addLog(msg)
    })

    resultCanvas.value = result.canvas
    resultWidth.value = result.width
    resultHeight.value = result.height
    addLog('✔ Sprite sheet gerado com sucesso!')
  } catch (error: any) {
    addLog(`❌ Erro: ${error.message}`)
    alert(`Erro ao gerar sprite sheet: ${error.message}`)
  } finally {
    isProcessing.value = false
  }
}

const downloadResult = () => {
  if (resultCanvas.value) {
    downloadCanvas(resultCanvas.value, outputFilename.value)
    addLog(`💾 Download iniciado: ${outputFilename.value}`)
  }
}
</script>

