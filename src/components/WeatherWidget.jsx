'use client'

import { useState, useEffect } from 'react'

export default function WeatherWidget({ onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false) // State bật/tắt menu trên mobile
  const [mounted, setMounted] = useState(false)
  const [weather, setWeather] = useState({
    city: 'Đang xác định...',
    temp: '--',
    timePeriodLabel: 'Đang tải',
    condition: 'Đang quét thời tiết...',
    icon: '🌤️',
    suggestion: 'Đang tìm gợi ý vị giác phù hợp nhất...',
    bgGradient: 'from-amber-50 to-orange-50',
  })

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > 120) {
          setIsScrolled(true)
        } else {
          setIsScrolled(false)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const getTimePeriod = (hour) => {
      if (hour >= 4 && hour < 6) return { label: 'Sáng sớm', icon: '🌅' }
      if (hour >= 6 && hour < 11) return { label: 'Buổi sáng', icon: '☀️' }
      if (hour >= 11 && hour < 14) return { label: 'Buổi trưa', icon: '🌤️' }
      if (hour >= 14 && hour < 16) return { label: 'Buổi chiều', icon: '🌤️' }
      if (hour >= 16 && hour < 18) return { label: 'Xế chiều', icon: '🌆' }
      if (hour >= 18 && hour < 22) return { label: 'Buổi tối', icon: '🌙' }
      return { label: 'Nửa đêm', icon: '🌌' }
    }

    const parseWeatherAndPeriod = (code, temp, hour) => {
      const period = getTimePeriod(hour)
      const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 97, 98, 99].includes(code)
      const isStorm = [65, 82, 95, 96, 97, 98, 99].includes(code)

      if (isStorm) {
        return {
          periodLabel: period.label,
          icon: '⛈️',
          condition: 'Mưa bão giông giật',
          suggestion: `${period.label} mây đen giông bão, trốn trong nhà làm nồi lẩu hoặc món cay nóng húp xuýt xoa là chuẩn bài!`,
          bgGradient: 'from-slate-100 to-slate-200',
        }
      }

      if (isRaining) {
        return {
          periodLabel: period.label,
          icon: '🌧️',
          condition: 'Trời mưa ướt át',
          suggestion: `${period.label} trời mưa râm râm mát lạnh, húp ngay một tô Bún Mọc hoặc Phở nóng hổi thôi!`,
          bgGradient: 'from-sky-50 to-blue-100',
        }
      }

      if ([45, 48, 3].includes(code)) {
        return {
          periodLabel: period.label,
          icon: '🌫️',
          condition: 'Sương mờ âm u',
          suggestion: `${period.label} trời se xám mờ sương, làm dĩa đồ ăn ấm áp kèm ly trà nóng cho tỉnh táo nhé!`,
          bgGradient: 'from-stone-100 to-amber-50',
        }
      }

      if (temp <= 22) {
        return {
          periodLabel: period.label,
          icon: '🌬️',
          condition: 'Trời se lạnh',
          suggestion: `${period.label} gió lạnh ùa về, ưu tiên dĩa cơm nóng kho đậm vị hoặc tô cháo ấm bụng nào!`,
          bgGradient: 'from-blue-50 to-indigo-50',
        }
      }

      if (temp >= 32) {
        return {
          periodLabel: period.label,
          icon: '🔥',
          condition: 'Nắng oi bức',
          suggestion: `${period.label} nắng gắt oi nồng, chọn các món thanh mát, gỏi cuốn hoặc chè giải nhiệt thôi!`,
          bgGradient: 'from-amber-100 to-orange-100',
        }
      }

      switch (period.label) {
        case 'Sáng sớm':
          return {
            periodLabel: period.label,
            icon: '🌅',
            condition: 'Trời hửng sáng',
            suggestion: 'Sáng sớm không khí trong lành, nạp năng lượng bằng tô Bún Mọc hoặc Cơm Tấm đón ngày mới nhé!',
            bgGradient: 'from-orange-50 to-amber-50',
          }
        case 'Buổi sáng':
          return {
            periodLabel: period.label,
            icon: '☀️',
            condition: 'Nắng sáng dịu',
            suggestion: 'Buổi sáng năng lượng, làm dĩa Cơm Tấm Sài Gòn hoặc Mì Quảng cho chắc bụng làm việc nào!',
            bgGradient: 'from-amber-50 to-yellow-50',
          }
        case 'Buổi trưa':
          return {
            periodLabel: period.label,
            icon: '🌤️',
            condition: 'Trời nắng trưa',
            suggestion: 'Đã đến giờ nghỉ trưa! Làm một bữa cơm tròn vị nạp lại năng lượng tiếp tục công việc nhé.',
            bgGradient: 'from-yellow-50 to-amber-100',
          }
        case 'Buổi chiều':
          return {
            periodLabel: period.label,
            icon: '🌤️',
            condition: 'Nắng chiều dịu',
            suggestion: 'Nắng chiều đã dịu hẳn, chọn một món nhẹ nhàng để chuẩn bị cho buổi tối thôi nào!',
            bgGradient: 'from-amber-50 to-orange-50',
          }
        case 'Xế chiều':
          return {
            periodLabel: period.label,
            icon: '🌆',
            condition: 'Mặt trời lặn',
            suggestion: 'Xế chiều bụng cồn cào, tạt qua làm vài món ăn vặt, Bánh Cuốn hay chè chiều nào!',
            bgGradient: 'from-orange-100 to-rose-50',
          }
        case 'Buổi tối':
          return {
            periodLabel: period.label,
            icon: '🌙',
            condition: 'Phố lên đèn',
            suggestion: 'Tối đến phố xá lên đèn, rủ cạ cứng đi ăn đồ nướng, lẩu hoặc lai rai vài món nhậu thôi!',
            bgGradient: 'from-indigo-50 to-slate-100',
          }
        default:
          return {
            periodLabel: period.label,
            icon: '🌌',
            condition: 'Đêm muộn tĩnh mịch',
            suggestion: 'Nửa đêm cày phim cày code bị đói? Làm tô cháo đêm hoặc món ăn vặt nhẹ bụng ấm áp ngay!',
            bgGradient: 'from-slate-100 to-amber-50',
          }
      }
    }

    // Hàm lấy tên Quận/Huyện/Thành phố cụ thể từ GPS
    const getDetailedLocationName = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`
        )
        const data = await res.json()
        const district = data.locality || data.city || data.principalSubdivision
        const city = data.principalSubdivision || ''

        if (district && city && district !== city) {
          return `${district}, ${city}`
        }
        return district || city || 'Vị trí của bạn'
      } catch (e) {
        return 'Vị trí của bạn'
      }
    }

    // Lấy thời tiết thời gian thực kèm vị trí cụ thể
    const fetchRealWeather = async (lat = 10.8231, lon = 106.6297, isDefault = false) => {
      const currentHour = new Date().getHours()
      try {
        let locationName = 'TP. Hồ Chí Minh'
        if (!isDefault) {
          locationName = await getDetailedLocationName(lat, lon)
        }

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        )
        const data = await res.json()
        const temp = Math.round(data.current.temperature_2m)
        const code = data.current.weather_code

        const parsed = parseWeatherAndPeriod(code, temp, currentHour)

        setWeather({
          city: locationName,
          temp: temp,
          timePeriodLabel: parsed.periodLabel,
          condition: parsed.condition,
          icon: parsed.icon,
          suggestion: parsed.suggestion,
          bgGradient: parsed.bgGradient,
        })
      } catch (err) {
        const parsed = parseWeatherAndPeriod(0, 28, new Date().getHours())
        setWeather((prev) => ({
          ...prev,
          city: 'TP. Hồ Chí Minh',
          timePeriodLabel: parsed.periodLabel,
          condition: 'Thời tiết dễ chịu',
          suggestion: parsed.suggestion,
        }))
      }
    }

    if (typeof window !== 'undefined' && navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchRealWeather(pos.coords.latitude, pos.coords.longitude, false),
        () => fetchRealWeather(10.8231, 106.6297, true)
      )
    } else {
      fetchRealWeather(10.8231, 106.6297, true)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* 📱 NÚT ICON BẤM BẬT/TẮT TRÊN ĐIỆN THOẠI IPHONE / MOBILE (Cố định góc trái dưới màn hình) */}
      <div className="xl:hidden fixed bottom-6 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-amber-300 flex items-center justify-center text-xl active:scale-95 transition-transform"
          aria-label="Thời tiết & Gợi ý"
        >
          {weather.icon}
        </button>
      </div>

      {/* 🖥️ CẢ PC VÀ MOBILE: KHUNG POPUP / WIDGET */}
      <aside
        onClick={() => {
          if (isMobileOpen) setIsMobileOpen(false)
        }}
        className={`fixed z-40 bg-gradient-to-br ${
          weather.bgGradient
        } backdrop-blur-md border border-amber-200/80 shadow-2xl xl:shadow-lg transition-all duration-300 group cursor-pointer ${
          // Xử lý vị trí & kích thước cho Mobile vs Desktop
          isMobileOpen
            ? 'bottom-20 left-4 right-4 p-4 rounded-3xl flex flex-col xl:bottom-auto xl:left-3 xl:right-auto'
            : 'hidden xl:flex fixed top-24 left-3 flex-col'
        } ${
          isScrolled && !isMobileOpen
            ? 'xl:w-12 xl:h-12 xl:p-0 xl:rounded-full xl:items-center xl:justify-center xl:hover:w-60 xl:hover:h-auto xl:hover:p-4 xl:hover:rounded-3xl xl:hover:items-stretch'
            : 'xl:w-60 xl:p-4 xl:rounded-3xl xl:items-stretch'
        }`}
      >
        {/* Nút tròn thu gọn chỉ chạy ở màn hình PC lớn */}
        {isScrolled && !isMobileOpen && (
          <div
            className="hidden xl:flex items-center justify-center w-full h-full group-hover:hidden"
            title="Bấm để xem thời tiết & gợi ý món"
          >
            <span className="text-xl animate-pulse">{weather.icon}</span>
          </div>
        )}

        {/* Nội dung chi tiết */}
        <div
          className={
            isScrolled && !isMobileOpen
              ? 'hidden group-hover:flex flex-col gap-3'
              : 'flex flex-col gap-3'
          }
        >
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                {weather.icon}
              </span>
              <div>
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1 truncate max-w-[170px]" title={weather.city}>
                  📍 {weather.city}
                </div>
                <div className="text-[11px] text-amber-900/80 font-semibold">
                  {weather.timePeriodLabel} • {weather.temp}°C
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-white/80 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300/80 shadow-xs">
              Gợi Ý
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-medium italic">
            "{weather.suggestion}"
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMobileOpen(false) // Đóng popup trên mobile sau khi chọn

              if (!onSelectCategory) return

              const currentHour = new Date().getHours()
              const isRainingOrCold =
                weather.condition.includes('Mưa') ||
                weather.condition.includes('bão') ||
                weather.temp <= 22

              if (isRainingOrCold) {
                onSelectCategory('troilanh')
                return
              }

              if (currentHour >= 5 && currentHour < 11) {
                onSelectCategory('sang')
              } else if (currentHour >= 11 && currentHour < 14) {
                onSelectCategory('trua')
              } else if (currentHour >= 14 && currentHour < 18) {
                onSelectCategory('anchoi')
              } else if (currentHour >= 18 && currentHour < 22) {
                onSelectCategory('toi')
              } else {
                onSelectCategory('ankhuya')
              }
            }}
            className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🍲</span>
            <span>Lọc món hợp thời tiết</span>
          </button>
        </div>
      </aside>
    </>
  )
}