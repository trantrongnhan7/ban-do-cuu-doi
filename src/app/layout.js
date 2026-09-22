import { Be_Vietnam_Pro, Comfortaa, Space_Mono } from 'next/font/google'
import './globals.css'

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
  title: 'Bản Đồ Cứu Đói',
  description: 'Bản đồ ẩm thực ba miền',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.className} ${comfortaa.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  )
}