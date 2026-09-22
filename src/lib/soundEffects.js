// Quản lý và phát âm thanh hiệu ứng
export const playSound = (type) => {
  if (typeof window === 'undefined') return

  const sounds = {
    // Tiếng tạch tạch/quay xẻng khi đang gacha hồi hộp
    spin: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    // Tiếng pháo hoa / chúc mừng khi trúng món ăn ngon! 🥳
    win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    // Tiếng click nhẹ
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  }

  if (sounds[type]) {
    try {
      // Tạo một đối tượng Audio mới cho mỗi lần gọi để tránh bị hoãn/kẹt trạng thái phát cũ
      const audio = new Audio(sounds[type])
      audio.volume = 0.5
      audio.currentTime = 0 // Reset thời gian về ban đầu
      
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Lỗi tự động phát âm thanh:', err)
        })
      }
    } catch (e) {
      console.error('Không thể phát âm thanh:', e)
    }
  }
}