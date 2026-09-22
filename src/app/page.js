import { client } from '@/lib/sanity'
import { DishList } from './DishList'

export const revalidate = 0;

export default async function Home() {
  const dishes = await client.fetch(`*[_type == "recipe"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    region,
    image,
    description,
    tags,
  }`)

  return <DishList dishes={dishes} />
}