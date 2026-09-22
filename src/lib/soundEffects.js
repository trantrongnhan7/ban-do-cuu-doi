// Quản lý các âm thanh hiệu ứng cho Hòm Cứu Đói
export const playSound = (type) => {
  if (typeof window === 'undefined') return

  const sounds = {
    // Tiếng tạch tạch/quay xẻng khi đang gacha hồi hộp
    spin: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    // Tiếng pháo hoa / chúc mừng khi trúng món ăn ngon! 🥳
    win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    // Tiếng click nút bấm
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  }

  if (sounds[type]) {
    const audio = new Audio(sounds[type])
    audio.volume = 0.5 // Âm lượng 50%
    audio.play().catch(() => {
      // Bỏ qua nếu trình duyệt chặn tự động phát nhạc
    })
  }
}