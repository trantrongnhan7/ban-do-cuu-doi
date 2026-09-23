import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'

// 1. Tối ưu SEO cho link
export async function generateMetadata({ params }) {
  const { slug } = await params
  const dish = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]{ title, description, image }`,
    { slug }
  )

  if (!dish) return { title: 'Không tìm thấy món ăn' }

  const imageUrl = dish.image ? urlFor(dish.image).width(1200).height(630).url() : ''

  return {
    title: `${dish.title} | Bản Đồ Cứu Đói`,
    description: dish.description || 'Khám phá công thức và nguyên liệu món ăn đặc sản Việt Nam.',
    openGraph: {
      title: dish.title,
      description: dish.description,
      images: [imageUrl],
    },
  }
}

// 2. Hàm chính hiển thị chi tiết
export default async function RecipeDetail({ params }) {
  const { slug } = await params

  // BƯỚC A: Tìm món ăn hiện tại
  const dish = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0] {
      _id,
      title,
      region,
      image,
      description,
      tags,
      ingredients
    }`,
    { slug }
  )

  // BƯỚC B: Nếu không thấy món ăn -> Hiện trang 404
  if (!dish) {
    notFound()
  }

  // BƯỚC C: Tìm 3 món ăn cùng vùng miền (trừ món hiện tại)
  const relatedDishes = await client.fetch(
    `*[_type == "recipe" && region == $region && _id != $id][0...3] {
      _id,
      title,
      "slug": slug.current,
      image,
      region
    }`,
    { region: dish.region, id: dish._id }
  )

  return (
    <main className="min-h-screen bg-amber-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Nút quay lại */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-100/80 text-amber-950 font-bold text-sm rounded-full border border-amber-300/80 shadow-sm hover:shadow transition-all mb-6 group"
        >
          <span className="text-amber-600 group-hover:-translate-x-1 transition-transform">←</span>
          <span>Trở về danh sách món ăn</span>
        </Link>

        {/* Thẻ Chi Tiết Món Ăn */}
        <article className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md mb-8">
          {/* Hình ảnh đại diện */}
          <div className="relative h-72 sm:h-96 w-full bg-amber-100">
            <Image
              src={dish.image ? urlFor(dish.image).url() : ''}
              alt={dish.title}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute top-2 right-2 bg-amber-950/70 backdrop-blur-md text-amber-100 text-[10px] px-2.5 py-0.5 rounded-full border border-amber-700/30 font-medium">
                {item.region === 'ca-3-mien' || item.region === 'Cả 3 Miền'
                   ? 'Cả 3 Miền'
                      : item.region === 'mien-bac' || item.region === 'Miền Bắc'
                    ? 'Miền Bắc'
                     : item.region === 'mien-trung' || item.region === 'Miền Trung'
                    ? 'Miền Trung'
                    : item.region === 'mien-nam' || item.region === 'Miền Nam'
                    ? 'Miền Nam'
                    : item.region || 'Cả 3 Miền'}
             </span>
          </div>

          {/* Nội dung chi tiết */}
          <div className="flex flex-wrap gap-2 mt-4">
           {dish.hashtags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-amber-100/80 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200"
            >
            #{tag}
            </span>
          ))}
            </div>

            {/* Câu chuyện món ăn */}
            <section className="mb-8">
              <h2 className="font-[family-name:var(--font-mono)] text-lg font-bold text-amber-900 border-b border-amber-200 pb-2 mb-3">
                &gt; Câu chuyện món ăn_
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                {dish.description}
              </p>
            </section>

            {/* Nguyên liệu chính */}
            <section className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60">
              <h3 className="font-[family-name:var(--font-mono)] text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
                🛒 Nguyên liệu chính
              </h3>

              {dish.ingredients && dish.ingredients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-amber-900">
                  {dish.ingredients.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border border-amber-100 shadow-sm"
                    >
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-amber-700/70 italic">
                  Chưa cập nhật thông tin nguyên liệu cho món ăn này.
                </p>
              )}
            </section>
          </div>
        </article>

        {/* Khối hiển thị Món ăn cùng vùng miền (Layout dọc cân đối & Đẹp mắt) */}
        {relatedDishes && relatedDishes.length > 0 && (
          <section className="mt-12 pt-8 border-t border-amber-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg border border-amber-300/40">
                <span className="text-xl">🍲</span>
                {/* Hàm định dạng hiển thị tên Vùng Miền */}
{(() => {
  const regionName = 
    dish.region === 'ca-3-mien' || dish.region === 'Cả 3 Miền' ? 'CẢ 3 MIỀN' :
    dish.region === 'mien-bac' || dish.region === 'Miền Bắc' ? 'MIỀN BẮC' :
    dish.region === 'mien-trung' || dish.region === 'Miền Trung' ? 'MIỀN TRUNG' :
    dish.region === 'mien-nam' || dish.region === 'Miền Nam' ? 'MIỀN NAM' :
    (dish.region || 'CẢ 3 MIỀN').toUpperCase();

  return (
    <h3 className="text-lg font-bold text-amber-950 uppercase">
      🍢 MÓN NGON KHÁC Ở {regionName}
    </h3>
  );
})()}
              </div>

              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300 shadow-sm">
                ✨ Gợi ý cùng vị
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedDishes.map((item) => (
                <Link
                  key={item._id}
                  href={`/recipe/${item.slug}`}
                  className="group bg-white rounded-2xl border border-amber-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Khung ảnh vuông vắn tỉ lệ 16:9 */}
                  <div className="relative h-36 w-full overflow-hidden bg-amber-100">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute top-2.5 right-2.5 bg-amber-950/75 text-amber-50 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {item.region}
                    </span>
                  </div>

                  {/* Phần chữ tiêu đề xếp dọc gọn gàng */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <h4 className="font-bold text-amber-950 text-base group-hover:text-amber-700 transition-colors line-clamp-1 mb-1">
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Xem công thức →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}