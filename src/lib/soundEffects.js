// Quản lý và phát âm thanh hiệu ứng phân cấp theo độ hiếm
export const playSound = (type) => {
  if (typeof window === 'undefined') return

  const sounds = {
    // Tiếng "clack" đanh gọn lướt qua từng ô CS2
    tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    
    // 🥉 Âm thanh khi trúng R / SR (Vui nhẹ nhàng)
    win_sr: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',

    // 🥈 Âm thanh khi trúng SSR (Nổ hũ rộn rã)
    win_ssr: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',

    // 🥇 Âm thanh khi trúng UR (Hoành tráng siêu phẩm)
    win_ur: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  }

  if (sounds[type]) {
    try {
      const audio = new Audio(sounds[type])
      audio.volume = type === 'tick' ? 0.3 : 0.8
      audio.currentTime = 0
      audio.play().catch((err) => console.warn('Lỗi phát âm thanh:', err))
    } catch (e) {
      console.error(e)
    }
  }
}