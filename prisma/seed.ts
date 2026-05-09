import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ⛔ SECURITY: Never run seed in production
  if (process.env.NODE_ENV === "production") {
    throw new Error("⛔ Seed script is disabled in production environment!");
  }

  console.log("🌱 بدء تعبئة قاعدة البيانات...\n");

  // ═══════════════════════════════════════════════
  // 1. الموظفون
  // ═══════════════════════════════════════════════
  // ⚠️ SECURITY: Passwords from environment variables only
  const adminPw = process.env.SEED_ADMIN_PASSWORD || "Admin_" + Date.now().toString(36);
  const agentPw = process.env.SEED_AGENT_PASSWORD || "Agent_" + Date.now().toString(36);
  const adminPassword = await hash(adminPw, 12);
  const agentPassword = await hash(agentPw, 12);

  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        name: "مدير النظام",
        username: "admin",
        password: adminPassword,
        role: "admin",
        branch: "main",
        title: "مدير عام",
        email: "admin@alqadigroup.com",
        phone: "+96598765432",
      },
    }),
    prisma.employee.upsert({
      where: { username: "ahmed.supervisor" },
      update: {},
      create: {
        name: "أحمد القاضي",
        username: "ahmed.supervisor",
        password: adminPassword,
        role: "supervisor",
        branch: "main",
        title: "مشرف عام",
        email: "ahmed@alqadigroup.com",
      },
    }),
    prisma.employee.upsert({
      where: { username: "sara.agent" },
      update: {},
      create: {
        name: "سارة المنصور",
        username: "sara.agent",
        password: agentPassword,
        role: "agent",
        branch: "aden_sanafer",
        title: "وكيل حجوزات",
        email: "sara@alqadigroup.com",
      },
    }),
    prisma.employee.upsert({
      where: { username: "mohammed.agent" },
      update: {},
      create: {
        name: "محمد علي",
        username: "mohammed.agent",
        password: agentPassword,
        role: "agent",
        branch: "sanaa",
        title: "وكيل تأشيرات",
        email: "mohammed@alqadigroup.com",
      },
    }),
  ]);
  console.log(`✅ تم إنشاء ${employees.length} موظفين`);

  // ═══════════════════════════════════════════════
  // 2. الفنادق
  // ═══════════════════════════════════════════════
  const hotels = await Promise.all([
    prisma.hotel.upsert({
      where: { id: "hotel-makkah-hilton" },
      update: {},
      create: {
        id: "hotel-makkah-hilton",
        name: "هيلتون مكة المكرمة",
        nameEn: "Hilton Makkah Convention",
        city: "مكة المكرمة",
        country: "المملكة العربية السعودية",
        stars: 5,
        description: "فندق فاخر يقع على بعد خطوات من الحرم المكي الشريف. يتميز بإطلالات خلابة على الحرم وخدمات راقية تلبي احتياجات الحجاج والمعتمرين.",
        priceFrom: 85,
        currency: "KWD",
        images: JSON.parse(JSON.stringify([
          "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        ])),
        amenities: JSON.parse(JSON.stringify(["واي فاي مجاني", "مطعم", "مسبح", "صالة رياضة", "موقف سيارات", "خدمة الغرف 24/7"])),
        featured: true,
      },
    }),
    prisma.hotel.upsert({
      where: { id: "hotel-istanbul-marriott" },
      update: {},
      create: {
        id: "hotel-istanbul-marriott",
        name: "ماريوت إسطنبول شيشلي",
        nameEn: "Istanbul Marriott Hotel Sisli",
        city: "إسطنبول",
        country: "تركيا",
        stars: 5,
        description: "في قلب إسطنبول الأوروبية، يوفر إقامة فاخرة مع إطلالات بانورامية على المدينة وخدمات عالمية المستوى.",
        priceFrom: 55,
        currency: "KWD",
        images: JSON.parse(JSON.stringify([
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
        ])),
        amenities: JSON.parse(JSON.stringify(["واي فاي مجاني", "مطعم", "سبا", "مركز أعمال", "نقل من المطار"])),
        featured: true,
      },
    }),
    prisma.hotel.upsert({
      where: { id: "hotel-dubai-jw" },
      update: {},
      create: {
        id: "hotel-dubai-jw",
        name: "JW ماريوت دبي",
        nameEn: "JW Marriott Marquis Dubai",
        city: "دبي",
        country: "الإمارات العربية المتحدة",
        stars: 5,
        description: "أطول فندق في العالم، يوفر تجربة إقامة لا مثيل لها مع 14 مطعماً وبار وإطلالات ساحرة على قناة دبي المائية.",
        priceFrom: 70,
        currency: "KWD",
        images: JSON.parse(JSON.stringify([
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        ])),
        amenities: JSON.parse(JSON.stringify(["واي فاي مجاني", "14 مطعم", "مسبح خارجي", "سبا", "صالة رياضة"])),
        featured: true,
      },
    }),
    prisma.hotel.upsert({
      where: { id: "hotel-cairo-four-seasons" },
      update: {},
      create: {
        id: "hotel-cairo-four-seasons",
        name: "فور سيزونز القاهرة",
        nameEn: "Four Seasons Cairo at Nile Plaza",
        city: "القاهرة",
        country: "مصر",
        stars: 5,
        description: "على ضفاف نهر النيل الخالد، يقدم أرقى تجربة ضيافة في مصر مع حدائق خضراء ومطاعم عالمية.",
        priceFrom: 60,
        currency: "KWD",
        images: JSON.parse(JSON.stringify([
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        ])),
        amenities: JSON.parse(JSON.stringify(["واي فاي مجاني", "مطعم", "مسبح", "سبا", "إطلالة على النيل"])),
        featured: false,
      },
    }),
  ]);
  console.log(`✅ تم إنشاء ${hotels.length} فنادق`);

  // ═══════════════════════════════════════════════
  // 3. الغرف
  // ═══════════════════════════════════════════════
  const rooms = await Promise.all([
    prisma.room.create({
      data: { hotelId: "hotel-makkah-hilton", type: "غرفة مفردة", price: 85, capacity: 1 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-makkah-hilton", type: "غرفة مزدوجة", price: 120, capacity: 2 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-makkah-hilton", type: "جناح فاخر", price: 250, capacity: 4 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-istanbul-marriott", type: "غرفة مزدوجة", price: 55, capacity: 2 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-istanbul-marriott", type: "جناح عائلي", price: 95, capacity: 4 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-dubai-jw", type: "غرفة ديلوكس", price: 70, capacity: 2 },
    }),
    prisma.room.create({
      data: { hotelId: "hotel-dubai-jw", type: "جناح رئاسي", price: 350, capacity: 4 },
    }),
  ]);
  console.log(`✅ تم إنشاء ${rooms.length} غرف`);

  // ═══════════════════════════════════════════════
  // 4. التأشيرات
  // ═══════════════════════════════════════════════
  const visas = await Promise.all([
    prisma.visa.create({
      data: {
        country: "تركيا", countryEn: "Turkey", type: "tourism",
        price: 25, processingDays: 5,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري 6 أشهر", "صورة شخصية", "حجز فندق", "تذكرة طيران"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر", "صورة 4×6", "كشف حساب بنكي"])),
        description: "تأشيرة سياحية لتركيا — معالجة سريعة خلال 5 أيام عمل.",
      },
    }),
    prisma.visa.create({
      data: {
        country: "مصر", countryEn: "Egypt", type: "tourism",
        price: 15, processingDays: 3,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري", "صورة شخصية"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر", "صورة 4×6"])),
        description: "تأشيرة سياحية لمصر — تصدر خلال 3 أيام عمل.",
      },
    }),
    prisma.visa.create({
      data: {
        country: "ماليزيا", countryEn: "Malaysia", type: "tourism",
        price: 20, processingDays: 7,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري 6 أشهر", "صورة شخصية", "حجز فندق"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر", "صورة 4×6", "خطاب دعوة"])),
        description: "تأشيرة سياحية لماليزيا — معالجة خلال أسبوع.",
      },
    }),
    prisma.visa.create({
      data: {
        country: "أذربيجان", countryEn: "Azerbaijan", type: "tourism",
        price: 18, processingDays: 3,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري", "صورة شخصية"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر", "صورة 4×6"])),
        description: "تأشيرة إلكترونية لأذربيجان — تصدر خلال 3 أيام.",
      },
    }),
    prisma.visa.create({
      data: {
        country: "جورجيا", countryEn: "Georgia", type: "tourism",
        price: 12, processingDays: 2,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر"])),
        description: "تأشيرة جورجيا — لا تحتاج إجراءات معقدة.",
      },
    }),
    prisma.visa.create({
      data: {
        country: "المملكة المتحدة", countryEn: "United Kingdom", type: "tourism",
        price: 65, processingDays: 15,
        requirements: JSON.parse(JSON.stringify(["جواز سفر ساري 6 أشهر", "صور شخصية", "كشف حساب بنكي 6 أشهر", "حجز فندق", "تذكرة طيران", "خطاب عمل"])),
        documents: JSON.parse(JSON.stringify(["نسخة جواز السفر", "صور 4×6", "كشف حساب", "خطاب تعريف بالراتب", "تأمين سفر"])),
        description: "تأشيرة سياحية للمملكة المتحدة — معالجة مهنية للملف.",
      },
    }),
  ]);
  console.log(`✅ تم إنشاء ${visas.length} تأشيرات`);

  console.log("\n════════════════════════════════════════════");
  console.log("✅ تم تعبئة قاعدة البيانات بنجاح!");
  console.log("════════════════════════════════════════════");
  console.log("\n📋 الحسابات المُنشأة:");
  console.log("   المدير: admin");
  console.log("   المشرف: ahmed.supervisor");
  console.log("   الوكيل: sara.agent");
  console.log("   الوكيل: mohammed.agent");
  console.log("\n⚠️  كلمات المرور مُعرَّفة عبر متغيرات البيئة:");
  console.log("   SEED_ADMIN_PASSWORD / SEED_AGENT_PASSWORD");
  console.log("   إذا لم تُحدد، تم إنشاء كلمات عشوائية لمرة واحدة.");
}

main()
  .catch((e) => {
    console.error("❌ خطأ:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
