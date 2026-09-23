'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function BackgroundAmbience() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef(null)
  const pathname = usePathname()

  // 1. Tự động điều chỉnh âm lượng theo từng trang
  useEffect(() => {
    if (!audioRef.current) return

    // Kiểm tra xem có đang ở trang chi tiết món ăn không
    const isDetailPage = pathname.startsWith('/recipe/')

    if (isDetailPage) {
      // Giảm âm lượng khi xem chi tiết công thức
      audioRef.current.volume = 0.1
    } else {
      // Âm lượng phố phường vừa phải ở trang chủ
      audioRef.current.volume = 0.35
    }
  }, [pathname])

  // 2. Kích hoạt âm thanh khi người dùng tương tác lần đầu với website
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            setHasInteracted(true)
          })
          .catch((err) => console.log('Autoplay blocked:', err))
      }
    }

    window.addEventListener('click', handleFirstInteraction, { once: true })
    return () => window.removeEventListener('click', handleFirstInteraction)
  }, [hasInteracted])

  // 3. Hàm bật / tắt âm thanh khi click nút
  const toggleSound = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasInteracted(true)
        })
        .catch((err) => console.log('Audio play error:', err))
    }
  }

  return (
    <>
      {/* Thẻ Audio chạy ẩn ở nền */}
      <audio
        ref={audioRef}
        src="/sounds/street_ambience.mp3"
        loop
        preload="auto"
      />

      {/* 📻 Nút Bật/Tắt Âm Thanh Đường Phố ở vị trí khoanh đỏ (Top Right) */}
      <button
        onClick={toggleSound}
        title={isPlaying ? 'Tắt âm thanh phố phường' : 'Bật âm thanh phố phường'}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-md hover:bg-amber-100/80 transition-all duration-300 text-amber-950 font-bold text-xs active:scale-95 group"
      >
        <span className="text-base animate-pulse">
          {isPlaying ? '🔊' : '🔇'}
        </span>
        <span className="hidden sm:inline-block">
          {isPlaying ? 'Phố Ẩm Thực' : 'Mở Âm Thanh'}
        </span>

        {/* Hiệu ứng sóng âm khi đang bật */}
        {isPlaying && (
          <span className="flex items-center gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-full bg-amber-600 rounded-full animate-bounce"></span>
            <span className="w-0.5 h-2/3 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-0.5 h-full bg-amber-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </span>
        )}
      </button>
    </>
  )
}