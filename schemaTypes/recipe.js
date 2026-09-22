export default {
  name: 'recipe',
  title: 'Món Ăn',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tên món ăn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Đường dẫn (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'region',
      title: 'Miền',
      type: 'string',
      options: {
        list: [
          { title: 'Miền Bắc', value: 'Miền Bắc' },
          { title: 'Miền Trung', value: 'Miền Trung' },
          { title: 'Miền Nam', value: 'Miền Nam' },
          { title: 'Cả 3 Miền 🇻🇳', value: 'Cả 3 Miền' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Hình ảnh',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Mô tả ngắn',
      type: 'text',
      rows: 3,
    },
    {
      name: 'tags',
      title: 'Thẻ Hashtag (phân cách bằng dấu phẩy)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'instructions',
      title: 'Cách chế biến / Công thức',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
  name: 'ingredients',
  title: 'Nguyên liệu',
  type: 'array',
  of: [{ type: 'string' }],
  description: 'Thêm các nguyên liệu cấu thành món ăn (Ví dụ: 500g Bánh phở, 300g Thịt bò...)',
},
  ],
}