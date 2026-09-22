// Quản lý âm thanh kết hợp Web Audio API (cho tiếng tick) & MP3 CDN (cho tiếng thắng)
let audioCtx = null

export const playSound = (type) => {
  if (typeof window === 'undefined') return

  // 1. Tiếng LẠCH CẠCH CS2 (Dùng Web Audio API - Siêu nhẹ, không lo trình duyệt chặn)
  if (type === 'tick' || type === 'spin') {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        audioCtx = new AudioContext()
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume()
      }

      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.025)

      gain.gain.setValueAtTime(0.18, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.025)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start()
      osc.stop(audioCtx.currentTime + 0.025)
    } catch (e) {
      console.error(e)
    }
    return
  }

  // 2. Tiếng CHÚC MỪNG PHÂN CẤP (Dùng MP3)
  const soundUrls = {
    win_sr: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    win_ssr: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
    win_ur: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  }

  const url = soundUrls[type] || soundUrls['win_sr']

  try {
    const audio = new Audio(url)
    audio.volume = 0.8
    audio.currentTime = 0
    audio.play().catch((err) => console.warn('Lỗi tự động phát:', err))
  } catch (e) {
    console.error(e)
  }
}