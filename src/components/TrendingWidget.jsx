'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

export default function TrendingWidget({ dishes = [] }) {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [topDishes, setTopDishes] = useState([])

  // Hàm tính toán và sắp xếp Top món ăn được Gacha nhiều nhất hôm nay
  const calculateTopGachaDishes = () => {
    if (!dishes || dishes.length === 0) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const storageKey = `gacha_stats_${today}`
      const stats = JSON.parse(localStorage.getItem(storageKey) || '{}')

      // Gán số lượt gacha cho từng món
      const dishesWithCount = dishes.map((dish) => ({
        ...dish,
        gachaCount: stats[dish._id] || 0,
      }))

      // Sắp xếp giảm dần theo số lượt gacha
      dishesWithCount.sort((a, b) => b.gachaCount - a.gachaCount)

      // Nếu chưa có dữ liệu gacha nào, lấy 3 món mặc định đầu tiên
      const hasSpins = Object.keys(stats).length > 0
      const result = hasSpins ? dishesWithCount.slice(0, 3) : dishes.slice(0, 3)

      setTopDishes(result)
    } catch (e) {
      setTopDishes(dishes.slice(0, 3))
    }
  }

  useEffect(() => {
    setMounted(true)
    calculateTopGachaDishes()

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 120)
      }
    }

    // Lắng nghe sự kiện quay Gacha để cập nhật danh sách realtime
    const handleGachaUpdate = () => {
      calculateTopGachaDishes()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      window.addEventListener('gacha_updated', handleGachaUpdate)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('gacha_updated', handleGachaUpdate)
      }
    }
  }, [dishes])

  if (!mounted || !dishes || dishes.length === 0) return null

  const getRankBadge = (index) => {
    if (index === 0)
      return {
        label: '👑 TOP 1',
        bg: 'bg-amber-500 text-white border-amber-300 shadow-amber-500/30',
      }
    if (index === 1)
      return {
        label: '🥈 TOP 2',
        bg: 'bg-slate-400 text-white border-slate-200 shadow-slate-400/30',
      }
    return {
      label: '🥉 TOP 3',
      bg: 'bg-amber-700 text-white border-amber-500 shadow-amber-700/30',
    }
  }

  return (
    <>
      {/* 📱 MOBILE: Popup Top Món Gacha */}
      {isMobileOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-3xl border border-amber-200 shadow-2xl flex flex-col gap-3 relative"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shadow-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2.5">
              <span className="text-2xl animate-bounce">🎰</span>
              <div>
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  Top Gacha Hôm Nay
                </h3>
                <p className="text-[10px] text-amber-800 font-medium">
                  Món ăn được quay trúng nhiều nhất
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 my-1">
              {topDishes.map((dish, idx) => {
                const badge = getRankBadge(idx)
                const imageUrl = dish.imageUrl || (dish.image ? urlFor(dish.image).url() : null)
                const slug = typeof dish.slug === 'string' ? dish.slug : dish.slug?.current || dish._id

                return (
                  <Link
                    key={dish._id || idx}
                    href={`/recipe/${slug}`}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 p-2 bg-white/90 hover:bg-white rounded-2xl border border-amber-200/60 shadow-xs transition-all active:scale-98"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-amber-100">
                      {imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={dish.title || 'Món ăn'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border shadow-xs ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                        {dish.gachaCount > 0 && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                            🎲 {dish.gachaCount} lượt
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-amber-950 truncate">
                        {dish.title}
                      </h4>
                    </div>
                    <span className="text-xs text-amber-600 font-bold pr-1">➔</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🖥️ DESKTOP / PC: ĐẶT NGAY DƯỚI NÚT ÂM THANH NỀN (top-20 right-4) */}
      <aside
        className={`hidden xl:flex fixed top-20 right-4 z-30 flex-col bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border border-amber-200/80 shadow-lg transition-all duration-300 group cursor-pointer ${
          isScrolled
            ? 'w-12 h-12 p-0 rounded-full items-center justify-center hover:w-64 hover:h-auto hover:p-4 hover:rounded-3xl hover:items-stretch'
            : 'w-64 p-4 rounded-3xl items-stretch'
        }`}
      >
        {/* Thu nhỏ thành icon khi cuộn */}
        {isScrolled && (
          <div
            className="flex items-center justify-center w-full h-full group-hover:hidden"
            title="Xem Top Món Gacha Hot"
          >
            <span className="text-xl animate-pulse">🎰</span>
          </div>
        )}

        {/* Nội dung danh sách Top Gacha */}
        <div
          className={
            isScrolled
              ? 'hidden group-hover:flex flex-col gap-3'
              : 'flex flex-col gap-3'
          }
        >
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2 gap-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-2xl shrink-0 animate-bounce">🎰</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide truncate">
                  Top Gacha Hot
                </h3>
                <p className="text-[10px] text-amber-800 font-medium truncate">
                  Quay trúng nhiều nhất hôm nay
                </p>
              </div>
            </div>

            <span className="shrink-0 whitespace-nowrap text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
              HOT 🎯
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {topDishes.map((dish, idx) => {
              const badge = getRankBadge(idx)
              const imageUrl = dish.imageUrl || (dish.image ? urlFor(dish.image).url() : null)
              const slug = typeof dish.slug === 'string' ? dish.slug : dish.slug?.current || dish._id

              return (
                <Link
                  key={dish._id || idx}
                  href={`/recipe/${slug}`}
                  className="flex items-center gap-2.5 p-2 bg-white/90 hover:bg-white rounded-2xl border border-amber-200/50 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group/item"
                >
                  <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-amber-100 border border-amber-200/80">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={dish.title || 'Món ăn'}
                        fill
                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span
                        className={`inline-block text-[8px] font-black px-1.5 py-0.2 rounded border shadow-2xs ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {dish.gachaCount > 0 && (
                        <span className="text-[8px] font-bold text-amber-800 bg-amber-100 px-1 rounded">
                          🎲 {dish.gachaCount}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-amber-950 truncate group-hover/item:text-amber-600 transition-colors">
                      {dish.title}
                    </h4>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}