export interface ImageData {
  file: File
  name: string
  width: number
  height: number
  image: HTMLImageElement
}

export interface Position {
  image: ImageData
  x: number
  y: number
}

const ESPACO = 10

export const useSpritePacker = () => {
  const collectPngFiles = async (
    files: File[],
    onLog?: (message: string) => void
  ): Promise<File[]> => {
    onLog?.('🔍 Procurando arquivos PNG...')
    
    const pngFiles: File[] = []
    const foldersProcessed = new Set<string>()
    
    // Agrupa arquivos por pasta usando webkitRelativePath
    // Ordena para processar pastas em ordem
    const filesWithPath = files.map(file => ({
      file,
      webkitPath: (file as any).webkitRelativePath || file.name
    }))
    
    // Ordena por caminho para agrupar pastas
    filesWithPath.sort((a, b) => a.webkitPath.localeCompare(b.webkitPath))
    
    for (const { file, webkitPath } of filesWithPath) {
      // Extrai o caminho da pasta
      const folderPath = webkitPath.includes('/') 
        ? webkitPath.substring(0, webkitPath.lastIndexOf('/'))
        : '.'
      
      // Log da pasta se ainda não foi processada
      if (!foldersProcessed.has(folderPath)) {
        // Pega apenas o nome da pasta (basename)
        const folderName = folderPath.includes('/') 
          ? folderPath.substring(folderPath.lastIndexOf('/') + 1)
          : folderPath || 'raiz'
        onLog?.(`📁 Entrando na pasta: ${folderName}`)
        foldersProcessed.add(folderPath)
      }
      
      // Valida se é PNG
      if (file.name.toLowerCase().endsWith('.png')) {
        try {
          // Tenta validar a imagem (similar ao Python)
          pngFiles.push(file)
          onLog?.(`  ✔ Encontrado: ${file.name}`)
        } catch (error) {
          onLog?.(`  ⚠ Ignorado (erro): ${file.name}`)
        }
      }
    }
    
    return pngFiles
  }

  const loadImage = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        resolve({
          file,
          name: file.name,
          width: img.width,
          height: img.height,
          image: img
        })
        URL.revokeObjectURL(url)
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error(`Erro ao carregar ${file.name}`))
      }
      
      img.src = url
    })
  }

  const packSprites = async (
    files: File[],
    onProgress?: (progress: number, message: string) => void
  ): Promise<{ canvas: HTMLCanvasElement; width: number; height: number }> => {
    onProgress?.(0, '🧩 Carregando imagens...')
    
    // Carrega todas as imagens
    const images: ImageData[] = []
    for (let i = 0; i < files.length; i++) {
      try {
        const imgData = await loadImage(files[i])
        images.push(imgData)
        onProgress?.(
          Math.round(((i + 1) / files.length) * 30),
          `📦 Carregado: ${imgData.name}`
        )
      } catch (error) {
        onProgress?.(
          Math.round(((i + 1) / files.length) * 30),
          `⚠ Erro ao carregar: ${files[i].name}`
        )
      }
    }

    if (images.length === 0) {
      throw new Error('Nenhuma imagem válida foi carregada!')
    }

    onProgress?.(30, `📊 ${images.length} imagens carregadas com sucesso`)

    // Ordena pelas maiores primeiro (melhor encaixe)
    images.sort((a, b) => (b.width * b.height) - (a.width * a.height))

    onProgress?.(35, '🧠 Iniciando empacotamento skyline...')

    const linhas: Array<{ altura: number; larguraUsada: number }> = []
    const posicoes: Position[] = []
    let maxWidth = 0

    // Algoritmo skyline
    for (let idx = 0; idx < images.length; idx++) {
      const imgData = images[idx]
      const w = imgData.width
      const h = imgData.height
      let colocado = false

      // Tenta colocar em alguma linha existente
      for (let linhaIdx = 0; linhaIdx < linhas.length; linhaIdx++) {
        const linha = linhas[linhaIdx]
        if (linha.larguraUsada + w + ESPACO <= maxWidth) {
          // Cabe nesta linha
          const x = linha.larguraUsada
          const y = linhas.slice(0, linhaIdx).reduce((acc, l) => acc + l.altura + ESPACO, 0)

          posicoes.push({
            image: imgData,
            x: x + ESPACO,
            y: y + ESPACO
          })

          // Atualiza largura usada
          linha.larguraUsada += w + ESPACO
          colocado = true
          break
        }
      }

      // Não coube em nenhuma linha, criar nova linha
      if (!colocado) {
        const x = ESPACO
        const y = linhas.reduce((acc, l) => acc + l.altura + ESPACO, 0)

        posicoes.push({
          image: imgData,
          x,
          y
        })

        linhas.push({
          altura: h,
          larguraUsada: w + ESPACO
        })

        maxWidth = Math.max(maxWidth, w + ESPACO)
      }

      const progresso = 35 + Math.round(((idx + 1) / images.length) * 50)
      onProgress?.(
        progresso,
        `📐 Processando: ${imgData.name} (${idx + 1}/${images.length})`
      )
    }

    // Calcula altura final
    const totalHeight = linhas.reduce((acc, l) => acc + l.altura + ESPACO, 0)

    onProgress?.(85, `📐 Tamanho final: ${maxWidth + ESPACO} x ${totalHeight + ESPACO} pixels`)

    // Cria canvas
    const canvas = document.createElement('canvas')
    canvas.width = maxWidth + ESPACO
    canvas.height = totalHeight + ESPACO
    const ctx = canvas.getContext('2d')!

    // Limpa canvas (transparente)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    onProgress?.(90, '📦 Montando imagem final...')

    // Desenha todas as imagens
    for (let i = 0; i < posicoes.length; i++) {
      const { image, x, y } = posicoes[i]
      ctx.drawImage(image.image, x, y)
      
      const progresso = 90 + Math.round(((i + 1) / posicoes.length) * 10)
      onProgress?.(progresso, `🎨 Desenhando: ${image.name}`)
    }

    onProgress?.(100, '✔ Processo concluído!')

    return {
      canvas,
      width: canvas.width,
      height: canvas.height
    }
  }

  const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
    canvas.toBlob((blob) => {
      if (!blob) return
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return {
    collectPngFiles,
    packSprites,
    downloadCanvas
  }
}

