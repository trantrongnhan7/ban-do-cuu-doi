'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

// Chuẩn hóa tiếng Việt để nhận diện Tag
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
    ['hiem', 'hiemco', 'khotim', 'docla', 'thuonghang', 'hiemco'].includes(t)
  )
  const isSSR = normalizedTags.some(t =>
    [ 'haisan', 'lehoi', 'damdo', 'tiec', 'xaxi'].includes(t)
  )
  const isSR = normalizedTags.some(t =>
    ['dacsan', 'anchoi', 'moinhau', 'haocom'].includes(t)
  )

  if (isUR) {
    return {
      tier: 'UR',
      label: 'UR - Món Hiếm 👑',
      border: 'border-pink-500 shadow-pink-500/50',
      bg: 'bg-gradient-to-b from-pink-500/20 to-red-600/30',
      badge: 'bg-pink-600 text-white font-extrabold animate-pulse',
      weight: 1
    }
  }
  if (isSSR) {
    return {
      tier: 'SSR',
      label: 'SSR - Xa Xỉ 💎',
      border: 'border-purple-500 shadow-purple-500/50',
      bg: 'bg-gradient-to-b from-purple-500/20 to-indigo-600/30',
      badge: 'bg-purple-600 text-white font-bold',
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
      weight: 4
    }
  }
  return {
    tier: 'R',
    label: 'R - Bữa Cơm 🥣',
    border: 'border-emerald-400 shadow-emerald-400/30',
    bg: 'bg-gradient-to-b from-emerald-400/10 to-teal-500/20',
    badge: 'bg-emerald-600 text-white font-medium',
    weight: 8
  }
}

// Thuật toán chọn món theo trọng số
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

export default function RandomDishModal({ dishes }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [stripDishes, setStripDishes] = useState([])
  const [winningDish, setWinningDish] = useState(null)
  const stripRef = useRef(null)

  const handleOpenAndSpin = () => {
    if (!dishes || dishes.length === 0) return
    setIsOpen(true)
    startCS2Spin()
  }

  const startCS2Spin = () => {
    if (isSpinning || !dishes || dishes.length === 0) return

    setIsSpinning(true)
    setWinningDish(null)

    // 1. Chốt món trúng thưởng
    const winner = selectWeightedRandomDish(dishes)

    // 2. Tạo dải băng 45 món (vị trí index 35 là món chiến thắng)
    const generatedStrip = []
    for (let i = 0; i < 45; i++) {
      if (i === 35) {
        generatedStrip.push(winner)
      } else {
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)]
        generatedStrip.push(randomDish)
      }
    }
    setStripDishes(generatedStrip)

    // Reset dải băng về vị trí ban đầu
    if (stripRef.current) {
      stripRef.current.style.transition = 'none'
      stripRef.current.style.transform = 'translateX(0px)'
    }

    // 3. Kích hoạt Animation cuộn CS2 sau 100ms
    setTimeout(() => {
      if (!stripRef.current) return

      // Mỗi thẻ rộng 130px (120px card + 10px gap)
      // Vị trí dừng: Đưa card index 35 vào đúng giữa khung (offset khoảng 130 * 35) + khoảng lệch nhẹ ngẫu nhiên
      const cardWidth = 130
      const randomOffset = Math.floor(Math.random() * 80) - 40 // Tạo khoảng chênh lệch tự nhiên
      const targetX = -(35 * cardWidth - 120 + randomOffset)

      // Cấu hình Bezier Curve chuẩn CS2 (nhanh vút lúc đầu, chậm dần cực sâu về sau)
      stripRef.current.style.transition = 'transform 6.5s cubic-bezier(0.1, 1, 0.1, 1)'
      stripRef.current.style.transform = `translateX(${targetX}px)`

      // Khi animation kết thúc sau 6.5 giây
      setTimeout(() => {
        setIsSpinning(false)
        setWinningDish(winner)
      }, 6500)
    }, 100)
  }

  return (
    <>
      {/* Nút bấm Mở Hòm Cứu Đói */}
      <button
        onClick={handleOpenAndSpin}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 hover:scale-105 text-white font-extrabold py-3.5 px-6 rounded-full shadow-2xl border-2 border-amber-300 flex items-center gap-2 transition-all active:scale-95 animate-bounce"
      >
        <span className="text-2xl">🧰</span>
        <span className="tracking-wide">Mở Hòm Cứu Đói CS2</span>
      </button>

      {/* Modal CS2 Case Opening */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-xl w-full shadow-[0_0_50px_rgba(245,158,11,0.2)] relative text-center overflow-hidden">
            
            {/* Nút Đóng */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center z-20"
            >
              ✕
            </button>

            {/* Title CS2 */}
            <div className="mb-4">
              <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">CS2 CASE OPENING</span>
              <h3 className="text-2xl font-black text-white tracking-wide uppercase drop-shadow">
                Mở Hòm Ẩm Thực 3 Miền
              </h3>
            </div>

            {/* KHUNG CONVEYOR CS2 BELT */}
            <div className="relative my-6 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 overflow-hidden h-44 shadow-inner flex items-center">
              
              {/* Mũi tên định vị Vạch Đích (Center Indicator) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-amber-500 z-10 shadow-[0_0_15px_#f59e0b]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 text-amber-400 text-xs">▼</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 z-20 text-amber-400 text-xs">▲</div>

              {/* Dải Băng Món Ăn Cuộn Ngang */}
              <div
                ref={stripRef}
                className="flex gap-2.5 items-center absolute left-1/2"
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

            {/* KẾT QUẢ VÀ NÚT XEM CÔNG THỨC */}
            <div className="min-h-[90px] flex flex-col items-center justify-center">
              {isSpinning && (
                <p className="text-amber-400 text-sm font-mono animate-pulse">
                  ⚡ Dải băng đang cuộn... Đang hồi hộp chờ kết quả!
                </p>
              )}

              {winningDish && !isSpinning && (
                <div className="animate-fade-in text-center">
                  <div className="text-xs text-slate-400 uppercase font-mono mb-1">Món ăn trúng thưởng:</div>
                  <h4 className="text-2xl font-black text-amber-300 mb-2">
                    {winningDish.title}
                  </h4>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 ${getRarityInfo(winningDish.tags).badge}`}>
                    {getRarityInfo(winningDish.tags).label}
                  </span>
                </div>
              )}
            </div>

            {/* CÁC NÚT THAO TÁC */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={startCS2Spin}
                disabled={isSpinning}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 font-bold py-3 px-4 rounded-xl text-sm transition-all disabled:opacity-50 active:scale-95 shadow-md"
              >
                {isSpinning ? 'Đang mở hòm...' : 'Mở lại 🧰'}
              </button>

              {winningDish && !isSpinning && (
                <Link
                  href={`/recipe/${typeof winningDish.slug === 'string' ? winningDish.slug : winningDish.slug?.current || winningDish._id}`}
                  onClick={() => setIsOpen(false)}
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