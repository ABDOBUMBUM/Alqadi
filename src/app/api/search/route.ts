import { NextResponse } from "next/server";

// ════════════════════════════════════════════════════════
// 🗺️  خريطة المطارات
// ════════════════════════════════════════════════════════
const AIRPORTS: Record<string, { ar: string; country: string }> = {
  ADE: { ar: "عدن - مطار عدن الدولي",             country: "اليمن" },
  GXF: { ar: "سيئون - مطار سيئون الدولي",          country: "اليمن" },
  SAH: { ar: "صنعاء - مطار صنعاء الدولي",          country: "اليمن" },
  RIY: { ar: "الريان - مطار الريان الدولي",         country: "اليمن" },
  CAI: { ar: "القاهرة - مطار القاهرة الدولي",       country: "مصر" },
  JED: { ar: "جدة - مطار الملك عبدالعزيز",          country: "السعودية" },
  RUH: { ar: "الرياض - مطار الملك خالد",            country: "السعودية" },
  AMM: { ar: "عمان - مطار الملكة علياء",            country: "الأردن" },
  KWI: { ar: "الكويت - مطار الكويت الدولي",         country: "الكويت" },
  IST: { ar: "إسطنبول - مطار إسطنبول الدولي",       country: "تركيا" },
  CDG: { ar: "باريس - مطار شارل ديغول",             country: "فرنسا" },
  LHR: { ar: "لندن - مطار هيثرو الدولي",            country: "المملكة المتحدة" },
  DXB: { ar: "دبي - مطار دبي الدولي",               country: "الإمارات" },
  BOM: { ar: "مومباي - مطار مومباي الدولي",          country: "الهند" },
};

// ════════════════════════════════════════════════════════
// ✈️  سجل شركات الطيران — أضف شركة جديدة هنا فقط
// ════════════════════════════════════════════════════════
type AirlineId = "FLY_ADEN" | "YEMENIA" | "TURKISH" | "AIR_FRANCE" | "BRITISH" | "EMIRATES";

interface AirlineConfig {
  id: AirlineId;
  nameAr: string;
  nameEn: string;
  rating: number;
  bookingBaseUrl: string;
  /** أيام التشغيل 0=أحد … 6=سبت */
  operatingDays: number[];
  /** مسارات تدعمها هذه الشركة — مفتاح "ORIGIN-DEST" */
  routes: string[];
}

const AIRLINES: Record<AirlineId, AirlineConfig> = {
  FLY_ADEN: {
    id: "FLY_ADEN",
    nameAr: "طيران عدن (Fly Aden)",
    nameEn: "Fly Aden",
    rating: 4.9,
    bookingBaseUrl:
      "https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx",
    operatingDays: [2, 5, 6], // الثلاثاء، الجمعة، السبت
    routes: ["ADE-CAI", "ADE-JED", "ADE-RUH", "ADE-AMM", "ADE-KWI",
             "GXF-CAI", "SAH-CAI", "RIY-CAI"],
  },
  YEMENIA: {
    id: "YEMENIA",
    nameAr: "الخطوط الجوية اليمنية (Yemenia)",
    nameEn: "Yemenia Airways",
    rating: 4.6,
    bookingBaseUrl: "https://yemenia.com/",
    operatingDays: [0, 1, 3, 4], // الأحد، الاثنين، الأربعاء، الخميس
    routes: ["ADE-CAI", "ADE-JED", "ADE-RUH", "ADE-AMM",
             "SAH-CAI", "SAH-JED", "GXF-JED"],
  },
  TURKISH: {
    id: "TURKISH",
    nameAr: "الخطوط الجوية التركية (Turkish Airlines)",
    nameEn: "Turkish Airlines",
    rating: 4.8,
    bookingBaseUrl: "https://www.turkishairlines.com/",
    operatingDays: [0, 1, 2, 3, 4, 5, 6],
    routes: ["ADE-IST", "JED-IST", "CAI-IST"],
  },
  AIR_FRANCE: {
    id: "AIR_FRANCE",
    nameAr: "الخطوط الجوية الفرنسية (Air France)",
    nameEn: "Air France",
    rating: 4.9,
    bookingBaseUrl: "https://www.airfrance.com/",
    operatingDays: [0, 2, 4, 6],
    routes: ["ADE-CDG", "JED-CDG", "CAI-CDG"],
  },
  BRITISH: {
    id: "BRITISH",
    nameAr: "الخطوط الجوية البريطانية (British Airways)",
    nameEn: "British Airways",
    rating: 4.8,
    bookingBaseUrl: "https://www.britishairways.com/",
    operatingDays: [1, 3, 5],
    routes: ["ADE-LHR", "JED-LHR", "CAI-LHR"],
  },
  EMIRATES: {
    id: "EMIRATES",
    nameAr: "طيران الإمارات (Emirates)",
    nameEn: "Emirates",
    rating: 4.9,
    bookingBaseUrl: "https://www.emirates.com/",
    operatingDays: [0, 1, 2, 3, 4, 5, 6],
    routes: ["ADE-DXB", "JED-DXB", "CAI-DXB", "KWI-DXB"],
  },
};

// ════════════════════════════════════════════════════════
// 💺  نظام المقاعد — محاكاة واقعية مع بذرة ثابتة بالتاريخ
// ════════════════════════════════════════════════════════
interface SeatMap {
  total: number;
  booked: number;
  available: number;
  status: "متاح" | "محدود" | "ممتلئ تقريباً" | "ممتلئ";
  statusEn: "available" | "limited" | "almost_full" | "full";
  statusColor: string;
}

function generateSeats(flightId: string, flightDate: string, classType: string): SeatMap {
  // بذرة حتمية = hash بسيط من معرف الرحلة + التاريخ + الفئة
  let seed = 0;
  const str = `${flightId}-${flightDate}-${classType}`;
  for (let i = 0; i < str.length; i++) {
    seed = (seed * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  const rng = Math.abs(seed) / 0x7fffffff;

  const total = classType.includes("Business") ? 20 : classType.includes("Flex") ? 60 : 120;
  const bookedPct = 0.3 + rng * 0.65; // 30%–95% محجوز
  const booked = Math.min(total, Math.round(total * bookedPct));
  const available = total - booked;
  const pct = available / total;

  let status: SeatMap["status"];
  let statusEn: SeatMap["statusEn"];
  let statusColor: string;

  if (pct >= 0.5)      { status = "متاح";           statusEn = "available";   statusColor = "#10b981"; }
  else if (pct >= 0.2) { status = "محدود";           statusEn = "limited";     statusColor = "#f59e0b"; }
  else if (pct >= 0.05){ status = "ممتلئ تقريباً";   statusEn = "almost_full"; statusColor = "#ef4444"; }
  else                  { status = "ممتلئ";            statusEn = "full";        statusColor = "#7f1d1d"; }

  return { total, booked, available, status, statusEn, statusColor };
}

// ════════════════════════════════════════════════════════
// 💰  جدول الأسعار الدقيق — USD أساس، SAR = ×3.75، KWD = ×0.306
// ════════════════════════════════════════════════════════
interface FareClass {
  name: string;
  flightCode: string;
  departure: string;  // HH:MM
  arrival: string;    // HH:MM
  aircraft: string;
  baggage: string;
  priceUSD: number;
  priceSAR: number;
  priceKWD: number;
  features: string;
  bookingUrl?: string;
}

function buildFares(
  airline: AirlineConfig,
  origin: string,
  dest: string,
  baseUSD: number,
  flightCode: string,
  dep: string,
  arr: string,
  aircraft: string,
  dateFormatted: string
): FareClass[] {
  const url = airline.bookingBaseUrl.includes("videcom")
    ? `${airline.bookingBaseUrl}?outboundroute=${origin}-${dest}&journey=${dateFormatted}`
    : airline.bookingBaseUrl;

  return [
    {
      name: "سياحية توفيرية (Saver)",
      flightCode: `${flightCode}`,
      departure: dep,
      arrival: arr,
      aircraft,
      baggage: "30 كجم + حقيبة يد 7 كجم",
      priceUSD: baseUSD,
      priceSAR: Math.round(baseUSD * 3.75),
      priceKWD: Math.round(baseUSD * 0.306),
      features: "وزن 30 كجم، وجبة ساخنة مجانية",
      bookingUrl: url,
    },
    {
      name: "سياحية مرنة (Flex)",
      flightCode: `${flightCode}`,
      departure: dep,
      arrival: arr,
      aircraft,
      baggage: "40 كجم + حقيبة يد 10 كجم",
      priceUSD: Math.round(baseUSD * 1.25),
      priceSAR: Math.round(baseUSD * 1.25 * 3.75),
      priceKWD: Math.round(baseUSD * 1.25 * 0.306),
      features: "وزن 40 كجم، تعديل مجاني، اختيار مقعد مجاني",
      bookingUrl: url,
    },
    {
      name: "درجة الأعمال (Business)",
      flightCode: `${flightCode}`,
      departure: dep,
      arrival: arr,
      aircraft,
      baggage: "45 كجم + حقيبة يد 14 كجم",
      priceUSD: Math.round(baseUSD * 2.05),
      priceSAR: Math.round(baseUSD * 2.05 * 3.75),
      priceKWD: Math.round(baseUSD * 2.05 * 0.306),
      features: "وزن 45 كجم، صالة VIP، مقعد مسطح، وجبات فاخرة",
      bookingUrl: url,
    },
  ];
}

// ════════════════════════════════════════════════════════
// 📅  التواريخ المساعدة
// ════════════════════════════════════════════════════════
function parseSearchDate(dateStr: string | undefined): Date {
  if (!dateStr) return new Date();
  const p = dateStr.split("-");
  if (p.length === 3) {
    return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0);
  }
  return new Date(dateStr);
}

function nextFlight(from: Date, days: number[]): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (!days.includes(d.getDay())) d.setDate(d.getDate() + 1);
  return d;
}

function fmtEn(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
}
function fmtAr(d: Date) {
  return d.toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ════════════════════════════════════════════════════════
// 🏗️  بناء كارد الرحلة الكامل
// ════════════════════════════════════════════════════════
function buildFlightCard(
  airline: AirlineConfig,
  origin: string,
  dest: string,
  flightDate: Date,
  isAlternative: boolean,
  baseUSD: number,
  flightCode: string,
  dep: string,
  arr: string,
  duration: string,
  aircraft: string
) {
  const dateEn  = fmtEn(flightDate);
  const dateAr  = fmtAr(flightDate);
  const dateISO = isoDate(flightDate);
  const originInfo = AIRPORTS[origin] ?? { ar: origin, country: "" };
  const destInfo   = AIRPORTS[dest]   ?? { ar: dest,   country: "" };

  const fares = buildFares(airline, origin, dest, baseUSD, flightCode, dep, arr, aircraft, dateEn);

  // حساب المقاعد لكل فئة
  const options = fares.map((f) => {
    const seats = generateSeats(`${airline.id}-${origin}-${dest}`, dateISO, f.name);
    return {
      name:        f.name,
      flightCode:  f.flightCode,
      departure:   f.departure,
      arrival:     f.arrival,
      aircraft:    f.aircraft,
      baggage:     f.baggage,
      price:       f.priceUSD,
      priceUSD:    f.priceUSD,
      priceSAR:    f.priceSAR,
      priceKWD:    f.priceKWD,
      description: `رحلة ${f.flightCode}. إقلاع ${f.departure}، وصول ${f.arrival}. طائرة ${f.aircraft}. ${f.features}. ${f.baggage}.`,
      features:    f.features,
      bookingUrl:  f.bookingUrl,
      seats,
    };
  });

  const minPrice = options[0].priceUSD;

  return {
    id: `${airline.id}-${origin}-${dest}-${dateISO}${isAlternative ? "-alt" : ""}`,
    type: "flight",
    title: `${airline.nameAr} — ${originInfo.ar} → ${destInfo.ar}${isAlternative ? " (أقرب رحلة متاحة)" : ""}`,
    airline: airline.nameAr,
    rating: airline.rating,
    duration,
    flightCode,
    departure: dep,
    arrival: arr,
    aircraft,
    dateText: dateAr,
    dateISO,
    isAlternative,
    price: minPrice,
    bookingUrl: airline.bookingBaseUrl,
    options,
  };
}

// ════════════════════════════════════════════════════════
// 📋  بيانات الرحلات — أضف مسارًا هنا بسهولة
// ════════════════════════════════════════════════════════
interface RouteSpec {
  airlineId: AirlineId;
  baseUSD: number;
  flightCode: string;
  dep: string;   // departure HH:MM
  arr: string;   // arrival HH:MM
  duration: string;
  aircraft: string;
}

const ROUTE_SPECS: Record<string, RouteSpec[]> = {
  "ADE-CAI": [
    { airlineId: "FLY_ADEN", baseUSD: 244, flightCode: "AD 102", dep: "16:30", arr: "20:00", duration: "3س 30د", aircraft: "Boeing 737-800" },
    { airlineId: "YEMENIA",  baseUSD: 250, flightCode: "IY 600", dep: "08:00", arr: "11:30", duration: "3س 30د", aircraft: "Airbus A320" },
  ],
  "ADE-JED": [
    { airlineId: "FLY_ADEN", baseUSD: 180, flightCode: "AD 210", dep: "10:00", arr: "12:15", duration: "2س 15د", aircraft: "Boeing 737-800" },
    { airlineId: "YEMENIA",  baseUSD: 190, flightCode: "IY 512", dep: "06:30", arr: "08:45", duration: "2س 15د", aircraft: "Airbus A320" },
  ],
  "ADE-RUH": [
    { airlineId: "FLY_ADEN", baseUSD: 200, flightCode: "AD 312", dep: "09:00", arr: "12:00", duration: "3س",     aircraft: "Boeing 737-800" },
    { airlineId: "YEMENIA",  baseUSD: 210, flightCode: "IY 420", dep: "13:30", arr: "16:30", duration: "3س",     aircraft: "Airbus A320" },
  ],
  "ADE-AMM": [
    { airlineId: "FLY_ADEN", baseUSD: 290, flightCode: "AD 450", dep: "11:00", arr: "14:30", duration: "3س 30د", aircraft: "Boeing 737-800" },
    { airlineId: "YEMENIA",  baseUSD: 300, flightCode: "IY 700", dep: "07:00", arr: "10:30", duration: "3س 30د", aircraft: "Airbus A320" },
  ],
  "ADE-KWI": [
    { airlineId: "FLY_ADEN", baseUSD: 270, flightCode: "AD 520", dep: "14:00", arr: "17:30", duration: "3س 30د", aircraft: "Boeing 737-800" },
  ],
  "ADE-IST": [
    { airlineId: "TURKISH",  baseUSD: 370, flightCode: "TK 182", dep: "09:30", arr: "13:45", duration: "4س 15د", aircraft: "Airbus A321" },
  ],
  "ADE-CDG": [
    { airlineId: "AIR_FRANCE", baseUSD: 466, flightCode: "AF 980", dep: "11:00", arr: "17:10", duration: "6س 10د", aircraft: "Boeing 777" },
  ],
  "ADE-LHR": [
    { airlineId: "BRITISH", baseUSD: 585, flightCode: "BA 122", dep: "08:30", arr: "15:15", duration: "6س 45د", aircraft: "Airbus A350" },
  ],
  "ADE-DXB": [
    { airlineId: "EMIRATES", baseUSD: 220, flightCode: "EK 855", dep: "14:00", arr: "16:15", duration: "2س 15د", aircraft: "Boeing 777-300ER" },
  ],
  "SAH-CAI": [
    { airlineId: "FLY_ADEN", baseUSD: 260, flightCode: "AD 104", dep: "15:00", arr: "18:30", duration: "3س 30د", aircraft: "Boeing 737-800" },
    { airlineId: "YEMENIA",  baseUSD: 270, flightCode: "IY 602", dep: "09:00", arr: "12:30", duration: "3س 30د", aircraft: "Airbus A320" },
  ],
  "GXF-CAI": [
    { airlineId: "FLY_ADEN", baseUSD: 240, flightCode: "AD 106", dep: "10:00", arr: "13:00", duration: "3س",     aircraft: "Boeing 737-800" },
  ],
  "GXF-JED": [
    { airlineId: "YEMENIA",  baseUSD: 170, flightCode: "IY 514", dep: "08:00", arr: "10:00", duration: "2س",     aircraft: "Airbus A320" },
  ],
  "SAH-JED": [
    { airlineId: "YEMENIA",  baseUSD: 175, flightCode: "IY 516", dep: "07:30", arr: "09:45", duration: "2س 15د", aircraft: "Airbus A320" },
  ],
  "RIY-CAI": [
    { airlineId: "FLY_ADEN", baseUSD: 255, flightCode: "AD 108", dep: "12:00", arr: "15:30", duration: "3س 30د", aircraft: "Boeing 737-800" },
  ],
  "JED-IST": [
    { airlineId: "TURKISH",  baseUSD: 400, flightCode: "TK 184", dep: "11:00", arr: "15:15", duration: "4س 15د", aircraft: "Airbus A321" },
  ],
  "JED-CDG": [
    { airlineId: "AIR_FRANCE", baseUSD: 500, flightCode: "AF 982", dep: "09:00", arr: "14:30", duration: "5س 30د", aircraft: "Boeing 777" },
  ],
  "JED-LHR": [
    { airlineId: "BRITISH", baseUSD: 620, flightCode: "BA 124", dep: "10:00", arr: "16:45", duration: "6س 45د", aircraft: "Airbus A350" },
  ],
  "JED-DXB": [
    { airlineId: "EMIRATES", baseUSD: 240, flightCode: "EK 857", dep: "15:00", arr: "17:15", duration: "2س 15د", aircraft: "Boeing 777-300ER" },
  ],
  "KWI-DXB": [
    { airlineId: "EMIRATES", baseUSD: 160, flightCode: "EK 860", dep: "13:00", arr: "14:30", duration: "1س 30د", aircraft: "Boeing 777-300ER" },
  ],
};

// ════════════════════════════════════════════════════════
// 🚀  POST Handler
// ════════════════════════════════════════════════════════
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { origin, destination, date, passengers, query } = body;

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and destination are required" }, { status: 400 });
    }

    // التحقق من أن تاريخ البحث ليس في الماضي
    const searchDate = parseSearchDate(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (searchDate < today) {
      return NextResponse.json({
        results: [],
        message: `⚠️ التاريخ المحدد (${fmtAr(searchDate)}) مضى. الرجاء اختيار تاريخ من اليوم فصاعداً.`,
      });
    }

    const routeKey = `${origin}-${destination}`;
    const specs    = ROUTE_SPECS[routeKey];

    if (!specs || specs.length === 0) {
      return NextResponse.json({
        results: [],
        message: `لا توجد رحلات مسجلة على الخط ${routeKey}. تواصل مع فريق الدعم لحجز رحلة مخصصة.`,
      });
    }

    const results: ReturnType<typeof buildFlightCard>[] = [];
    const messages: string[] = [];
    const passengerCount = parseInt(String(passengers)) || 1;

    for (const spec of specs) {
      const airline    = AIRLINES[spec.airlineId];
      const dayOfWeek  = searchDate.getDay();
      const fliesOnDay = airline.operatingDays.includes(dayOfWeek);

      if (fliesOnDay) {
        // الرحلة متاحة في اليوم المطلوب
        const card = buildFlightCard(
          airline, origin, destination, searchDate, false,
          spec.baseUSD, spec.flightCode, spec.dep, spec.arr, spec.duration, spec.aircraft
        );

        // تحقق من توفر مقاعد كافية للمسافرين
        const saverSeats = card.options[0].seats;
        if (saverSeats.available < passengerCount && saverSeats.statusEn === "full") {
          const alt = nextFlight(searchDate, airline.operatingDays);
          const altCard = buildFlightCard(
            airline, origin, destination, alt, true,
            spec.baseUSD, spec.flightCode, spec.dep, spec.arr, spec.duration, spec.aircraft
          );
          results.push(altCard);
          messages.push(`رحلة ${spec.flightCode} في ${fmtAr(searchDate)} ممتلئة — تم اقتراح أقرب رحلة متاحة يوم ${fmtAr(alt)}.`);
        } else {
          results.push(card);
        }
      } else {
        // لا تطير هذا اليوم — أقرب رحلة بديلة
        const alt = nextFlight(searchDate, airline.operatingDays);
        const altCard = buildFlightCard(
          airline, origin, destination, alt, true,
          spec.baseUSD, spec.flightCode, spec.dep, spec.arr, spec.duration, spec.aircraft
        );
        results.push(altCard);
        messages.push(`${airline.nameAr} لا تطير يوم ${fmtAr(searchDate)}. أقرب رحلة يوم ${fmtAr(alt)}.`);
      }
    }

    // باقة فندقية إذا طُلبت
    if (query && (query.includes("فندق") || query.includes("باقة"))) {
      const destInfo = AIRPORTS[destination] ?? { ar: destination };
      (results as any[]).push({
        id: "alqadi-package",
        type: "package",
        title: `باقة إقامة فاخرة — ${destInfo.ar}`,
        description: "إقامة 5 ليالٍ فندق 5 نجوم شاملة الإفطار، الاستقبال من المطار، وجولات سياحية مميزة.",
        price: 950,
        priceUSD: 950,
        priceSAR: 3563,
        priceKWD: 291,
        airline: "مجموعة القاضي الذهبية",
        rating: 5.0,
        duration: "5 ليالي",
        dateText: fmtAr(searchDate),
        bookingUrl: "/portal/packages",
        options: [],
      });
    }

    const message = messages.length > 0 ? messages.join(" | ") : "";

    return NextResponse.json({ results, message });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
