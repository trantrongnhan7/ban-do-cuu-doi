'use client'

import { playSound } from '@/lib/soundEffects'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import confetti from 'canvas-confetti'

function removeVietnameseTones(str) {
  if (!str) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '')
}

function getRarityInfo(tags = []) {
  const normalizedTags = tags.map(t => removeVietnameseTones(t))

  const isUR = normalizedTags.some(t =>
    ['hiem', 'hiemco', 'khotim', 'docla', 'thuonghang'].includes(t)
  )
  const isSSR = normalizedTags.some(t =>
    ['haisan', 'lehoi', 'damdo', 'damtiec', 'xaxi'].includes(t)
  )
  const isSR = normalizedTags.some(t =>
    ['dacsan', 'anchoi', 'moinhau', 'haocom'].includes(t)
  )

  if (isUR) {
    return {
      tier: 'UR',
      label: 'UR - Món Hiếm 👑',
      border: 'border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.8)]',
      bg: 'bg-gradient-to-b from-pink-500/30 via-purple-600/40 to-red-600/50',
      badge: 'bg-gradient-to-r from-pink-600 to-red-600 text-white font-black animate-bounce shadow-lg',
      glow: 'shadow-[0_0_60px_rgba(236,72,153,0.9)] ring-4 ring-pink-500',
      weight: 1
    }
  }
  if (isSSR) {
    return {
      tier: 'SSR',
      label: 'SSR - Xa Xỉ 💎',
      border: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]',
      bg: 'bg-gradient-to-b from-purple-500/30 to-indigo-600/40',
      badge: 'bg-purple-600 text-white font-bold shadow-md',
      glow: 'shadow-[0_0_50px_rgba(168,85,247,0.8)] ring-4 ring-purple-500',
      weight: 2
    }
  }
  if (isSR) {
    return {
      tier: 'SR',
      label: 'SR - Đặc Sản 🌟',
      border: 'border-amber-400 shadow-amber-400/50',
      bg: 'bg-gradient-to-b from-amber-400/20 to-orange-500/30',
      badge: 'bg-amber-500 text-white font-bold',
      glow: '',
      weight: 4
    }
  }
  return {
    tier: 'R',
    label: 'R - Bữa Cơm 🥣',
    border: 'border-emerald-400 shadow-emerald-400/30',
    bg: 'bg-gradient-to-b from-emerald-400/10 to-teal-500/20',
    badge: 'bg-emerald-600 text-white font-medium',
    glow: '',
    weight: 8
  }
}

function selectWeightedRandomDish(dishes) {
  const weightedList = []
  dishes.forEach((dish) => {
    const rarity = getRarityInfo(dish.tags)
    for (let i = 0; i < rarity.weight; i++) {
      weightedList.push(dish)
    }
  })
  return weightedList[Math.floor(Math.random() * weightedList.length)]
}

// Bắn Pháo Hoa Kim Tuyến
function triggerConfetti(tier) {
  if (tier === 'UR') {
    const count = 200
    const defaults = { origin: { y: 0.6 } }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ec4899', '#f43f5e', '#fbbf24'] })
    fire(0.2, { spread: 60, colors: ['#a855f7', '#ec4899'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffffff', '#fbbf24'] })
    fire(0.1, { spread: 120, startVelocity: 45 })
  } else if (tier === 'SSR') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#c084fc', '#f59e0b', '#ffffff']
    })
  }
}

export default function RandomDishModal({ dishes }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [stripDishes, setStripDishes] = useState([])
  const [winningDish, setWinningDish] = useState(null)
  
  const containerRef = useRef(null)
  const stripRef = useRef(null)
  const tickTimerRef = useRef(null)

  const handleOpenAndSpin = () => {
    if (!dishes || dishes.length === 0) return
    setIsOpen(true)
    startCS2Spin()
  }

  const handleCloseModal = () => {
    if (tickTimerRef.current) clearTimeout(tickTimerRef.current)
    setIsSpinning(false)
    setIsOpen(false)
  }

  const startCS2Spin = () => {
    if (isSpinning || !dishes || dishes.length === 0) return

    // Xóa timer phát tiếng lạch cạch cũ nếu có
    if (tickTimerRef.current) clearTimeout(tickTimerRef.current)

    setIsSpinning(true)
    setWinningDish(null)

    const winner = selectWeightedRandomDish(dishes)
    const TARGET_INDEX = 42
    const generatedStrip = []
    
    for (let i = 0; i < 55; i++) {
      if (i === TARGET_INDEX) {
        generatedStrip.push(winner)
      } else {
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)]
        generatedStrip.push(randomDish)
      }
    }
    setStripDishes(generatedStrip)

    if (stripRef.current) {
      stripRef.current.style.transition = 'none'
      stripRef.current.style.transform = 'translateX(0px)'
    }

    setTimeout(() => {
      if (!stripRef.current || !containerRef.current) return

      const winnerCardNode = stripRef.current.children[TARGET_INDEX]
      if (!winnerCardNode) return

      const cardLeftOffset = winnerCardNode.offsetLeft
      const cardWidth = winnerCardNode.offsetWidth
      const containerWidth = containerRef.current.clientWidth

      const exactCenterTargetX = -(cardLeftOffset + cardWidth / 2 - containerWidth / 2)
      const maxEdgeJitter = (cardWidth / 2) * 0.8
      const isLeftOrRight = Math.random() > 0.5 ? 1 : -1
      const edgeOffset = (Math.random() * (maxEdgeJitter - 10) + 10) * isLeftOrRight

      const finalTargetX = exactCenterTargetX + edgeOffset

      // 🔊 CHUỖI TIẾNG LẠCH CẠCH CHẬM DẦN CS2
      let delay = 60
      let totalTime = 0
      const duration = 8500

      const playCs2Ticks = () => {
        if (totalTime < duration) {
          playSound('tick')
          delay *= 1.065
          totalTime += delay
          tickTimerRef.current = setTimeout(playCs2Ticks, delay)
        }
      }
      playCs2Ticks()

      stripRef.current.style.transition = 'transform 8.5s cubic-bezier(0.05, 0.95, 0.05, 1)'
      stripRef.current.style.transform = `translateX(${finalTargetX}px)`

      // Khoảnh khắc chốt kết quả
      setTimeout(() => {
        setIsSpinning(false)
        setWinningDish(winner)

        const rarity = getRarityInfo(winner.tags)

        // 🔊 PHÁT ÂM THANH CHÚC MỪNG PHÂN CẤP TƯƠNG ỨNG TIER
        if (rarity.tier === 'UR') {
          playSound('win_ur')
        } else if (rarity.tier === 'SSR') {
          playSound('win_ssr')
        } else {
          playSound('win_sr')
        }

        triggerConfetti(rarity.tier)
      }, 8500)
    }, 100)
  }

  const winningRarity = winningDish ? getRarityInfo(winningDish.tags) : null

  return (
    <>
      <button
        onClick={handleOpenAndSpin}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 hover:scale-105 text-white font-extrabold py-2.5 px-4 sm:py-3.5 sm:px-6 rounded-full shadow-2xl border-2 border-amber-300 flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 animate-bounce text-xs sm:text-base"
      >
        <span className="text-2xl">🧰</span>
        <span className="tracking-wide">Mở Hòm Cứu Đói </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className={`bg-slate-900 border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto relative text-center transition-all duration-500 ${
            winningRarity?.glow ? winningRarity.glow : 'border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
          }`}>
            
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center z-20"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">FOOD CASE OPENING</span>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase drop-shadow">
                Mở Hòm Ẩm Thực 3 Miền
              </h3>
            </div>

            {/* Container */}
            <div 
              ref={containerRef}
              className="relative my-6 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 overflow-hidden h-44 shadow-inner flex items-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-amber-500 z-10 shadow-[0_0_15px_#f59e0b]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 text-amber-400 text-xs">▼</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 z-20 text-amber-400 text-xs">▲</div>

              {/* Dải Băng */}
              <div
                ref={stripRef}
                className="flex gap-2.5 items-center absolute left-0"
                style={{ willChange: 'transform' }}
              >
                {stripDishes.map((dish, index) => {
                  const rarity = getRarityInfo(dish.tags)
                  return (
                    <div
                      key={index}
                      className={`w-[120px] h-[140px] shrink-0 rounded-xl border-2 p-2 flex flex-col items-center justify-between transition-all ${rarity.border} ${rarity.bg} shadow-md`}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 mt-1">
                        {dish.image && (
                          <Image
                            src={urlFor(dish.image).url()}
                            alt={dish.title || 'Món'}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-white truncate w-full px-1">
                        {dish.title}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full ${rarity.badge}`}>
                        {rarity.tier}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="min-h-[90px] flex flex-col items-center justify-center">
              {isSpinning && (
                <p className="text-amber-400 text-sm font-mono animate-pulse">
                  ⚡ Đang trôi chậm dần... Hồi hộp chờ kết quả!
                </p>
              )}

              {winningDish && !isSpinning && (
                <div className="animate-fade-in text-center">
                  <div className="text-xs text-slate-400 uppercase font-mono mb-1">Món ăn trúng thưởng:</div>
                  <h4 className={`text-2xl font-black mb-2 ${
                    winningRarity?.tier === 'UR' ? 'text-pink-400 animate-pulse' : winningRarity?.tier === 'SSR' ? 'text-purple-300' : 'text-amber-300'
                  }`}>
                    {winningDish.title}
                  </h4>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 ${winningRarity?.badge}`}>
                    {winningRarity?.label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={startCS2Spin}
                disabled={isSpinning}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold py-3 px-4 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {isSpinning ? 'Đang mở hòm...' : 'Mở lại 🎟️'}
              </button>

              {winningDish && !isSpinning && (
                <Link
                  href={`/recipe/${typeof winningDish.slug === 'string' ? winningDish.slug : winningDish.slug?.current || winningDish._id}`}
                  onClick={handleCloseModal}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-1 active:scale-95"
                >
                  Xem công thức ngay ➔
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}