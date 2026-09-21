import { client } from '@/lib/sanity'
import { DishList } from './DishList'
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

  // Truyền dữ liệu `dishes` sang Client Component
  return <DishList dishes={dishes} />
}