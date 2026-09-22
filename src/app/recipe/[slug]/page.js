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

  // BƯỚC A: Tìm món ăn hiện tại trước
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

  // BƯỚC C: Sau khi đã có 'dish', tìm 3 món ăn cùng vùng miền (trừ món hiện tại)
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
  {/* Khối hiển thị 3 món gợi ý */}

  <section className="mt-10 pt-8 border-t border-amber-200/60">
    <h3 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
      🍲 Món ngon khác ở {dish.region}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {relatedDishes.map((item) => (
        <Link
          key={item._id}
          href={`/recipe/${item.slug}`}
          className="group bg-white p-3 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-all flex sm:flex-col items-center gap-3"
        >
          {item.image && (
            <div className="relative w-16 h-16 sm:w-full sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={urlFor(item.image).url()}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <span className="font-semibold text-amber-900 text-sm group-hover:text-amber-700">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  </section>

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

        <article className="bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md">
          {/* Hình ảnh đại diện */}
          <div className="relative h-72 sm:h-96 w-full bg-amber-100">
            <Image
              src={dish.image ? urlFor(dish.image).url() : ''}
              alt={dish.title}
              fill
              className="object-cover"
              priority
            />
            <span className="absolute top-4 right-4 bg-amber-950/80 backdrop-blur-md text-amber-100 text-xs px-3 py-1.5 rounded-full border border-amber-700/40 font-medium">
              {dish.regionName}
            </span>
          </div>

          {/* Nội dung chi tiết */}
          <div className="p-6 sm:p-10">
            <h1 className="font-[family-name:var(--font-playful)] text-3xl sm:text-4xl font-extrabold text-amber-950 mb-4">
              {dish.title}
            </h1>

            {/* Các tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {dish.tags?.map((tag, idx) => (
                <span key={idx} className="bg-amber-100/70 text-amber-800 text-xs px-2.5 py-1 rounded-md font-medium border border-amber-200">
                  #{tag}
                </span>
              ))}
            </div>
            <section className="mb-8">
              <h2 className="font-[family-name:var(--font-mono)] text-lg font-bold text-amber-900 border-b border-amber-200 pb-2 mb-3">
                &gt; Câu chuyện món ăn_
              </h2>
              <p className="text-slate-700 leading-relaxed text-base">
                {dish.description}
              </p>
            </section>
            <section className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/60">
  <h3 className="font-[family-name:var(--font-mono)] text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
    🛒 Nguyên liệu chính
  </h3>

  {dish.ingredients && dish.ingredients.length > 0 ? (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-amber-900">
      {dish.ingredients.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border border-amber-100 shadow-sm">
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
      </div>
    </main>
  )
}