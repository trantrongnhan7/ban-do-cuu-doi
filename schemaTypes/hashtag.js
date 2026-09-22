export default {
  name: 'hashtag',
  title: 'Thẻ Hashtag',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tên Hashtag (Có dấu #)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (Không dấu)',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    {
      name: 'category',
      title: 'Nhóm Hashtag',
      type: 'string',
      options: {
        list: [
          { title: '1. Định danh món ăn', value: 'mon-an' },
          { title: '2. Địa danh & Vùng miền', value: 'vung-mien' },
          { title: '3. Hành vi & Cảm xúc', value: 'hanh-vi' },
          { title: '4. Tier Gacha & Hiếm', value: 'gacha' },
        ],
      },
    },
  ],
}