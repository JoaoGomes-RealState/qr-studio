
import './style.css'
import QRCodeStyling from 'qr-code-styling'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <main class="container">
    <header>
      <h1>QR Studio</h1>
      <p>Cria QR Codes gratuitos, ilimitados e sem validade.</p>
    </header>

    <section class="editor">
      <label for="qr-text">Link ou texto</label>
      <input
        id="qr-text"
        type="text"
        placeholder="https://exemplo.pt"
        value=""
      />

<div class="colors">
  <div>
    <label for="qr-color">Cor do QR Code</label>
    <input type="color" id="qr-color" value="#172b4d" />
  </div>

  <div>
    <label for="bg-color">Cor de fundo</label>
    <input type="color" id="bg-color" value="#ffffff" />
  </div>
</div>

<div class="style-selector">
  <label for="qr-style">Estilo do QR Code</label>

  <select id="qr-style">
    <option value="square">Quadrados</option>
    <option value="rounded" selected>Arredondados</option>
    <option value="dots">Círculos</option>
    <option value="classy">Elegante</option>
    <option value="classy-rounded">Elegante arredondado</option>
    <option value="extra-rounded">Extra arredondado</option>
  </select>
</div>


<div class="logo-section">
  <label for="qr-logo">Logótipo personalizado</label>

  <input
    type="file"
    id="qr-logo"
    accept="image/png,image/jpeg,image/webp"
  />

<div class="logo-size">
  <label for="logo-size">
    Tamanho do logótipo:
    <span id="logo-size-value">25%</span>
  </label>

  <input
    type="range"
    id="logo-size"
    min="10"
    max="30"
    value="25"
    step="1"
  />
</div>

  <button type="button" id="remove-logo">
    Remover logótipo
  </button>

  <p class="logo-help">
    Escolhe uma imagem PNG, JPG ou WebP.
    Recomendamos imagens quadradas e com fundo transparente.
  </p>
</div>


      <div id="qr-preview"></div>

      <button id="generate">Gerar QR Code</button>
      <button id="download">Descarregar PNG</button>

<button id="download-svg">Descarregar SVG</button>

    </section>
  </main>
`

const qr = new QRCodeStyling({
  width: 300,
  height: 300,
  type: 'svg',
  data: '',
  margin: 12,
  qrOptions: {
    errorCorrectionLevel: 'H',
  },
  dotsOptions: {
    color: '#172b4d',
    type: 'rounded',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
})

qr.append(document.getElementById('qr-preview')!)

const input = document.querySelector<HTMLInputElement>('#qr-text')!
const generate = document.querySelector<HTMLButtonElement>('#generate')!
const download = document.querySelector<HTMLButtonElement>('#download')!

generate.addEventListener('click', () => {
  const value = input.value.trim()

  if (!value) {
    alert('Introduz um link ou texto.')
    return
  }

  qr.update({ data: value })
})

download.addEventListener('click', async () => {
  if (!input.value.trim()) {
    alert('Introduz um link ou texto.')
    return
  }

  qr.update({ data: input.value.trim() })
  await qr.download({
    name: 'qr-studio',
    extension: 'png',
  })
})

const qrColor = document.querySelector<HTMLInputElement>('#qr-color')!
const bgColor = document.querySelector<HTMLInputElement>('#bg-color')!

function updateColors() {
  qr.update({
    dotsOptions: {
      color: qrColor.value,
     type: qrStyle.value as
  | 'square'
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded',
    },
    backgroundOptions: {
      color: bgColor.value,
    },
  })
}

qrColor.addEventListener('input', updateColors)
bgColor.addEventListener('input', updateColors)


const qrStyle = document.querySelector<HTMLSelectElement>('#qr-style')!

qrStyle.addEventListener('change', () => {
  qr.update({
    dotsOptions: {
      color: qrColor.value,
      type: qrStyle.value as
        | 'square'
        | 'rounded'
        | 'dots'
        | 'classy'
        | 'classy-rounded'
        | 'extra-rounded',
    },
  })
})

const logoInput = document.querySelector<HTMLInputElement>('#qr-logo')!
const removeLogo = document.querySelector<HTMLButtonElement>('#remove-logo')!

logoInput.addEventListener('change', () => {
  const file = logoInput.files?.[0]

  if (!file) return

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    alert('Escolhe uma imagem PNG, JPG ou WebP.')
    logoInput.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('A imagem não pode ultrapassar 5 MB.')
    logoInput.value = ''
    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    if (typeof reader.result !== 'string') return

    qr.update({
      image: reader.result,
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: Number(
  document.querySelector<HTMLInputElement>('#logo-size')!.value
) / 100,
        hideBackgroundDots: true,
      },
    })
  }

  reader.readAsDataURL(file)
})

removeLogo.addEventListener('click', () => {
  logoInput.value = ''

  qr.update({
    image: '',
  })
})

const logoSize = document.querySelector<HTMLInputElement>('#logo-size')!
const logoSizeValue = document.querySelector<HTMLSpanElement>('#logo-size-value')!

logoSize.addEventListener('input', () => {
  const size = Number(logoSize.value)

  logoSizeValue.textContent = `${size}%`

  if (logoInput.files?.length) {
    qr.update({
      imageOptions: {
        imageSize: size / 100,
        margin: 5,
        hideBackgroundDots: true,
      },
    })
  }
})

const downloadSVG = document.querySelector<HTMLButtonElement>('#download-svg')!

downloadSVG.addEventListener('click', async () => {
  if (!input.value.trim()) {
    alert('Introduz um link ou texto.')
    return
  }

  qr.update({ data: input.value.trim() })

  await qr.download({
    name: 'qr-studio',
    extension: 'svg',
  })
})
