import { NextResponse } from "next/server";

// خوارزمية لتحديد مواعيد الرحلات الواقعية (محاكاة دقيقة لجدول الرحلات)
function getNextAvailableFlight(currentDate: Date, targetDays: number[]): Date {
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);
  while (!targetDays.includes(nextDate.getDay())) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination, date, passengers, query } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      );
    }

    // حل مشكلة فرق التوقيت (Timezone Shift) عبر قراءة التاريخ بشكل آمن محلياً
    let searchDate = new Date();
    if (date) {
      const parts = date.split('-');
      if (parts.length === 3) {
        // تعيين الساعة 12 ظهراً لتجنب أي إزاحة بسبب التوقيت المحلي للمخدم
        searchDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
      } else {
        searchDate = new Date(date);
      }
    }

    const dayOfWeek = searchDate.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    const results = [];
    let message = "";

    // جدول طيران عدن الواقعي (الثلاثاء = 2، الجمعة = 5، السبت = 6)
    const flyAdenDays = [2, 5, 6]; 
    
    // جدول الخطوط اليمنية الواقعي (الأحد = 0، الإثنين = 1، الأربعاء = 3، الخميس = 4)
    const yemeniaDays = [0, 1, 3, 4];

    const createFlyAdenFlightsUnified = (flightDate: Date, isAlternative = false) => {
      const formatted = flightDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-');
      const formattedArabicDate = flightDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const originName = origin === 'ADE' ? 'عدن (ADE)' : origin;
      const destName = destination === 'CAI' ? 'القاهرة (CAI)' : destination;
      
      return {
        id: `flyaden-unified-${formatted}-${isAlternative ? 'alt' : 'primary'}`,
        type: "flight",
        title: `طيران عدن (Fly Aden) - من ${originName} إلى ${destName} ${isAlternative ? '(رحلة بديلة)' : ''}`,
        airline: "طيران عدن (Fly Aden)",
        rating: 4.9,
        duration: "3س 30د (مباشر)",
        dateText: formattedArabicDate,
        price: 520,
        bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`,
        options: [
          {
            name: "سياحية توفيرية (Saver)",
            price: 520,
            description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00 (بتوقيت القاهرة). طائرة Boeing 737-800. يشمل وزن 30 كجم + حقيبة يد 7 كجم.",
            bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
          },
          {
            name: "سياحية مرنة (Flex)",
            price: 570,
            description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00 (بتوقيت القاهرة). طائرة Boeing 737-800. يشمل وزن 40 كجم + حقيبة يد 10 كجم. تعديل مجاني للحجز.",
            bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
          },
          {
            name: "درجة الأعمال (Business)",
            price: 750,
            description: "رحلة مباشرة AD 102. درجة الأعمال الفاخرة. إقلاع 16:30، وصول 20:00. يشمل دخول صالة VIP ومقاعد واسعة ووزن 45 كجم + وجبات ساخنة فاخرة.",
            bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
          }
        ]
      };
    };

    const createYemeniaFlightsUnified = (flightDate: Date, isAlternative = false) => {
      const formatted = flightDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-');
      const formattedArabicDate = flightDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const originName = origin === 'ADE' ? 'عدن (ADE)' : origin;
      const destName = destination === 'CAI' ? 'القاهرة (CAI)' : destination;

      return {
        id: `yemenia-unified-${formatted}-${isAlternative ? 'alt' : 'primary'}`,
        type: "flight",
        title: `الخطوط اليمنية (Yemenia) - من ${originName} إلى ${destName} ${isAlternative ? '(رحلة بديلة)' : ''}`,
        airline: "الخطوط الجوية اليمنية (Yemenia)",
        rating: 4.6,
        duration: "3س 30د (مباشر)",
        dateText: formattedArabicDate,
        price: 550,
        bookingUrl: `https://yemenia.com/`,
        options: [
          {
            name: "سياحية توفيرية (Saver)",
            price: 550,
            description: "رحلة مباشرة IY 600. إقلاع 08:00 صباحاً، وصول 11:30 (بتوقيت القاهرة). طائرة Airbus A320. يشمل وزن 30 كجم + حقيبة يد 7 كجم.",
            bookingUrl: "https://yemenia.com/"
          },
          {
            name: "درجة الأعمال (Business)",
            price: 780,
            description: "رحلة مباشرة IY 600. درجة الأعمال. إقلاع 08:00 صباحاً، وصول 11:30. صالة كبار الشخصيات VIP، مقاعد مريحة للغاية ووزن 40 كجم + خدمات ممتازة.",
            bookingUrl: "https://yemenia.com/"
          }
        ]
      };
    };

    // 1. تحقق وإضافة الرحلات الأساسية لليوم المختار
    if (flyAdenDays.includes(dayOfWeek)) {
      results.push(createFlyAdenFlightsUnified(searchDate, false));
    }
    if (yemeniaDays.includes(dayOfWeek)) {
      results.push(createYemeniaFlightsUnified(searchDate, false));
    }

    // 2. إذا كانت شركة الطيران المفضلة (طيران عدن) لا تطير في هذا اليوم، اعرض اليمنية واقترح أقرب رحلة لطيران عدن كخيار بديل
    if (!flyAdenDays.includes(dayOfWeek)) {
      const nextFlyAden = getNextAvailableFlight(searchDate, flyAdenDays);
      const formattedNext = nextFlyAden.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
      message = `رحلات طيران عدن المباشرة متوفرة يوم ${formattedNext}. تم إدراجها كخيارات بديلة أدناه.`;
      
      results.push(createFlyAdenFlightsUnified(nextFlyAden, true));
    }

    // 3. إضافة الباقات الفندقية إذا كان الاستعلام يحتوي على كلمة "فندق" أو "باقة"
    if (query && (query.includes("فندق") || query.includes("باقة"))) {
      const formattedArabicDate = searchDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      results.push({
        id: "alqadi-package",
        type: "package",
        title: `باقة إقامة فاخرة بالقاهرة - مجموعة القاضي الذهبية`,
        description: `إقامة 5 ليالٍ في جناح فخم بفندق 5 نجوم (مطل على النيل) شاملة الإفطار، الاستقبال من المطار والتوديع بسيارة خاصة مع جولات سياحية مميزة.`,
        price: 950,
        currency: "$",
        airline: "مجموعة القاضي الذهبية",
        rating: 5.0,
        duration: "5 ليالي",
        dateText: formattedArabicDate,
        bookingUrl: "/portal/packages"
      });
    }

    return NextResponse.json({ results, message });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

