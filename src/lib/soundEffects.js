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

  // 1. Tiếng "Lạch cạch" CS2 lướt qua dải băng
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

  // 2. ÂM THANH CHÚC MỪNG KHÁC BIỆT HOÀN TOÀN THEO Từng TIER
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    // 👑 TIER UR (Siêu Phẩm / Món Hiếm): Điệu Fanfare hoành tráng 6 nốt dồn dập + âm bass vang dội
    if (type === 'win_ur') {
      const melody = [
        { freq: 523.25, time: 0, duration: 0.12 },   // C5
        { freq: 659.25, time: 0.1, duration: 0.12 },  // E5
        { freq: 783.99, time: 0.2, duration: 0.12 },  // G5
        { freq: 1046.50, time: 0.32, duration: 0.15 },// C6
        { freq: 880.00, time: 0.45, duration: 0.12 }, // A5
        { freq: 1174.66, time: 0.58, duration: 0.8 }, // D6 (Vang kéo dài)
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sawtooth' // Giả lập tiếng kèn Trumpet chiến thắng
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

        gain.gain.setValueAtTime(0.2, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    } 

    // 💎 TIER SSR (Xa Xỉ): Âm hưởng Arpeggio mượt mà, huyền ảo 5 nốt ngân vang
    else if (type === 'win_ssr') {
      const melody = [
        { freq: 440.00, time: 0, duration: 0.15 },   // A4
        { freq: 554.37, time: 0.12, duration: 0.15 }, // C#5
        { freq: 659.25, time: 0.24, duration: 0.15 }, // E5
        { freq: 880.00, time: 0.36, duration: 0.2 },  // A5
        { freq: 1108.73, time: 0.5, duration: 0.6 },  // C#6
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine' // Tiếng chuông trong vắt
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

        gain.gain.setValueAtTime(0.25, ctx.currentTime + note.time)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.time + note.duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(ctx.currentTime + note.time)
        osc.stop(ctx.currentTime + note.time + note.duration)
      })
    } 

    // 🌟 TIER SR (Đặc Sản): Điệu "Boong-Bính" 3 nốt nhộn nhịp
    else if (type === 'win_sr') {
      const melody = [
        { freq: 523.25, time: 0, duration: 0.15 },  // C5
        { freq: 659.25, time: 0.12, duration: 0.15 }, // E5
        { freq: 783.99, time: 0.25, duration: 0.4 },  // G5
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

    // 🥣 TIER R (Bữa Cơm): Tiếng "Ting!" đơn giản 2 nốt nhẹ nhàng
    else {
      const melody = [
        { freq: 659.25, time: 0, duration: 0.1 },  // E5
        { freq: 880.00, time: 0.1, duration: 0.3 }, // A5
      ]

      melody.forEach((note) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time)

        gain.gain.setValueAtTime(0.18, ctx.currentTime + note.time)
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