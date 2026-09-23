'use client'

import { useState, useEffect } from 'react'

export default function WeatherWidget({ onSelectCategory }) {
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
    // 1. Phân loại 7 khung giờ trong ngày
    const getTimePeriod = (hour) => {
      if (hour >= 4 && hour < 6) {
        return { label: 'Sáng sớm', icon: '🌅' }
      }
      if (hour >= 6 && hour < 11) {
        return { label: 'Buổi sáng', icon: '☀️' }
      }
      if (hour >= 11 && hour < 14) {
        return { label: 'Buổi trưa', icon: '🌤️' }
      }
      if (hour >= 14 && hour < 16) {
        return { label: 'Buổi chiều', icon: '🌤️' }
      }
      if (hour >= 16 && hour < 18) {
        return { label: 'Xế chiều', icon: '🌆' }
      }
      if (hour >= 18 && hour < 22) {
        return { label: 'Buổi tối', icon: '🌙' }
      }
      return { label: 'Nửa đêm', icon: '🌌' } // 22h - 3h59
    }

    // 2. Phân tích kết hợp Thời gian 7 khung giờ + Dạng thời tiết
    const parseWeatherAndPeriod = (code, temp, hour) => {
      const period = getTimePeriod(hour)
      const isRaining = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 97, 98, 99].includes(code)
      const isStorm = [65, 82, 95, 96, 97, 98, 99].includes(code)

      // Trường hợp Mưa giông / Bão
      if (isStorm) {
        return {
          periodLabel: period.label,
          icon: '⛈️',
          condition: 'Mưa bão giông giật',
          suggestion: `${period.label} mây đen giông bão, trốn trong nhà làm nồi lẩu hoặc món cay nóng húp xuýt xoa là chuẩn bài!`,
          bgGradient: 'from-slate-100 to-slate-200',
        }
      }

      // Trường hợp Mưa rào / Mưa phùn
      if (isRaining) {
        return {
          periodLabel: period.label,
          icon: '🌧️',
          condition: 'Trời mưa ướt át',
          suggestion: `${period.label} trời mưa râm râm mát lạnh, húp ngay một tô Bún Mọc hoặc Phở nóng hổi thôi!`,
          bgGradient: 'from-sky-50 to-blue-100',
        }
      }

      // Trường hợp Sương mù / Âm u
      if ([45, 48, 3].includes(code)) {
        return {
          periodLabel: period.label,
          icon: '🌫️',
          condition: 'Sương mờ âm u',
          suggestion: `${period.label} trời se xám mờ sương, làm dĩa đồ ăn ấm áp kèm ly trà nóng cho tỉnh táo nhé!`,
          bgGradient: 'from-stone-100 to-amber-50',
        }
      }

      // Trường hợp Thời tiết lạnh / Rét (< 22°C)
      if (temp <= 22) {
        return {
          periodLabel: period.label,
          icon: '🌬️',
          condition: 'Trời se lạnh',
          suggestion: `${period.label} gió lạnh ùa về, ưu tiên dĩa cơm nóng kho đậm vị hoặc tô cháo ấm bụng nào!`,
          bgGradient: 'from-blue-50 to-indigo-50',
        }
      }

      // Trường hợp Nắng gắt (> 32°C)
      if (temp >= 32) {
        return {
          periodLabel: period.label,
          icon: '🔥',
          condition: 'Nắng oi bức',
          suggestion: `${period.label} nắng gắt oi nồng, chọn các món thanh mát, gỏi cuốn hoặc chè giải nhiệt thôi!`,
          bgGradient: 'from-amber-100 to-orange-100',
        }
      }

      // Thời tiết bình thường -> Gợi ý chi tiết theo từng khung giờ trong ngày
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
        default: // Nửa đêm
          return {
            periodLabel: period.label,
            icon: '🌌',
            condition: 'Đêm muộn tĩnh mịch',
            suggestion: 'Nửa đêm cày phim cày code bị đói? Làm tô cháo đêm hoặc món ăn vặt nhẹ bụng ấm áp ngay!',
            bgGradient: 'from-slate-100 to-amber-50',
          }
      }
    }

    // 3. Lấy thời tiết thời gian thực
    const fetchRealWeather = async (lat = 10.8231, lon = 106.6297, cityName = 'TP. Hồ Chí Minh') => {
      const currentHour = new Date().getHours()
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        )
        const data = await res.json()
        const temp = Math.round(data.current.temperature_2m)
        const code = data.current.weather_code

        const parsed = parseWeatherAndPeriod(code, temp, currentHour)

        setWeather({
          city: cityName,
          temp: temp,
          timePeriodLabel: parsed.periodLabel,
          condition: parsed.condition,
          icon: parsed.icon,
          suggestion: parsed.suggestion,
          bgGradient: parsed.bgGradient,
        })
      } catch (err) {
        // Fallback
        const parsed = parseWeatherAndPeriod(0, 28, currentHour)
        setWeather((prev) => ({
          ...prev,
          timePeriodLabel: parsed.periodLabel,
          condition: 'Thời tiết dễ chịu',
          suggestion: parsed.suggestion,
        }))
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchRealWeather(pos.coords.latitude, pos.coords.longitude, 'Vị trí của bạn'),
        () => fetchRealWeather()
      )
    } else {
      fetchRealWeather()
    }
  }, [])

  return (
    <aside
      className={`fixed top-24 left-6 z-30 hidden xl:flex flex-col gap-3 w-64 bg-gradient-to-br ${weather.bgGradient} backdrop-blur-md p-4 rounded-3xl border border-amber-200/80 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5`}
    >
      {/* Header Widget */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce" style={{ animationDuration: '3s' }}>
            {weather.icon}
          </span>
          <div>
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
              📍 {weather.city}
            </div>
            <div className="text-[11px] text-amber-900/80 font-semibold">
              {weather.timePeriodLabel} • {weather.condition} • {weather.temp}°C
            </div>
          </div>
        </div>
        <span className="text-[10px] bg-white/80 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300/80 shadow-xs">
          Gợi Ý Vị Giác
        </span>
      </div>

      {/* Nội dung gợi ý câu thoại */}
      <p className="text-xs text-slate-800 leading-relaxed font-medium italic">
        "{weather.suggestion}"
      </p>

      {/* Nút bấm lọc món */}
      <button
        onClick={() => {
          if (!onSelectCategory) return

          const currentHour = new Date().getHours()
          const isRainingOrCold =
            weather.condition.includes('Mưa') ||
            weather.condition.includes('bão') ||
            weather.temp <= 22

          // 1. Nếu trời Mưa hoặc Lạnh -> Trút Lạnh / Ngày Mưa ('troilanh')
          if (isRainingOrCold) {
            onSelectCategory('troilanh')
            return
          }

          // 2. Phụ thuộc vào Khung Giờ trong ngày (Sáng, Trưa, Xế chiều, Tối, Khuya)
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
    </aside>
  )
}