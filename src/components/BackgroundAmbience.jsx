'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function BackgroundAmbience() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  
  const audioRef = useRef(null)
  const audioCtxRef = useRef(null)
  const filterNodeRef = useRef(null)
  const gainNodeRef = useRef(null)
  const sourceNodeRef = useRef(null)

  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) {
    return null
  }


  // 1. Khởi tạo Web Audio API & Low-pass Filter
  const initAudioContext = () => {
    if (audioCtxRef.current || !audioRef.current) return

    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    // Tạo các node âm thanh
    const source = ctx.createMediaElementSource(audioRef.current)
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    // Cấu hình bộ lọc Low-pass (Lọc tần số cao để tạo tiếng đục/bí)
    filter.type = 'lowpass'
    filter.frequency.value = 20000 // Ban đầu mở hoàn toàn (Âm thanh trong trẻo ngoài đường)

    // Kết nối chuỗi âm thanh: Audio -> Filter -> Gain -> Loa
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    sourceNodeRef.current = source
    filterNodeRef.current = filter
    gainNodeRef.current = gain
  }

  // 2. Xử lý chuyển đổi âm thanh khi đổi Trang (Trang chủ <-> Trang chi tiết)
  useEffect(() => {
    if (!audioCtxRef.current || !filterNodeRef.current || !gainNodeRef.current) return

    const isDetailPage = pathname.startsWith('/recipe/')
    const ctx = audioCtxRef.current
    const currTime = ctx.currentTime

    if (isDetailPage) {
      // 🚪 KHI VÀO TRANG XEM CÔNG THỨC (Đóng cửa phòng):
      // 1. Hạ tần số cắt xuống 400Hz -> Lọc sạch âm cao, tiếng đục và bí lại như qua bức tường
      filterNodeRef.current.frequency.exponentialRampToValueAtTime(400, currTime + 1.2)
      // 2. Giảm nhẹ âm lượng tổng
      gainNodeRef.current.gain.linearRampToValueAtTime(0.2, currTime + 1.2)
    } else {
      // 🏙️ KHI TRỞ VỀ TRANG CHỦ (Mở cửa ra đường):
      // 1. Trả lại tần số 20000Hz -> Âm thanh trong trẻo, rõ ràng trở lại
      filterNodeRef.current.frequency.exponentialRampToValueAtTime(20000, currTime + 1.2)
      // 2. Tăng lại âm lượng phố phường vừa phải
      gainNodeRef.current.gain.linearRampToValueAtTime(0.35, currTime + 1.2)
    }
  }, [pathname])

  // 3. Tự động kích hoạt khi có tương tác đầu tiên
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        initAudioContext()

        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume()
        }

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

  // 4. Bật / Tắt âm thanh
  const toggleSound = () => {
    if (!audioRef.current) return

    initAudioContext()

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }

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
      <audio
        ref={audioRef}
        src="/sounds/street_ambience 2.mp3"
        loop
        preload="auto"
      />

      {/* Nút Bật/Tắt Âm Thanh Góc Trên Bên Phải */}
      <button
        onClick={toggleSound}
        title={isPlaying ? 'Tắt âm thanh phố phường' : 'Bật âm thanh phố phường'}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-md hover:bg-amber-100/80 transition-all duration-300 text-amber-950 font-bold text-xs active:scale-95 group"
      >
        <span className="text-base animate-pulse">
          {isPlaying ? '🔊' : '🔇'}
        </span>
        <span className="hidden sm:inline-block">
          {isPlaying ? 'Quán Nhậu Đường Phố' : 'Mở Âm Thanh'}
        </span>

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