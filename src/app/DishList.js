'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import RandomDishModal from './RandomDishModal'

export function DishList({ dishes }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedTag, setSelectedTag] = useState(null)
  const [selectedVibe, setSelectedVibe] = useState(null)
  // State lưu danh sách ID các món ăn đã bookmark (thả tim)
  const [bookmarkedIds, setBookmarkedIds] = useState([])

  // Lấy danh sách bookmark từ localStorage khi vừa tải trang
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saved_dishes_cuudoi')
      if (saved) {
        setBookmarkedIds(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Không thể đọc dữ liệu bookmark từ localStorage', e)
    }
  }, [])

  // Bật / Tắt trạng thái thả tim cho một món ăn
  const toggleBookmark = (dishId, e) => {
    e.preventDefault()
    e.stopPropagation()

    let updatedList = []
    if (bookmarkedIds.includes(dishId)) {
      updatedList = bookmarkedIds.filter((id) => id !== dishId)
    } else {
      updatedList = [...bookmarkedIds, dishId]
    }

    setBookmarkedIds(updatedList)
    try {
      localStorage.setItem('saved_dishes_cuudoi', JSON.stringify(updatedList))
    } catch (e) {
      console.error('Không thể lưu bookmark vào localStorage', e)
    }
  }

  // Lọc danh sách món ăn theo Tìm kiếm, Vùng miền / Bookmark, và Hashtag
  const filteredDishes = dishes.filter((dish) => {
    // Tìm kiếm theo tên hoặc mô tả
    // 👈 Thêm đoạn lọc theo Tình huống
    const matchesVibe =
      !selectedVibe ||
      dish.tags?.some((t) => {
        const normTag = t.toLowerCase()
        if (selectedVibe === 'chaytui') return [ 'binhdan', 'tietkiem', 're'].includes(normTag)
        if (selectedVibe === 'troilanh') return [ 'hot', 'cay', 'lau', 'monnuoc'].includes(normTag)
        if (selectedVibe === 'anchoi') return ['anchoi', 'dacsan', 'anvat'].includes(normTag)
        if (selectedVibe === 'nhau') return ['moinhau', 'haocom', 'donuong', 'haisan', 'nhau'].includes(normTag)
        return true
      })
    const matchesSearch =
      dish.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchQuery.toLowerCase())

    // Lọc theo Vùng miền hoặc Tab "Đã Lưu"
    let matchesRegion = true
    if (selectedRegion === 'saved') {
      matchesRegion = bookmarkedIds.includes(dish._id)
    } else {
      matchesRegion =
        selectedRegion === 'all' ||
        dish.region === 'Cả 3 Miền' ||
        dish.region === selectedRegion ||
        (selectedRegion === 'bac' && dish.region === 'Miền Bắc') ||
        (selectedRegion === 'trung' && dish.region === 'Miền Trung') ||
        (selectedRegion === 'nam' && dish.region === 'Miền Nam')
    }

    // Lọc theo Hashtag
    const matchesTag =
      !selectedTag ||
      dish.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase())

    return matchesSearch && matchesRegion && matchesTag && matchesVibe
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

      {/* Thanh Tìm kiếm & Bộ lọc Vùng miền + Bookmark */}
      <section className="max-w-4xl mx-auto mb-8 space-y-4">
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

        {/* Các nút lọc Vùng miền & Tab Món đã lưu */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: 'all', label: 'Tất Cả 🥢' },
            { id: 'bac', label: 'Miền Bắc 🏔️' },
            { id: 'trung', label: 'Miền Trung 🌊' },
            { id: 'nam', label: 'Miền Nam 🌴' },
            { id: 'saved', label: `Đã Lưu ❤️ (${bookmarkedIds.length})` },
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

        {/* 👈 BỘ LỌC TÌNH HUỐNG CỨU ĐÓI (VIBE FILTER) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {[
            { id: 'chaytui', label: '💸 Cuối Tháng Cháy Túi' },
            { id: 'troilanh', label: '🌧️ Trú Lạnh / Ngày Mưa' },
            { id: 'anchoi', label: '☕ Ăn Chơi Tán Gẫu' },
            { id: 'nhau', label: '🍺 Nhậu Tới Bến' },
          ].map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => setSelectedVibe(selectedVibe === vibe.id ? null : vibe.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                selectedVibe === vibe.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-sm scale-105'
                  : 'bg-white/80 text-amber-900 border-amber-200/80 hover:bg-amber-100/60'
              }`}
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Hiển thị Tag đang được chọn (nếu có) */}
        {selectedTag && (
          <div className="flex items-center justify-center gap-2 pt-2 animate-fade-in">
            <span className="text-xs text-amber-800 font-medium">Đang lọc theo tag:</span>
            <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              #{selectedTag}
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:bg-amber-700 w-4 h-4 rounded-full flex items-center justify-center text-xs ml-0.5"
                title="Bỏ lọc tag"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </section>

      {/* Danh sách Món ăn Grid */}
      <section className="max-w-6xl mx-auto">
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => {
              const isSaved = bookmarkedIds.includes(dish._id)
              return (
                <article
                  key={dish._id}
                  className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative"
                >
                  {/* Hình ảnh & Nút Thả Tim */}
                  <div className="relative h-48 w-full overflow-hidden bg-amber-100">
                    {dish.image && (
                      <Image
                        src={urlFor(dish.image).url()}
                        alt={dish.title || 'Món ăn'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-3 right-3 bg-amber-950/70 backdrop-blur-md text-amber-100 text-xs px-2.5 py-1 rounded-full border border-amber-700/30 font-medium z-10">
                      {dish.region}
                    </span>

                    {/* Nút Bookmark Thả Tim ❤️ */}
                    <button
                      onClick={(e) => toggleBookmark(dish._id, e)}
                      title={isSaved ? 'Bỏ lưu món ăn' : 'Lưu món ăn vào sổ tay'}
                      className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 ${
                        isSaved
                          ? 'bg-rose-500 text-white shadow-lg scale-110'
                          : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 shadow-sm'
                      }`}
                    >
                      <span className="text-base transition-transform active:scale-125">
                        {isSaved ? '❤️' : '🤍'}
                      </span>
                    </button>
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

                    {/* Hashtags & Nút xem thêm */}
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {dish.tags?.map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                              selectedTag?.toLowerCase() === tag.toLowerCase()
                                ? 'bg-amber-600 text-white font-bold shadow-sm scale-105'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-200 border border-amber-200/60'
                            }`}
                          >
                            #{tag}
                          </button>
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
              )
            })}
          </div>
        ) : (
          /* Trạng thái không tìm thấy món */
          <div className="text-center py-12 px-4 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200/80 my-6">
            <div className="relative inline-block mb-3">
              <span className="text-5xl block animate-bounce">
                {selectedRegion === 'saved' ? '💔' : '🥣'}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-amber-950 mb-1">
              {selectedRegion === 'saved'
                ? 'Bạn chưa lưu món ăn nào!'
                : 'Bếp hết món này rồi bạn ơi!'}
            </h3>
            
            <p className="text-amber-800/80 text-sm max-w-sm mx-auto leading-relaxed italic mb-4">
              {selectedRegion === 'saved'
                ? 'Hãy bấm vào biểu tượng trái tim 🤍 ở góc từng món ăn để lưu lại món bạn yêu thích nhé!'
                : '"Đầu bếp tìm hoài trong bếp mà không thấy món nào phù hợp... Bạn thử bỏ lọc bớt tag hoặc đổi từ khóa nhé!"'}
            </p>

            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="inline-block text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
              >
                Bỏ lọc #{selectedTag} ✕
              </button>
            )}
          </div>
        )}
      </section>

      {/* Vòng quay ngẫu nhiên */}
      <RandomDishModal dishes={dishes} />
    </main>
  )
}