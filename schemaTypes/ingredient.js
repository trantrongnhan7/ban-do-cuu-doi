export default {
  name: 'ingredient',
  title: 'Nguyên Liệu',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tên nguyên liệu',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'group',
      title: 'Nhóm nguyên liệu',
      type: 'string',
      options: {
        list: [
          { title: 'Tinh bột / Hạt', value: 'tinh-bot' },
          { title: 'Thịt / Gia cầm', value: 'thit' },
          { title: 'Hải sản / Cá', value: 'hai-san' },
          { title: 'Rau / Nấm / Củ', value: 'rau-nam' },
          { title: 'Gia vị / Mắm / Tinh dầu', value: 'gia-vi' },
        ],
      },
    },
  ],
}