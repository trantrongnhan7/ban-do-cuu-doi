// Quản lý âm thanh dùng lại Audio Instance - Không bị ngắt luồng trình duyệt
if (typeof window !== 'undefined') {
  window._audioCache = window._audioCache || {}
}

export const playSound = (type) => {
  if (typeof window === 'undefined') return

  const soundUrls = {
    // Tiếng tick đanh gọn
    tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    spin: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',

    // Âm thanh chúc mừng phân cấp
    win_sr: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    win_ssr: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
    win_ur: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  }

  const url = soundUrls[type] || soundUrls['win_sr']

  try {
    // Xử lý riêng cho tiếng 'tick' / 'spin' cuộn liên tục để không tạo rác bộ nhớ
    if (type === 'tick' || type === 'spin') {
      if (!window._audioCache['tick']) {
        window._audioCache['tick'] = new Audio(url)
        window._audioCache['tick'].volume = 0.35
      }
      const tickAudio = window._audioCache['tick'].cloneNode()
      tickAudio.volume = 0.35
      tickAudio.play().catch(() => {})
      return
    }

    // Với các âm thanh chúc mừng (win_sr, win_ssr, win_ur)
    const audio = new Audio(url)
    audio.volume = 0.8
    audio.currentTime = 0
    audio.play().catch((e) => console.warn('Autoplay prevented:', e))
  } catch (e) {
    console.error('Audio Playback Error:', e)
  }
}