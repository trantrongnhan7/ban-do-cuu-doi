'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TrendingBar({ dishes = [] }) {
  const [mounted, setMounted] = useState(false)
  const [topDishes, setTopDishes] = useState([])

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

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return {
          icon: '🥇',
          label: 'TOP 1',
          bg: 'bg-amber-500 text-white border-amber-400',
        }
      case 1:
        return {
          icon: '🥈',
          label: 'TOP 2',
          bg: 'bg-slate-400 text-white border-slate-300',
        }
      case 2:
        return {
          icon: '🥉',
          label: 'TOP 3',
          bg: 'bg-amber-700 text-white border-amber-600',
        }
      default:
        return {
          icon: '🔥',
          label: 'TOP 4',
          bg: 'bg-orange-500 text-white border-orange-400',
        }
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto my-3 z-10 px-1">
      {/* 4 thẻ chữ bằng nhau vừa khít chiều dài thanh tìm kiếm, hoàn toàn không có ảnh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {topDishes.map((dish, idx) => {
          const badge = getRankBadge(idx)
          const slug = typeof dish.slug === 'string' ? dish.slug : dish.slug?.current || dish._id

          return (
            <Link
              key={dish._id || idx}
              href={`/recipe/${slug}`}
              className="flex items-center justify-between gap-1 px-2.5 py-2 bg-white/95 hover:bg-white rounded-xl border border-amber-200/80 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`shrink-0 text-[9px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 ${badge.bg}`}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
                <span className="text-xs font-bold text-amber-950 truncate group-hover:text-amber-600 transition-colors">
                  {dish.title}
                </span>
              </div>

              {dish.gachaCount > 0 && (
                <span className="shrink-0 text-[9px] font-bold text-amber-800 bg-amber-100/90 px-1 py-0.5 rounded border border-amber-200/80">
                  {dish.gachaCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}