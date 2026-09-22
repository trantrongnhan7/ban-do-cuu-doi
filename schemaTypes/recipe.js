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
      options: { source: 'title', maxLength: 96 },
    },
    {
      name: 'image',
      title: 'Hình ảnh',
      type: 'image',
      options: { hotspot: true },
    },

    // 💎 TIER GACHA CHÍNH (Phân hạng hệ thống)
    {
      name: 'rarityTier',
      title: 'Xếp Hạng Tier Gacha',
      type: 'string',
      options: {
        list: [
          { title: 'N - Bữa Cơm / Bình Dân (Xanh Lá)', value: 'N' },
          { title: 'R - Đặc Sản Vùng Miền (Xanh Dương)', value: 'R' },
          { title: 'SR - Tinh Tế / Cầu Kỳ (Tím)', value: 'SR' },
          { title: 'SSR - Thượng Hạng / Hiếm Có (Vàng Kim)', value: 'SSR' },
        ],
        layout: 'radio',
      },
      initialValue: 'N',
      validation: (Rule) => Rule.required(),
    },

    // 🗺️ ĐỊA PHƯƠNG
    {
      name: 'region',
      title: 'Vùng Miền',
      type: 'string',
      options: {
        list: [
          { title: 'Miền Bắc', value: 'mien-bac' },
          { title: 'Miền Trung', value: 'mien-trung' },
          { title: 'Miền Nam', value: 'mien-nam' },
          { title: 'Cả 3 Miền', value: 'ca-3-mien' },
        ],
      },
    },

    // 🍜 DẠNG MÓN
    {
      name: 'dishType',
      title: 'Dạng Món Ăn',
      type: 'string',
      options: {
        list: [
          { title: 'Món Sợi (Bún / Phở / Mì / Hủ tiếu)', value: 'mon-soi' },
          { title: 'Cơm & Xôi', value: 'com-xoi' },
          { title: 'Bánh Truyền Thống', value: 'banh' },
          { title: 'Món Lẩu / Canh / Nước', value: 'mon-nuoc' },
          { title: 'Món Khô / Trộn / Cuốn', value: 'mon-kho' },
          { title: 'Món Ăn Vặt / Tráng Miệng', value: 'an-vat' },
          { title: 'Món Chiên / Rán / Xào', value: 'mon-chien-xao'},
          { title: 'Món Nướng / Hấp ', value: 'mon-nuong-hap' },
          { title: 'Món Ăn Chay / Thuần Chay', value: 'mon-chay' },
          { title: 'Món Kho / Rim / Hầm', value: 'mon-kho-rim-ham' },
        ],
      },
    },

    // 🔗 LINK NGUYÊN LIỆU CHÍNH (Reference)
    {
      name: 'mainIngredients',
      title: 'Nguyên Liệu Chính',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'ingredient' }] }],
    },

    // 🔗 LINK KỸ THUẬT CHẾ BIẾN (Reference)
    {
      name: 'cookingMethods',
      title: 'Kỹ Thuật Chế Biến',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'cookingMethod' }] }],
    },

    // 🌶️ ĐẶC ĐIỂM VỊ GIÁC
    {
      name: 'tasteProfiles',
      title: 'Đặc Điểm Vị Giác',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Đậm đà', value: 'dam-da' },
          { title: 'Cay', value: 'cay' },
          { title: 'Ngọt', value: 'ngot' },
          { title: 'Chua', value: 'chua' },
          { title: 'Béo ngậy', value: 'beo-ngay' },
          { title: 'Thanh mát', value: 'thanh-mat' },
          { title: 'Chát / Đắng', value: 'chat-dang' },
        ],
      },
    },

    // 🎯 HOÀN CẢNH & KHUNG GIỜ
    {
      name: 'mealTime',
      title: 'Khung Giờ Thích Hợp',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sáng', value: 'sang' },
          { title: 'Trưa', value: 'trua' },
          { title: 'Tối', value: 'toi' },
          { title: 'Ăn Khuya', value: 'an-khuya' },
          { title: 'Mọi lúc', value: 'moi-luc' },
        ],
      },
    },
    {
      name: 'occasion',
      title: 'Ngữ Cảnh Ăn Uống (Vibe Cứu Đói)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '💸 Cuối Tháng Cháy Túi', value: 'cuoi-thang-chay-tui' },
          { title: '🌧️ Trú Lạnh / Ngày Mưa', value: 'tru-lanh-ngay-mua' },
          { title: '☕ Ăn Chơi Tán Gẫu', value: 'an-choi-tan-gau' },
          { title: '🍺 Nhậu Tới Bến', value: 'nhau-toi-ben' },
        ],
      },
    },

    // 🏷️ LINK BỘ HASHTAG TẬP TRUNG (Reference)
    {
      name: 'hashtags',
      title: 'Bộ Thẻ Hashtag',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'hashtag' }] }],
    },

    // 📖 CÂU CHUYỆN VĂN HÓA & NGUỒN GỐC
    {
      name: 'story',
      title: 'Nguồn Gốc & Câu Chuyện Văn Hóa',
      type: 'text',
      rows: 6,
    },
  ],
}