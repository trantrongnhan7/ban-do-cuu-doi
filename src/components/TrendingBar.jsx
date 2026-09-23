'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

export default function TrendingBar({ dishes = [] }) {
  const [mounted, setMounted] = useState(false)
  const [topDishes, setTopDishes] = useState([])

  // Hàm tính toán Top 1 -> Top 4 từ dữ liệu gacha trong ngày
  const calculateTopGachaDishes = () => {
    if (!dishes || dishes.length === 0) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const storageKey = `gacha_stats_${today}`
      const stats = JSON.parse(localStorage.getItem(storageKey) || '{}')

      const dishesWithCount = dishes.map((dish) => ({
        ...dish,
        gachaCount: stats[dish._id] || 0,
      }))

      dishesWithCount.sort((a, b) => b.gachaCount - a.gachaCount)

      const hasSpins = Object.keys(stats).length > 0
      const result = hasSpins ? dishesWithCount.slice(0, 4) : dishes.slice(0, 4)

      setTopDishes(result)
    } catch (e) {
      setTopDishes(dishes.slice(0, 4))
    }
  }

  useEffect(() => {
    setMounted(true)
    calculateTopGachaDishes()

    const handleGachaUpdate = () => {
      calculateTopGachaDishes()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('gacha_updated', handleGachaUpdate)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gacha_updated', handleGachaUpdate)
      }
    }
  }, [dishes])

  if (!mounted || !topDishes || topDishes.length === 0) return null

  // Huy hiệu thiết kế theo từng thứ hạng Top 1 - 4
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return {
          label: '🥇 TOP 1',
          bg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-sm',
        }
      case 1:
        return {
          label: '🥈 TOP 2',
          bg: 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-slate-300 shadow-sm',
        }
      case 2:
        return {
          label: '🥉 TOP 3',
          bg: 'bg-gradient-to-r from-amber-700 to-orange-800 text-white border-amber-500 shadow-sm',
        }
      default:
        return {
          label: '🔥 TOP 4',
          bg: 'bg-stone-200 text-stone-700 border-stone-300',
        }
    }
  }

  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm animate-pulse">🔥</span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-950">
            Top Món Được Săn Đón Nhất
          </span>
        </div>
        <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/80">
          Cập nhật từ Gacha 🎲
        </span>
      </div>

      {/* Grid chia 2 cột trên Mobile nhỏ, 4 cột đều đẹp mắt trên Tablet/PC */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {topDishes.map((dish, idx) => {
          const badge = getRankBadge(idx)
          const imageUrl = dish.imageUrl || (dish.image ? urlFor(dish.image).url() : null)
          const slug = typeof dish.slug === 'string' ? dish.slug : dish.slug?.current || dish._id

          return (
            <Link
              key={dish._id || idx}
              href={`/recipe/${slug}`}
              className="flex items-center gap-2 p-2 bg-white/90 hover:bg-white rounded-2xl border border-amber-200/70 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden bg-amber-100 border border-amber-200">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={dish.title || 'Món ăn'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <span
                    className={`text-[8px] font-black px-1.5 py-0.2 rounded-md border ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                  {dish.gachaCount > 0 && (
                    <span className="text-[8px] font-bold text-amber-800 bg-amber-50 px-1 rounded border border-amber-200/60">
                      {dish.gachaCount}x
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-amber-950 truncate group-hover:text-amber-600 transition-colors">
                  {dish.title}
                </h4>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}