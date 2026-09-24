import { Be_Vietnam_Pro, Comfortaa, Space_Mono } from 'next/font/google'
import './globals.css'
import BackgroundAmbience from '../components/BackgroundAmbience'
// 1. Font Comfortaa cho tiêu đề bo tròn
const comfortaa = Comfortaa({
  subsets: ['vietnamese', 'latin'],
  weight: ['700'],
  variable: '--font-playful',
})

// 2. Font Space_Mono cho dòng mô tả thứ 2
const spaceMono = Space_Mono({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

// 3. Font Be Vietnam Pro làm font nền
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata = {
  metadataBase: new URL('https://bandovigiac.vercel.app'),
  title: 'Bản Đồ Cứu Đói 🥢 | Khám Phá Ẩm Thực Việt Nam 3 Miền',
  description:
    'Bản đồ vị giác 3 miền: Lưu giữ hương vị xưa bằng góc nhìn mới. Gợi ý món ăn thông minh theo thời tiết, vị trí và vòng quay Gacha ẩm thực.',
  keywords: [
    'Bản đồ cứu đói',
    'Ẩm thực Việt Nam',
    'Món ngon 3 miền',
    'Hôm nay ăn gì',
    'Gacha món ăn',
  ],
  authors: [{ name: 'Bản Đồ Cứu Đói' }],
  openGraph: {
    title: 'Bản Đồ Cứu Đói 🥢 | Hôm nay ăn gì?',
    description:
      'Gợi ý món ăn chuẩn vị 3 miền theo thời tiết & tâm trạng. Bấm vòng quay Gacha để giải quyết câu hỏi "Hôm nay ăn gì?" ngay lập tức!',
    url: 'https://bandovigiac.vercel.app',
    siteName: 'Bản Đồ Cứu Đói',
    images: [
      {
        url: 'https://bandovigiac.vercel.app/hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Bản Đồ Cứu Đói - Ẩm Thực Việt Nam',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bản Đồ Cứu Đói 🥢',
    description: 'Bản đồ vị giác 3 miền & Gacha gợi ý món ăn chuẩn thời tiết.',
    images: ['https://bandovigiac.vercel.app/hero-banner.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} ${comfortaa.variable} ${spaceMono.variable}`}>
        <BackgroundAmbience />
        {children}
      </body>
    </html>
  )
}