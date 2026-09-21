'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

// Phân loại độ hiếm & Trọng số xuất hiện (Rarity Weight)
function getRarityInfo(tags = []) {
  const isSSR = tags.some(t => ['laudich', 'haisan', 'cuacamau', 'denui', 'tiec'].includes(t.toLowerCase()))
  const isSR = tags.some(t => ['dacsan', 'anchoi', 'banhxeo', 'bundau'].includes(t.toLowerCase()))

  if (isSSR) {
    return {
      label: 'SSR - Món Đã Tay / Ít Ăn 💎',
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      weight: 1 // Tỉ lệ 1x (Hiếm)
    }
  }
  if (isSR) {
    return {
      label: 'SR - Đặc Sản / Ăn Chơi 🌟',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      weight: 3 // Tỉ lệ 3x (Trung bình)
    }
  }
  return {
    label: 'R - Món Quốc Dân / Quốc Hồn 🥣',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    weight: 6 // Tỉ lệ 6x (Phổ biến nhất)
  }
}

// Thuật toán chọn món theo trọng số tỉ lệ (Weighted Random Selection)
function selectWeightedRandomDish(dishes) {
  const weightedList = []
  dishes.forEach((dish) => {
    const rarity = getRarityInfo(dish.tags)
    for (let i = 0; i < rarity.weight; i++) {
      weightedList.push(dish)
    }
  })
  const randomIndex = Math.floor(Math.random() * weightedList.length)
  return weightedList[randomIndex]
}

export default function RandomDishModal({ dishes }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)
  const [spinPhase, setSpinPhase] = useState('FAST') // FAST -> SLOWING -> WIN

  const handleSpin = () => {
    if (!dishes || dishes.length === 0) return

    setIsSpinning(true)
    setSpinPhase('FAST')

    // Chốt kết quả trước theo thuật toán trọng số tỉ lệ
    const finalWinner = selectWeightedRandomDish(dishes)

    let currentDelay = 50 // Tốc độ khởi đầu (siêu nhanh - 50ms/lần)
    let totalSteps = 0
    const maxSteps = 25 // Tổng số lần nhảy món

    const runSpinStep = () => {
      // Chọn ngẫu nhiên 1 món để hiển thị hiệu ứng xáo trộn
      const randomTempDish = dishes[Math.floor(Math.random() * dishes.length)]
      setSelectedDish(randomTempDish)
      totalSteps++

      if (totalSteps > 15) {
        setSpinPhase('SLOWING') // Giai đoạn chậm dần gây hồi hộp
        currentDelay += 40 // Tăng thời gian chờ giữa mỗi nhịp
      } else {
        currentDelay += 5
      }

      if (totalSteps < maxSteps) {
        setTimeout(runSpinStep, currentDelay)
      } else {
        // Chốt món được chọn cuối cùng
        setSelectedDish(finalWinner)
        setIsSpinning(false)
        setSpinPhase('WIN')
      }
    }

    setTimeout(runSpinStep, currentDelay)
  }

  return (
    <>
      {/* Nút Vòng Quay Nổi */}
      <button
        onClick={() => {
          setIsOpen(true)
          handleSpin()
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95 animate-bounce"
      >
        <span className="text-xl">🎰</span>
        <span>Hôm nay ăn gì?</span>
      </button>

      {/* Modal Popup Gacha */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-amber-200 shadow-2xl relative text-center overflow-hidden">
            
            {/* Nút đóng */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center transition-colors z-10"
            >
              ✕
            </button>

            <h3 className="text-2xl font-extrabold text-amber-950 mb-1 flex items-center justify-center gap-2">
              <span>🎰</span>
              <span>Gacha Ẩm Thực</span>
            </h3>
            <p className="text-xs text-amber-800/80 mb-4">
              {isSpinning
                ? spinPhase === 'SLOWING'
                  ? 'Sắp dừng rồi... Món gì đây?! 🫣'
                  : 'Đang quay xáo trộn danh sách... ⚡'
                : 'Chúc bạn ngon miệng với sự lựa chọn này! 🎉'}
            </p>

            {/* Khung quay slot machine */}
            <div className={`relative rounded-2xl p-4 border transition-all duration-300 min-h-[250px] flex flex-col items-center justify-center mb-5 ${
              isSpinning 
                ? 'bg-amber-100/50 border-amber-300 shadow-inner' 
                : 'bg-gradient-to-b from-amber-50 to-orange-50/30 border-amber-200 shadow-md ring-4 ring-amber-400/20'
            }`}>

              {selectedDish && (
                <div className={`transition-all duration-100 ${
                  isSpinning ? 'scale-95 opacity-80 blur-[0.3px]' : 'scale-100 opacity-100 animate-pulse-once'
                }`}>
                  
                  {/* Ảnh món ăn có khung viền đổi màu */}
                  <div className="relative w-36 h-36 mx-auto mb-3 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                    {selectedDish.image && (
                      <Image
                        src={urlFor(selectedDish.image).url()}
                        alt={selectedDish.title || 'Món ăn'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Tên món */}
                  <h4 className="text-xl font-extrabold text-amber-950 line-clamp-1">
                    {selectedDish.title}
                  </h4>

                  {/* Nhãn Độ Hiếm & Tỉ Lệ */}
                  <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRarityInfo(selectedDish.tags).color}`}>
                      {getRarityInfo(selectedDish.tags).label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Nút bấm thao tác */}
            <div className="flex gap-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="flex-1 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-900 font-bold py-3 px-4 rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-50 border border-amber-200/80 shadow-sm"
              >
                {isSpinning ? 'Đang quay...' : 'Quay lại 🔄'}
              </button>

              {selectedDish && !isSpinning && (
                <Link
                  href={`/recipe/${typeof selectedDish.slug === 'string' ? selectedDish.slug : selectedDish.slug?.current || selectedDish._id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 active:scale-95"
                >
                  Xem công thức
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}