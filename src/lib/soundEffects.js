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

      osc.type = 'square'
      osc.frequency.setValueAtTime(1500, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.035)

      gain.gain.setValueAtTime(0.55, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.035)
    } catch (e) {
      console.error(e)
    }
    return
  }

  // 2. ÂM THANH CHÚC MỪNG PHÂN TÁCH BIỆT LẬP CẢ 4 TIER: N -> R -> SR -> SSR
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    // 💎 TIER SSR (SIÊU PHẨM VÀNG KIM): Âm thanh Bùng Nổ, Hoành Tráng & Vang Dội!
    else if (type === 'win_ssr') {
      const now = ctx.currentTime

      // 💥 1. BASS BOOM (Nổ hũ rung chuyển ngay nốt đầu)
      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()
      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(100, now)
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.6)
      subGain.gain.setValueAtTime(0.5, now)
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
      subOsc.connect(subGain)
      subGain.connect(ctx.destination)
      subOsc.start(now)
      subOsc.stop(now + 0.6)

      // 🎺 2. KÈN TRUMPET FANFARE SIÊU PHẨM (7 Nốt Dồn Dập & Bay Bổng)
      const fanfare = [
        { freq: 523.25, time: 0, duration: 0.1 },    // C5
        { freq: 659.25, time: 0.09, duration: 0.1 }, // E5
        { freq: 783.99, time: 0.18, duration: 0.1 }, // G5
        { freq: 1046.50, time: 0.28, duration: 0.15 },// C6
        { freq: 880.00, time: 0.42, duration: 0.12 }, // A5
        { freq: 1174.66, time: 0.54, duration: 0.15 },// D6
        { freq: 1318.51, time: 0.68, duration: 1.2 }, // E6 (Kéo dài ngân vang hoành tráng)
      ]

      fanfare.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth' // Giả lập kèn đồng chiến thắng
        osc.frequency.setValueAtTime(note.freq, now + note.time)

        gain.gain.setValueAtTime(0.28, now + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + note.time)
        osc.stop(now + note.time + note.duration)
      })

      // ✨ 3. TẦNG CHUÔNG KIM TUYẾN ÁNH VÀNG (Arpeggio lấp lánh đệm phía sau)
      const shimmer = [659.25, 783.99, 1046.50, 1318.51, 1567.98]
      shimmer.forEach((freq, index) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + 0.7 + index * 0.08)

        gain.gain.setValueAtTime(0.2, now + 0.7 + index * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + index * 0.08 + 0.5)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + 0.7 + index * 0.08)
        osc.stop(now + 0.7 + index * 0.08 + 0.5)
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
        { freq: 659.25, time: 0, duration: 0.12 },
        { freq: 880.00, time: 0.08, duration: 0.3 },
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)
        gain.gain.setValueAtTime(0.5, ctx.currentTime + note.time)
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