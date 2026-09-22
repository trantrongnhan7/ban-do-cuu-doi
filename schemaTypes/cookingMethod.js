export default {
  name: 'cookingMethod',
  title: 'Kỹ Thuật Chế Biến',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tên kỹ thuật (Chiên, Hấp, Nướng...)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
}