'use client'

import { playSound } from '@/lib/soundEffects'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import confetti from 'canvas-confetti'

export const getRarityInfo = (dish) => {
  // Đọc Tier chuẩn từ Sanity Studio
  const tier =
    dish?.rarityTier ||
    (dish?.hashtags?.includes('SSR') || dish?.tags?.includes('SSR') ? 'SSR' :
     dish?.hashtags?.includes('SR') || dish?.tags?.includes('SR') ? 'SR' :
     dish?.hashtags?.includes('R') || dish?.tags?.includes('R') ? 'R' : 'N');

  switch (tier) {
    case 'SSR':
      return {
        tier: 'SSR',
        label: 'SSR - Siêu Phẩm 💎',
        border: 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.9)]',
        bg: 'bg-gradient-to-b from-amber-400/30 via-amber-500/40 to-orange-600/50',
        badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black animate-bounce shadow-lg',
        glow: 'border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.9)] ring-4 ring-amber-400',
        sound: 'win_ssr',
        weight: 1, // Tỉ lệ hiếm nhất (~5%)
      };
    case 'SR':
      return {
        tier: 'SR',
        label: 'SR - Xa Xỉ 🌟',
        border: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.7)]',
        bg: 'bg-gradient-to-b from-purple-500/30 to-indigo-600/40',
        badge: 'bg-purple-600 text-white font-bold shadow-md',
        glow: 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.6)] ring-2 ring-purple-500',
        sound: 'win_sr',
        weight: 3, // Tỉ lệ vừa (~15%)
      };
    case 'R':
      return {
        tier: 'R',
        label: 'R - Đặc Sản 🍜',
        border: 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)]',
        bg: 'bg-gradient-to-b from-cyan-500/30 to-blue-600/40',
        badge: 'bg-cyan-600 text-white font-bold shadow-md',
        glow: 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] ring-2 ring-cyan-400',
        sound: 'win_r',
        weight: 6, // Tỉ lệ phổ biến (~30%)
      };
    default:
      return {
        tier: 'N',
        label: 'N - Bình Dân 🍚',
        border: 'border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]',
        bg: 'bg-gradient-to-b from-emerald-500/20 to-green-600/30',
        badge: 'bg-emerald-600 text-white font-bold shadow-sm',
        glow: 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400',
        sound: 'win_n',
        weight: 10, // Tỉ lệ cao nhất (~50%)
      };
  }
};

// Thuật toán quay Gacha theo đúng trọng số tỉ lệ chuẩn
function selectWeightedRandomDish(dishes) {
  if (!dishes || dishes.length === 0) return null
  const weightedList = []
  dishes.forEach((dish) => {
    const rarity = getRarityInfo(dish)
    for (let i = 0; i < rarity.weight; i++) {
      weightedList.push(dish)
    }
  })
  return weightedList[Math.floor(Math.random() * weightedList.length)]
}

// Bắn Pháo Hoa Kim Tuyến Đồng Bộ Theo Tier
function triggerConfetti(tier) {
  if (tier === 'SSR') {
    const count = 200
    const defaults = { origin: { y: 0.6 } }
    function fire(particleRatio, opts) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#fbbf24', '#f59e0b', '#ffffff'] })
    fire(0.2, { spread: 60, colors: ['#d97706', '#fbbf24'] })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffffff', '#fbbf24'] })
  } else if (tier === 'SR') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#c084fc', '#e9d5ff', '#ffffff']
    })
  } else if (tier === 'R') {
    confetti({
      particleCount: 60,
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

      // 🔊 TIẾNG LẠCH CẠCH CHẬM DẦN CS2
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

        // Lấy thông tin Rarity đồng bộ 100% từ món ăn chiến thắng
        const rarity = getRarityInfo(winner)

        // 🔊 PHÁT ÂM THANH CHUẨN ĐỒNG BỘ
        playSound(rarity.sound)

        // 🎉 BẮN PHÁO HOA CHUẨN ĐỒNG BỘ
        triggerConfetti(rarity.tier)
      }, 8500)
    }, 100)
  }

  // Lấy Rarity hiện tại của món trúng thưởng để render Hào Quang Modal
  const winningRarity = winningDish ? getRarityInfo(winningDish) : null

  return (
    <>
      {/* 🎡 WIDGET BÁT MÌ + VÒNG QUAY */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center">
        <span className="mb-3 text-[10px] font-black uppercase tracking-wider text-amber-200 bg-gradient-to-r from-red-600 to-orange-600 px-3 py-1 rounded-full border border-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-bounce z-20">
          🎲 Hôm Nay Ăn Gì?
        </span>

        <button
          onClick={handleOpenAndSpin}
          aria-label="Quay Món Ăn Gacha"
          className="group relative p-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-125 active:scale-95"
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/50 blur-xl group-hover:bg-red-500/80 transition-all duration-500 animate-pulse"></div>

          <div className="relative flex items-center justify-center animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-yellow-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"></div>

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.9)] transition-all duration-500 group-hover:shadow-[0_0_35px_rgba(239,68,68,1)] flex items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0.5 rounded-full bg-[conic-gradient(from_0deg,#dc2626_0deg_30deg,#ffffff_30deg_60deg,#dc2626_60deg_90deg,#ffffff_90deg_120deg,#dc2626_120deg_150deg,#ffffff_150deg_180deg,#dc2626_180deg_210deg,#ffffff_210deg_240deg,#dc2626_240deg_270deg,#ffffff_270deg_300deg,#dc2626_300deg_330deg,#ffffff_330deg_360deg)] opacity-90 animate-spin"
                 style={{ animationDuration: '10s' }}
              ></div>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-200/80 animate-pulse"></div>
              <div className="absolute w-8 h-8 rounded-full border-2 border-amber-300 bg-amber-600/40 backdrop-blur-[1px]"></div>
            </div>

            <div className="absolute z-10 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:scale-110">
              <span className="text-4xl sm:text-5xl">🍜</span>
            </div>
          </div>

          <span className="relative z-10 text-[11px] sm:text-[12px] font-black tracking-widest text-amber-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)] mt-1 group-hover:text-white transition-colors">
            QUAY MÓN
          </span>
        </button>
      </div>

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

            {/* Container Dải Băng */}
            <div 
              ref={containerRef}
              className="relative my-6 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 overflow-hidden h-44 shadow-inner flex items-center"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-amber-500 z-10 shadow-[0_0_15px_#f59e0b]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 text-amber-400 text-xs">▼</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 z-20 text-amber-400 text-xs">▲</div>

              {/* Dải Băng Thẻ Món */}
              <div
                ref={stripRef}
                className="flex gap-2.5 items-center absolute left-0"
                style={{ willChange: 'transform' }}
              >
                {stripDishes.map((dish, index) => {
                  const rarity = getRarityInfo(dish)
                  return (
                    <div
                      key={index}
                      className={`w-[120px] h-[140px] shrink-0 rounded-xl border-2 p-2 flex flex-col items-center justify-between transition-all ${rarity.border} ${rarity.bg} shadow-md`}
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 mt-1">
                        {dish.imageUrl || dish.image ? (
                          <Image
                            src={dish.imageUrl || urlFor(dish.image).url()}
                            alt={dish.title || 'Món'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xl">
                            🍲
                          </div>
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

            {/* Thông Báo Kết Quả */}
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

            {/* Nút Điều Hướng */}
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