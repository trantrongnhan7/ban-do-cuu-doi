// Khởi tạo AudioContext dùng chung
let audioCtx = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export const playSound = (type) => {
  if (typeof window === 'undefined') return

  // 1. Tiếng "Lạch cạch" CS2 (Web Audio API)
  if (type === 'tick' || type === 'spin') {
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.025)

      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.025)
    } catch (e) {
      console.error(e)
    }
    return
  }

  // 2. Tiếng CHÚC MỪNG PHÂN CẤP (Dùng Web Audio Synthesizer phát trực tiếp - Không bao giờ bị chặn/lỗi link MP3!)
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    // 👑 Cấp UR: Fanfare Hoành Tráng
    if (type === 'win_ur') {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)

        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.6)
      })
    } 
    // 💎 Cấp SSR: Hợp Âm Rực Rỡ
    else if (type === 'win_ssr') {
      const notes = [440, 554.37, 659.25, 880]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)

        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.5)
      })
    } 
    // 🥣 Cấp R & SR: Tiếng Chuông Bính Boong Vui Tươi
    else {
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)

        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + i * 0.1)
        osc.stop(ctx.currentTime + i * 0.1 + 0.4)
      })
    }
  } catch (e) {
    console.error('Lỗi phát tiếng chúc mừng:', e)
  }
}