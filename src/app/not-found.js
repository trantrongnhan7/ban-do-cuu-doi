import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-amber-50/60 flex items-center justify-center p-6 text-center select-none">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-lg max-w-md w-full transform hover:-translate-y-1 transition-all duration-300">
        {/* Biểu tượng hoang mang */}
        <div className="relative inline-block mb-4">
          <span className="text-7xl block animate-bounce">🥣</span>
          <span className="absolute -top-2 -right-2 text-2xl">🔍</span>
        </div>

        {/* Tiêu đề hài hước */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 mb-3">
          404: Món này chưa lên mâm!
        </h1>

        {/* Lời nhắn dí dỏm */}
        <p className="text-amber-900/80 text-sm leading-relaxed mb-6 italic">
          "Hay là bạn thử gõ tên món khác mặn mòi hơn xem sao?!"
        </p>

        {/* Nút quay về */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-2xl text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all"
        >
          🏃‍♂️ Về lại menu tìm món khác
        </Link>
      </div>
    </main>
  )
}