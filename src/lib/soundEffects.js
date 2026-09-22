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

  // 1. Tiếng LẠCH CẠCH CS2
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

  // 2. ÂM THANH CHÚC MỪNG PHÂN TÁCH BIỆT LẬP CẢ 4 TIER: N -> R -> SR -> SSR
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    // 💎 1. TIER SSR (Vàng Kim): Fanfare Hoành Tráng 6 nốt dồn dập
    if (type === 'win_ssr') {
      const melody = [
        { freq: 523.25, time: 0, duration: 0.12 },
        { freq: 659.25, time: 0.1, duration: 0.12 },
        { freq: 783.99, time: 0.2, duration: 0.12 },
        { freq: 1046.50, time: 0.32, duration: 0.15 },
        { freq: 880.00, time: 0.45, duration: 0.12 },
        { freq: 1174.66, time: 0.58, duration: 0.8 },
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)
        gain.gain.setValueAtTime(0.2, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    } 

    // 🌟 2. TIER SR (Tím): Chuỗi Arpeggio Vàng-Tím mượt mà 5 nốt
    else if (type === 'win_sr') {
      const melody = [
        { freq: 440.00, time: 0, duration: 0.12 },
        { freq: 554.37, time: 0.1, duration: 0.12 },
        { freq: 659.25, time: 0.2, duration: 0.12 },
        { freq: 880.00, time: 0.32, duration: 0.2 },
        { freq: 1108.73, time: 0.48, duration: 0.6 },
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)
        gain.gain.setValueAtTime(0.22, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    } 

    // 🔷 3. TIER R (Xanh Dương): Điệu "Sol-Đô-Mi" 3 nốt tươi vui
    else if (type === 'win_r') {
      const melody = [
        { freq: 392.00, time: 0, duration: 0.12 },
        { freq: 523.25, time: 0.1, duration: 0.12 },
        { freq: 659.25, time: 0.22, duration: 0.4 },
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)
        gain.gain.setValueAtTime(0.15, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    }

    // 🥣 4. TIER N (Xanh Lá): Tiếng "Ting" 2 nốt đơn nhẹ nhàng
    else {
      const melody = [
        { freq: 523.25, time: 0, duration: 0.08 },
        { freq: 659.25, time: 0.08, duration: 0.25 },
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)
        gain.gain.setValueAtTime(0.12, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    }
  } catch (e) {
    console.error('Lỗi phát âm thanh chiến thắng:', e)
  }
}