import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'

// 1. Tối ưu SEO cho link
export async function generateMetadata({ params }) {
  const { slug } = await params
  const dish = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]{ title, description, story, image }`,
    { slug }
  )

  if (!dish) return { title: 'Không tìm thấy món ăn' }

  const imageUrl = dish.image
    ? urlFor(dish.image).width(1200).height(630).format('jpg').url()
    : 'https://bandovigiac.vercel.app/hero-banner.jpg'

  return {
    title: `${dish.title} | Bản Đồ Cứu Đói 🥢`,
    description: dish.story || dish.description || `Khám phá công thức và nguyên liệu món ăn đặc sản Việt Nam.`,
    openGraph: {
      title: `${dish.title} - Bản Đồ Cứu Đói 🥢`,
      description: dish.story || dish.description || `Khám phá công thức và nguyên liệu món ăn đặc sản Việt Nam.`,
      url: `https://bandovigiac.vercel.app/recipe/${slug}`,
      siteName: 'Bản Đồ Cứu Đói',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: dish.title,
        },
      ],
      type: 'article',
    },
  }
}

// 2. Hàm chính hiển thị chi tiết
export default async function RecipeDetail({ params }) {
  const { slug } = await params

  // BƯỚC A: Tìm món ăn hiện tại (Bổ sung fetch story và hashtags)
  const dish = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0] {
      _id,
      title,
      region,
      image,
      story,
      description,
      "hashtags": coalesce(hashtags[]->name, hashtags, tags, []),
      "tags": coalesce(tags[]->name, tags, []),
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

  // Format tên Vùng Miền tiếng Việt
  const formatRegion = (reg) => {
    if (reg === 'ca-3-mien' || reg === 'Cả 3 Miền') return 'Cả 3 Miền'
    if (reg === 'mien-bac' || reg === 'Miền Bắc') return 'Miền Bắc'
    if (reg === 'mien-trung' || reg === 'Miền Trung') return 'Miền Trung'
    if (reg === 'mien-nam' || reg === 'Miền Nam') return 'Miền Nam'
    return reg || 'Cả 3 Miền'
  }

  const regionDisplayName = formatRegion(dish.region).toUpperCase()
  const displayTags = (dish.hashtags && dish.hashtags.length > 0 ? dish.hashtags : dish.tags) || []

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
            {/* Sửa biến item.region -> dish.region */}
            <span className="absolute top-3 right-3 bg-amber-950/70 backdrop-blur-md text-amber-100 text-xs px-2.5 py-1 rounded-full border border-amber-700/30 font-medium z-10">
              {formatRegion(dish.region)}
            </span>
          </div>

          {/* Nội dung chi tiết */}
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-black text-amber-950 mb-4">{dish.title}</h1>

            {/* Thẻ Hashtag */}
            {dish.hashtags && dish.hashtags.length > 0 && (
             <div className="flex flex-wrap gap-2 mb-6">
               {dish.hashtags.map((tag, idx) => (
            <span
             key={idx}
              className="bg-amber-100/80 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200"
        >
               #{typeof tag === 'string' ? tag.replace(/^#/, '') : tag}
            </span>
              ))}
            </div>
        )}

            {/* Câu chuyện món ăn */}
            <section className="mb-8">
              <h2 className="font-[family-name:var(--font-mono)] text-lg font-bold text-amber-900 border-b border-amber-200 pb-2 mb-3">
                &gt; Câu chuyện món ăn_
              </h2>
              <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                {dish.story || dish.description || 'Chưa cập nhật câu chuyện cho món ăn này.'}
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

        {/* Khối hiển thị Món ăn cùng vùng miền */}
        {relatedDishes && relatedDishes.length > 0 && (
          <section className="mt-12 pt-8 border-t border-amber-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg border border-amber-300/40">
                <span className="text-xl">🍲</span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  MÓN NGON KHÁC Ở {regionDisplayName}
                </h3>
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
                  <div className="relative h-36 w-full overflow-hidden bg-amber-100">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {/* Map nhãn Vùng Miền gợi ý sang tiếng Việt */}
                    <span className="absolute top-2.5 right-2.5 bg-amber-950/75 text-amber-50 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {formatRegion(item.region)}
                    </span>
                  </div>

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