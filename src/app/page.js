import { client } from '@/lib/sanity'
import { DishList } from './DishList'
import Image from 'next/image'

export const revalidate = 0;

export default async function Home() {
  // Fetch dữ liệu từ Sanity ở Server
  const dishes = await client.fetch(`*[_type == "recipe"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    region,
    image,
    description,
    tags,
  }`)

  // Truyền dữ liệu 'dishes' sang Client Component
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* KHỐI BANNER HEADER TRANG TRÍ */}
      <div className="relative w-full bg-[#fbf6ee] py-8 px-4 overflow-hidden border-b border-amber-200/60 shadow-inner flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Hiệu ứng mờ nền phía sau */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('/hero-banner.png')" }}
        />

        {/* Ảnh Logo/Banner chính */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 drop-shadow-xl hover:scale-105 transition-transform duration-300">
          <Image
            src="/hero-banner.png"
            alt="Ẩm Thực Việt Nam"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Chữ tiêu đề giới thiệu đi kèm */}
        <div className="text-center sm:text-left z-10 max-w-md">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
            Bản Đồ Ẩm Thực
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-amber-950 mt-2 mb-1 tracking-tight">
            Bản Đồ Cứu Đói
          </h1>
          <p className="text-sm text-amber-800/80 leading-relaxed font-medium">
            Khám phá hương vị Việt – Tự động gợi ý món ngon 3 miền cho tâm hồn ăn uống!
          </p>
        </div>
      </div>

      {/* Danh sách món ăn chính */}
      <DishList dishes={dishes} />
    </main>
  )
}