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

  const isSSR = normalizedTags.some(t =>
    ['hiem', 'hiemco', 'khotim', 'docla', 'thuonghang', 'xaxi'].includes(t)
  )
  const isSR = normalizedTags.some(t =>
    ['haisan', 'lehoi', 'anchoi', 'moinhau'].includes(t)
  )
  const isR = normalizedTags.some(t =>
    ['damdo', 'damtiec', 'dacsan', 'haocom'].includes(t)
  )

  // 💎 1. TIER SSR (Siêu Phẩm / Cực Hiếm - Vàng Kim)
  if (isSSR) {
    return {
      tier: 'SSR',
      label: 'SSR - Siêu Phẩm 💎',
      border: 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]',
      bg: 'bg-gradient-to-b from-amber-400/30 via-amber-500/40 to-orange-600/50',
      badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black animate-bounce shadow-lg',
      glow: 'shadow-[0_0_60px_rgba(245,158,11,0.9)] ring-4 ring-amber-400',
      weight: 1
    }
  }

  // 🌟 2. TIER SR (Xa Xỉ / Hiếm - Tím)
  if (isSR) {
    return {
      tier: 'SR',
      label: 'SR - Xa Xỉ 🌟',
      border: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]',
      bg: 'bg-gradient-to-b from-purple-500/30 to-indigo-600/40',
      badge: 'bg-purple-600 text-white font-bold shadow-md',
      glow: 'shadow-[0_0_40px_rgba(168,85,247,0.6)] ring-2 ring-purple-500',
      weight: 2
    }
  }

  // 🔷 3. TIER R (Đặc Sản / Khá - Xanh Dương)
  if (isR) {
    return {
      tier: 'R',
      label: 'R - Đặc Sản 🔷',
      border: 'border-blue-400 shadow-blue-400/50',
      bg: 'bg-gradient-to-b from-blue-400/20 to-cyan-500/30',
      badge: 'bg-blue-600 text-white font-bold',
      glow: '',
      weight: 4
    }
  }

  // 🥣 4. TIER N (Bữa Cơm / Thường - Xanh Lá)
  return {
    tier: 'N',
    label: 'N - Bữa Cơm 🥣',
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
  if (tier === 'SSR') {
    // 💎 Pháo hoa Vàng Kim rực rỡ 3 đợt cho SSR
    const count = 200
    const defaults = { origin: { y: 0.6 } }

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#fbbf24', '#f59e0b', '#ffffff'] })
    fire(0.2, { spread: 60, colors: ['#d97706', '#fbbf24'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffffff', '#fbbf24'] })
  } else if (tier === 'SR') {
    // 🌟 Pháo hoa Tím Ánh Kim cho SR
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#c084fc', '#e9d5ff', '#ffffff']
    })
  } else if (tier === 'R') {
    // 🔷 Pháo hoa Xanh Dương nhẹ cho R
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd']
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

        // 🔊 PHÁT ÂM THANH THEO THỨ TỰ TIER N -> R -> SR -> SSR
        if (rarity.tier === 'SSR') {
          playSound('win_ssr')
        } else if (rarity.tier === 'SR') {
          playSound('win_sr')
        } else if (rarity.tier === 'R') {
          playSound('win_r')
        } else {
          playSound('win_n')
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
        <span className="text-2xl">🎲</span>
        <span className="tracking-wide">Hôm Nay ăn gì? </span>
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

            {/* Container dải băng */}
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
                    winningRarity?.tier === 'SSR' ? 'text-amber-300 animate-pulse' : winningRarity?.tier === 'SR' ? 'text-purple-300' : winningRarity?.tier === 'R' ? 'text-blue-300' : 'text-emerald-400'
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
            // dòng này là để paste công cụ test gacha audio
            {/* 🧪 DEV TEST AUDIO BUTTONS (Chèn vào dòng 358) */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800 text-xs justify-center">
              <span className="text-slate-500 font-mono self-center">Dev Test:</span>
              <button 
                type="button"
                onClick={() => playSound('win_n')} 
                className="px-2 py-1 bg-emerald-950 text-emerald-400 rounded border border-emerald-800 hover:bg-emerald-900"
              >
                🔊 N
              </button>
              <button 
                type="button"
                onClick={() => playSound('win_r')} 
                className="px-2 py-1 bg-blue-950 text-blue-400 rounded border border-blue-800 hover:bg-blue-900"
              >
                🔊 R
              </button>
              <button 
                type="button"
                onClick={() => playSound('win_sr')} 
                className="px-2 py-1 bg-purple-950 text-purple-400 rounded border border-purple-800 hover:bg-purple-900"
              >
                🔊 SR
              </button>
              <button 
                type="button"
                onClick={() => playSound('win_ssr')} 
                className="px-2 py-1 bg-amber-950 text-amber-400 rounded border border-amber-800 hover:bg-amber-900 font-bold"
              >
                🔊 SSR (Vàng Kim)
              </button>
                    </div>        
          </div>
        </div>
      )}
    </>
  )
}