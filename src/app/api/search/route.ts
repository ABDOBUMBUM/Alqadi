import { NextResponse } from "next/server";

// خريطة المطارات الشاملة مع أسماء الدول والموانئ الجوية باللغتين العربية والإنجليزية
const airportsMap: Record<string, { ar: string; en: string; country: string }> = {
  "ADE": { ar: "عدن (ADE) - مطار عدن الدولي", en: "Aden (ADE) - Aden International Airport", country: "اليمن" },
  "GXF": { ar: "سيئون (GXF) - مطار سيئون الدولي", en: "Seiyun (GXF) - Seiyun Airport", country: "اليمن" },
  "SAH": { ar: "صنعاء (SAH) - مطار صنعاء الدولي", en: "Sanaa (SAH) - Sanaa International Airport", country: "اليمن" },
  "RIY": { ar: "الريان (RIY) - مطار الريان الدولي", en: "Riyan (RIY) - Riyan Airport", country: "اليمن" },
  "CAI": { ar: "القاهرة (CAI) - مطار القاهرة الدولي", en: "Cairo (CAI) - Cairo International Airport", country: "مصر" },
  "JED": { ar: "جدة (JED) - مطار الملك عبدالعزيز", en: "Jeddah (JED) - King Abdulaziz International Airport", country: "السعودية" },
  "RUH": { ar: "الرياض (RUH) - مطار الملك خالد", en: "Riyadh (RUH) - King Khalid International Airport", country: "السعودية" },
  "AMM": { ar: "عمان (AMM) - مطار الملكة علياء", en: "Amman (AMM) - Queen Alia International Airport", country: "الأردن" },
  "BOM": { ar: "مومباي (BOM) - مطار مومباي الدولي", en: "Mumbai (BOM) - Chhatrapati Shivaji Maharaj International Airport", country: "الهند" },
  "KWI": { ar: "الكويت (KWI) - مطار الكويت الدولي", en: "Kuwait (KWI) - Kuwait International Airport", country: "الكويت" },
  "IST": { ar: "إسطنبول (IST) - مطار إسطنبول الدولي", en: "Istanbul (IST) - Istanbul Airport", country: "تركيا" },
  "CDG": { ar: "باريس (CDG) - مطار شارل ديغول", en: "Paris (CDG) - Charles de Gaulle Airport", country: "فرنسا" },
  "LHR": { ar: "لندن (LHR) - مطار هيثرو الدولي", en: "London (LHR) - Heathrow Airport", country: "المملكة المتحدة" },
  "DXB": { ar: "دبي (DXB) - مطار دبي الدولي", en: "Dubai (DXB) - Dubai International Airport", country: "الإمارات" }
};

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

    const formatted = searchDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-');
    const formattedArabicDate = searchDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const originInfo = airportsMap[origin] || { ar: origin, en: origin, country: "" };
    const destInfo = airportsMap[destination] || { ar: destination, en: destination, country: "" };
    const originName = originInfo.ar;
    const destName = destInfo.ar;

    // ══ تحقق مما إذا كانت الوجهة مطابقة لخطوط منشورات القاضي الإعلانية المحددة ════
    const isFlyerDestination = ["CAI", "IST", "CDG", "LHR", "DXB"].includes(destination);

    if (isFlyerDestination) {
      // بناء خطوط رحلات الإعلانات الفاخرة بالأسعار والمواصفات الكاملة
      if (destination === "CAI") {
        results.push({
          id: `flyer-flight-cai-${formatted}`,
          type: "flight",
          title: `طيران عدن (Fly Aden) - من ${originName} إلى ${destName}`,
          airline: "طيران عدن (Fly Aden)",
          rating: 4.9,
          duration: "3س 30د (مباشر)",
          dateText: formattedArabicDate,
          price: 244,
          bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 244,
              priceUSD: 244,
              priceSAR: 915,
              priceKWD: 95,
              description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00 (بتوقيت القاهرة). طائرة Boeing 737-800. يشمل وزن 30 كجم + حقيبة يد 7 كجم.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 306,
              priceUSD: 306,
              priceSAR: 1150,
              priceKWD: 120,
              description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00 (بتوقيت القاهرة). طائرة Boeing 737-800. يشمل وزن 40 كجم + حقيبة يد 10 كجم. تعديل مجاني للحجز.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
            },
            {
              name: "درجة الأعمال (Business)",
              price: 493,
              priceUSD: 493,
              priceSAR: 1850,
              priceKWD: 190,
              description: "رحلة مباشرة AD 102. درجة الأعمال الفاخرة. إقلاع 16:30، وصول 20:00. يشمل دخول صالة VIP ومقاعد واسعة مكسوة بالجلد ووزن 45 كجم + وجبات ساخنة فاخرة.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${formatted}`
            }
          ]
        });

        // إضافة خيار الخطوط اليمنية كخيار بديل/إضافي فاخر لتوفير تنوع كامل للعملاء
        results.push({
          id: `flyer-flight-cai-yemenia-${formatted}`,
          type: "flight",
          title: `الخطوط اليمنية (Yemenia) - من ${originName} إلى ${destName}`,
          airline: "الخطوط الجوية اليمنية (Yemenia)",
          rating: 4.7,
          duration: "3س 30د (مباشر)",
          dateText: formattedArabicDate,
          price: 250,
          bookingUrl: `https://yemenia.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 250,
              priceUSD: 250,
              priceSAR: 938,
              priceKWD: 98,
              description: "رحلة مباشرة IY 600. إقلاع 08:00 صباحاً، وصول 11:30. طائرة Airbus A320. يشمل وزن 30 كجم + حقيبة يد 7 كجم ووجبة ساخنة أثناء الرحلة.",
              bookingUrl: "https://yemenia.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 510,
              priceUSD: 510,
              priceSAR: 1912,
              priceKWD: 198,
              description: "رحلة مباشرة IY 600. درجة الأعمال الفاخرة. صالة كبار الشخصيات VIP، مقاعد مريحة للغاية ووزن 40 كجم + وجبات خاصة ومشروبات مجانية.",
              bookingUrl: "https://yemenia.com/"
            }
          ]
        });
      } else if (destination === "IST") {
        results.push({
          id: `flyer-flight-ist-${formatted}`,
          type: "flight",
          title: `الخطوط الجوية التركية - من ${originName} إلى ${destName}`,
          airline: "الخطوط الجوية التركية (Turkish Airlines)",
          rating: 4.8,
          duration: "4س 15د (مباشر)",
          dateText: formattedArabicDate,
          price: 370,
          bookingUrl: `https://www.turkishairlines.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 370,
              priceUSD: 370,
              priceSAR: 1390,
              priceKWD: 145,
              description: "رحلة مباشرة TK 182. إقلاع 09:30، وصول 13:45. طائرة Airbus A321. يشمل وزن 30 كجم + نظام ترفيهي متكامل ووجبة مجانية.",
              bookingUrl: "https://www.turkishairlines.com/"
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 448,
              priceUSD: 448,
              priceSAR: 1680,
              priceKWD: 175,
              description: "رحلة مباشرة TK 182. يشمل وزن 40 كجم، إمكانية تعديل الحجز مجاناً بالكامل، اختيار المقعد المفضل مجاناً ووجبة ساخنة فاخرة.",
              bookingUrl: "https://www.turkishairlines.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 640,
              priceUSD: 640,
              priceSAR: 2400,
              priceKWD: 250,
              description: "درجة الأعمال الملكية TK 182. يشمل دخول صالة CIP الفاخرة الحائزة على جوائز، مقعد مسطح بالكامل، وجبات طهاة الطائرة الخاصة ووزن 45 كجم.",
              bookingUrl: "https://www.turkishairlines.com/"
            }
          ]
        });
      } else if (destination === "CDG") {
        results.push({
          id: `flyer-flight-cdg-${formatted}`,
          type: "flight",
          title: `الخطوط الجوية الفرنسية - من ${originName} إلى ${destName}`,
          airline: "الخطوط الجوية الفرنسية (Air France)",
          rating: 4.9,
          duration: "6س 10د (مباشر)",
          dateText: formattedArabicDate,
          price: 466,
          bookingUrl: `https://www.airfrance.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 466,
              priceUSD: 466,
              priceSAR: 1750,
              priceKWD: 175,
              description: "رحلة مباشرة AF 980. إقلاع 11:00، وصول 17:10. طائرة Boeing 777. يشمل وزن 30 كجم، نظام ترفيه ممتاز ووجبات طازجة.",
              bookingUrl: "https://www.airfrance.com/"
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 546,
              priceUSD: 546,
              priceSAR: 2050,
              priceKWD: 210,
              description: "رحلة مباشرة AF 980. يشمل وزن 40 كجم، تعديل مجاني بالكامل ووجبات طازجة مستوحاة من المطبخ الفرنسي العريق واختيار مقاعد مجاني.",
              bookingUrl: "https://www.airfrance.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 826,
              priceUSD: 826,
              priceSAR: 3100,
              priceKWD: 320,
              description: "درجة الأعمال الحصرية AF 980. يشمل سرير مسطح فاخر مريح للغاية، دخول صالة المطار المتميزة، وجبات فاخرة معدة من طهاة ميشلان ووزن 45 كجم.",
              bookingUrl: "https://www.airfrance.com/"
            }
          ]
        });
      } else if (destination === "LHR") {
        results.push({
          id: `flyer-flight-lhr-${formatted}`,
          type: "flight",
          title: `الخطوط الجوية البريطانية - من ${originName} إلى ${destName}`,
          airline: "الخطوط الجوية البريطانية (British Airways)",
          rating: 4.8,
          duration: "6س 45د (مباشر)",
          dateText: formattedArabicDate,
          price: 585,
          bookingUrl: `https://www.britishairways.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 585,
              priceUSD: 585,
              priceSAR: 2196,
              priceKWD: 216,
              description: "رحلة مباشرة BA 122. إقلاع 08:30، وصول 15:15. طائرة Airbus A350 الحديثة. يشمل وزن 30 كجم، وجبة إفطار بريطانية متكاملة ونظام ترفيه متطور.",
              bookingUrl: "https://www.britishairways.com/"
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 666,
              priceUSD: 666,
              priceSAR: 2500,
              priceKWD: 260,
              description: "رحلة مباشرة BA 122. يشمل وزن 40 كجم، إمكانية تعديل الحجز بالكامل مجاناً، اختيار المقاعد مجاناً ومستوى راحة إضافي.",
              bookingUrl: "https://www.britishairways.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 1013,
              priceUSD: 1013,
              priceSAR: 3800,
              priceKWD: 390,
              description: "درجة الأعمال Club World BA 122. جناح خاص متكامل مع باب منزلق، سرير مسطح 2 متر، وجبات إنجليزية تقليدية فاخرة، دخول صالة المطار الفخمة.",
              bookingUrl: "https://www.britishairways.com/"
            }
          ]
        });
      } else if (destination === "DXB") {
        results.push({
          id: `flyer-flight-dxb-${formatted}`,
          type: "flight",
          title: `طيران الإمارات - من ${originName} إلى ${destName}`,
          airline: "طيران الإمارات (Emirates)",
          rating: 4.9,
          duration: "2س 15د (مباشر)",
          dateText: formattedArabicDate,
          price: 635,
          bookingUrl: `https://www.emirates.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 635,
              priceUSD: 635,
              priceSAR: 2380,
              priceKWD: 238,
              description: "رحلة مباشرة EK 855. إقلاع 14:00، وصول 16:15. طائرة Boeing 777-300ER. يشمل وزن 30 كجم ونظام ICE الترفيهي الفائز بجوائز ووجبة ساخنة.",
              bookingUrl: "https://www.emirates.com/"
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 746,
              priceUSD: 746,
              priceSAR: 2800,
              priceKWD: 285,
              description: "رحلة مباشرة EK 855. يشمل وزن 40 كجم، إمكانية تعديل الحجز مجاناً، اختيار المقعد، نظام ICE للترفيه، مع وجبة غداء فاخرة مجانية.",
              bookingUrl: "https://www.emirates.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 1093,
              priceUSD: 1093,
              priceSAR: 4100,
              priceKWD: 420,
              description: "درجة الأعمال الفاخرة EK 855. مقعد مكسو بالجلد الطبيعي يتحول لسرير، شاشة عرض 23 بوصة، دخول صالات الإمارات الفاخرة، سيارة مرسيدس بسائق للتوصيل مجاناً.",
              bookingUrl: "https://www.emirates.com/"
            }
          ]
        });
      }
    } else {
      // ══ خطوط طيران بديلة للمدن اللوجستية الأخرى (مثل عدن وسيئون والرياض وجدة ومومباي) ══
      // جدول طيران عدن الواقعي (الثلاثاء = 2، الجمعة = 5، السبت = 6)
      const flyAdenDays = [2, 5, 6]; 
      
      // جدول الخطوط اليمنية الواقعي (الأحد = 0، الإثنين = 1، الأربعاء = 3، الخميس = 4)
      const yemeniaDays = [0, 1, 3, 4];

      const createFlyAdenFlightsUnified = (flightDate: Date, isAlternative = false) => {
        const fDate = flightDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-');
        const fArabic = flightDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        
        return {
          id: `flyaden-unified-${fDate}-${isAlternative ? 'alt' : 'primary'}`,
          type: "flight",
          title: `طيران عدن (Fly Aden) - من ${originName} إلى ${destName} ${isAlternative ? '(رحلة بديلة)' : ''}`,
          airline: "طيران عدن (Fly Aden)",
          rating: 4.9,
          duration: "3س 30د (مباشر)",
          dateText: fArabic,
          price: 520,
          bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${fDate}`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 520,
              priceUSD: 520,
              priceSAR: 1950,
              priceKWD: 160,
              description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00 (بتوقيت الوجهة). يشمل وزن 30 كجم + حقيبة يد 7 كجم.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${fDate}`
            },
            {
              name: "سياحية مرنة (Flex)",
              price: 570,
              priceUSD: 570,
              priceSAR: 2137,
              priceKWD: 175,
              description: "رحلة مباشرة AD 102. إقلاع 16:30، وصول 20:00. يشمل وزن 40 كجم + حقيبة يد 10 كجم. تعديل مجاني للحجز.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${fDate}`
            },
            {
              name: "درجة الأعمال (Business)",
              price: 750,
              priceUSD: 750,
              priceSAR: 2812,
              priceKWD: 230,
              description: "درجة الأعمال الفاخرة. إقلاع 16:30، وصول 20:00. يشمل دخول صالة VIP ومقاعد واسعة مريحة ووزن 45 كجم + وجبات ساخنة فاخرة.",
              bookingUrl: `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}&journey=${fDate}`
            }
          ]
        };
      };

      const createYemeniaFlightsUnified = (flightDate: Date, isAlternative = false) => {
        const fDate = flightDate.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/ /g, '-');
        const fArabic = flightDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        return {
          id: `yemenia-unified-${fDate}-${isAlternative ? 'alt' : 'primary'}`,
          type: "flight",
          title: `الخطوط اليمنية (Yemenia) - من ${originName} إلى ${destName} ${isAlternative ? '(رحلة بديلة)' : ''}`,
          airline: "الخطوط الجوية اليمنية (Yemenia)",
          rating: 4.6,
          duration: "3س 30د (مباشر)",
          dateText: fArabic,
          price: 550,
          bookingUrl: `https://yemenia.com/`,
          options: [
            {
              name: "سياحية توفيرية (Saver)",
              price: 550,
              priceUSD: 550,
              priceSAR: 2062,
              priceKWD: 170,
              description: "رحلة مباشرة IY 600. إقلاع 08:00 صباحاً، وصول 11:30. طائرة Airbus A320. يشمل وزن 30 كجم + حقيبة يد 7 كجم.",
              bookingUrl: "https://yemenia.com/"
            },
            {
              name: "درجة الأعمال (Business)",
              price: 780,
              priceUSD: 780,
              priceSAR: 2925,
              priceKWD: 240,
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

      // 2. إذا كانت شركة الطيران لا تطير في هذا اليوم، اعرض اليمنية واقترح أقرب رحلة بديلة
      if (!flyAdenDays.includes(dayOfWeek)) {
        const nextFlyAden = getNextAvailableFlight(searchDate, flyAdenDays);
        results.push(createFlyAdenFlightsUnified(nextFlyAden, true));
        
        const formattedNext = nextFlyAden.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
        message = `رحلات طيران عدن المباشرة متوفرة يوم ${formattedNext}. تم إدراجها كخيارات بديلة أدناه.`;
      }

      if (!yemeniaDays.includes(dayOfWeek)) {
        const nextYemenia = getNextAvailableFlight(searchDate, yemeniaDays);
        results.push(createYemeniaFlightsUnified(nextYemenia, true));

        if (!message) {
          const formattedNextYemenia = nextYemenia.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });
          message = `رحلات الخطوط اليمنية المباشرة متوفرة يوم ${formattedNextYemenia}. تم إدراجها كخيارات بديلة أدناه.`;
        }
      }
    }

    // 3. إضافة الباقات الفندقية إذا كان الاستعلام يحتوي على كلمة "فندق" أو "باقة"
    if (query && (query.includes("فندق") || query.includes("باقة"))) {
      results.push({
        id: "alqadi-package",
        type: "package",
        title: `باقة إقامة فاخرة بالقاهرة - مجموعة القاضي الذهبية`,
        description: `إقامة 5 ليالٍ في جناح فخم بفندق 5 نجوم (مطل على النيل) شاملة الإفطار، الاستقبال من المطار والتوديع بسيارة خاصة مع جولات سياحية مميزة.`,
        price: 950,
        priceUSD: 950,
        priceSAR: 3500,
        priceKWD: 290,
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
