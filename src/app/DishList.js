'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import RandomDishModal from './RandomDishModal'

export function DishList({ dishes }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Lọc danh sách món ăn theo Tìm kiếm và Vùng miền
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch =
      dish.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion =
      selectedRegion === 'all' ||
      dish.region === 'Cả 3 Miền' ||
      dish.region === selectedRegion ||
      (selectedRegion === 'bac' && dish.region === 'Miền Bắc') ||
      (selectedRegion === 'trung' && dish.region === 'Miền Trung') ||
      (selectedRegion === 'nam' && dish.region === 'Miền Nam')

    return matchesSearch && matchesRegion
  })

  return (
    <main className="min-h-screen bg-amber-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header / Tiêu đề */}
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="font-[family-name:var(--font-playful)] text-4xl sm:text-5xl font-extrabold text-amber-50 drop-shadow-[0_3px_5px_rgba(180,83,9,0.5)] mb-4 tracking-wide leading-tight py-2">
          🥢Bản Đồ Cứu Đói🍺
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs sm:text-sm text-amber-800 bg-amber-100/80 inline-block px-4 py-2 rounded-full border border-amber-200 shadow-sm">
          &gt; Bản đồ vị giác 3 miền: Lưu giữ hương vị xưa bằng góc nhìn mới_
        </p>
      </header>

      {/* Thanh Tìm kiếm & Bộ lọc Vùng miền */}
      <section className="max-w-4xl mx-auto mb-10 space-y-4">
        {/* Input Tìm kiếm */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Tìm tên món ăn, hương vị, tỉnh thành..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 bg-white rounded-2xl border border-amber-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-amber-950 transition-all placeholder:text-amber-400"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🍜</span>
        </div>

        {/* Các nút lọc Vùng miền */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'Tất Cả 🥢' },
            { id: 'bac', label: 'Miền Bắc 🏔️' },
            { id: 'trung', label: 'Miền Trung 🌊' },
            { id: 'nam', label: 'Miền Nam 🌴' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedRegion === tab.id
                  ? 'bg-amber-800 text-white shadow-md shadow-amber-900/20 scale-105'
                  : 'bg-white text-amber-800 hover:bg-amber-100/70 border border-amber-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Danh sách Món ăn Grid */}
      <section className="max-w-6xl mx-auto">
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <article
                key={dish._id}
                className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Hình ảnh */}
                <div className="relative h-48 w-full overflow-hidden bg-amber-100">
                  {dish.image && (
                    <Image
                      src={urlFor(dish.image).url()}
                      alt={dish.title || 'Món ăn'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <span className="absolute top-3 right-3 bg-amber-950/70 backdrop-blur-md text-amber-100 text-xs px-2.5 py-1 rounded-full border border-amber-700/30 font-medium">
                    {dish.region}
                  </span>
                </div>

                {/* Nội dung card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                      {dish.title}
                    </h3>
                    <p className="text-amber-800/80 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>

                  {/* Tags & Nút xem thêm */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {dish.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded border border-amber-200/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/recipe/${dish.slug || dish._id}`}
                      className="text-xs font-bold text-amber-800 group-hover:text-amber-600 flex items-center gap-1 transition-colors font-[family-name:var(--font-mono)]"
                    >
                      Xem Thêm -&gt;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Trạng thái không tìm thấy món */
          <div className="text-center py-12 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200/80 my-6">
    <div className="relative inline-block mb-3">
      <span className="text-5xl block animate-bounce">🥣</span>
      <span className="absolute -top-1 -right-2 text-xl">❌</span>
    </div>
    
    <h3 className="text-lg font-extrabold text-amber-950 mb-1">
      Bếp hết món này rồi bạn ơi!
    </h3>
    
    <p className="text-amber-800/80 text-sm max-w-sm mx-auto leading-relaxed italic mb-4">
      "Đầu bếp tìm hoài trong bếp mà không thấy món này đâu... Có vẻ như từ khóa bị sai hoặc món ăn đã bị ai đó 'chén' mất rồi!"
    </p>

    <span className="inline-block text-xs font-mono bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
      💡 Gợi ý: Tìm "Phở", "Bún", "Cơm" hoặc đổi vùng miền nhé!
    </span>
  </div>
        )}
      </section>
      {/* Vòng quay ngẫu nhiên đặt cố định ở góc màn hình */}
      <RandomDishModal dishes={dishes} />
    </main>
  )
}
