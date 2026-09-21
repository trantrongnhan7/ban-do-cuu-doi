'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

export default function RandomDishModal({ dishes }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedDish, setSelectedDish] = useState(null)

  const handleSpin = () => {
    if (!dishes || dishes.length === 0) return
    
    setIsSpinning(true)
    setSelectedDish(null)

    // Hiệu ứng nhảy ngẫu nhiên trong 2 giây trước khi chốt món
    let counter = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dishes.length)
      setSelectedDish(dishes[randomIndex])
      counter++
      
      if (counter > 15) {
        clearInterval(interval)
        setIsSpinning(false)
      }
    }, 100)
  }

  return (
    <>
      {/* Nút bấm mở Vòng quay ở góc màn hình hoặc Header */}
      <button
        onClick={() => {
          setIsOpen(true)
          handleSpin()
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-5 rounded-full shadow-lg border-2 border-white flex items-center gap-2 transition-transform active:scale-95 animate-bounce"
      >
        <span className="text-xl">🎲</span>
        <span>Hôm nay ăn gì?</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-amber-200 shadow-2xl relative text-center">
            
            {/* Nút đóng Modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center"
            >
              ✕
            </button>

            <h3 className="text-xl font-extrabold text-amber-950 mb-1">
              🎲 Vòng Quay Ẩm Thực
            </h3>
            <p className="text-xs text-amber-800/80 mb-4">
              Đang chọn ngẫu nhiên món ăn cho bạn...
            </p>

            {/* Khung hiển thị món ngẫu nhiên */}
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 min-h-[220px] flex flex-col items-center justify-center mb-5">
              {selectedDish && (
                <div className={`transition-all duration-150 ${isSpinning ? 'scale-95 opacity-70 blur-[0.5px]' : 'scale-100 opacity-100'}`}>
                  {/* Ảnh món ăn */}
                  <div className="relative w-32 h-32 mx-auto mb-3 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md">
                    {selectedDish.image && (
                      <Image
                        src={urlFor(selectedDish.image).url()}
                        alt={selectedDish.title || 'Món ăn'}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-amber-950">
                    {selectedDish.title}
                  </h4>
                  <span className="inline-block text-xs font-medium text-amber-700 bg-amber-200/60 px-2.5 py-0.5 rounded-full mt-1">
                    {selectedDish.region}
                  </span>
                </div>
              )}
            </div>

            {/* Các nút thao tác */}
            <div className="flex gap-2">
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {isSpinning ? 'Đang quay...' : 'Quay lại 🔄'}
              </button>

              {selectedDish && !isSpinning && (
                <Link
                  href={`/recipe/${typeof selectedDish.slug === 'string' ? selectedDish.slug : selectedDish.slug?.current || selectedDish._id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-1"
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