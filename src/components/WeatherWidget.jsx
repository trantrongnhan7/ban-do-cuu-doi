'use client'

import { useState, useEffect } from 'react'

export default function WeatherWidget({ onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
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
        return 'TP. Hồ Chí Minh'
      }
    }

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
      {/* 📱 NÚT NỔI TRÊN MOBILE (Nằm góc trái dưới) */}
      <div className="xl:hidden fixed bottom-6 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-amber-300/80 flex items-center justify-center text-2xl active:scale-90 transition-transform"
          aria-label="Thời tiết & Gợi ý"
        >
          {weather.icon}
        </button>
      </div>

      {/* 📱 POPUP TRÊN MOBILE */}
      {isMobileOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm bg-gradient-to-br ${weather.bgGradient} p-5 rounded-3xl border border-amber-200 shadow-2xl flex flex-col gap-3 relative`}
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 shadow-xs"
            >
              ✕
            </button>

            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5 pr-6">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-3xl shrink-0 animate-bounce">{weather.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-950 truncate" title={weather.city}>
                    📍 {weather.city}
                  </div>
                  <div className="text-[11px] text-amber-900/80 font-semibold truncate">
                    {weather.timePeriodLabel} • {weather.temp}°C
                  </div>
                </div>
              </div>
              <span className="shrink-0 whitespace-nowrap text-[10px] bg-white/80 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300/80 shadow-xs">
                Gợi Ý
              </span>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed font-medium italic py-1">
              "{weather.suggestion}"
            </p>

            <button
              onClick={() => {
                setIsMobileOpen(false)
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
              className="w-full mt-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>🍲</span>
              <span>Lọc món hợp thời tiết</span>
            </button>
          </div>
        </div>
      )}

      {/* 🖥️ WIDGET CỐ ĐỊNH TRÊN PC */}
      <aside
        className={`hidden xl:flex fixed top-24 left-3 z-30 flex-col bg-gradient-to-br ${
          weather.bgGradient
        } backdrop-blur-md border border-amber-200/80 shadow-lg transition-all duration-300 group cursor-pointer ${
          isScrolled
            ? 'w-12 h-12 p-0 rounded-full items-center justify-center hover:w-64 hover:h-auto hover:p-4 hover:rounded-3xl hover:items-stretch'
            : 'w-64 p-4 rounded-3xl items-stretch'
        }`}
      >
        {isScrolled && (
          <div
            className="flex items-center justify-center w-full h-full group-hover:hidden"
            title="Bấm để xem thời tiết & gợi ý món"
          >
            <span className="text-xl animate-pulse">{weather.icon}</span>
          </div>
        )}

        <div
          className={
            isScrolled
              ? 'hidden group-hover:flex flex-col gap-3'
              : 'flex flex-col gap-3'
          }
        >
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5 gap-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-2xl shrink-0 animate-bounce" style={{ animationDuration: '3s' }}>
                {weather.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-amber-950 truncate max-w-[125px]" title={weather.city}>
                  📍 {weather.city}
                </div>
                <div className="text-[11px] text-amber-900/80 font-semibold truncate">
                  {weather.timePeriodLabel} • {weather.temp}°C
                </div>
              </div>
            </div>
            
            {/* Nút Gợi Ý cố định không rớt dòng */}
            <span className="shrink-0 whitespace-nowrap text-[10px] bg-white/80 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300/80 shadow-xs">
              Gợi Ý
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed font-medium italic">
            "{weather.suggestion}"
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation()
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