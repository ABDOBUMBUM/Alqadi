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

  // ═══════════════════════════════════════════════
  // 5. الوجهات السياحية والباقات
  // ═══════════════════════════════════════════════
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: "إسطنبول", country: "تركيا", priceKWD: 120,
        lat: 41.0082, lng: 28.9784,
        description: "مدينة السحر والجمال التي تجمع بين قارتي آسيا وأوروبا",
        imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800",
        featured: true,
      }
    }),
    prisma.destination.create({
      data: {
        name: "القاهرة", country: "مصر", priceKWD: 85,
        lat: 30.0444, lng: 31.2357,
        description: "عاصمة التاريخ والحضارة العريقة",
        imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
        featured: true,
      }
    }),
    prisma.destination.create({
      data: {
        name: "دبي", country: "الإمارات العربية المتحدة", priceKWD: 150,
        lat: 25.2048, lng: 55.2708,
        description: "مدينة المستقبل والتسوق الفاخر",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        featured: false,
      }
    }),
  ]);

  const packages = await Promise.all([
    prisma.package.create({
      data: {
        title: "عطلة إسطنبول المميزة",
        destinationId: destinations[0].id,
        days: 8, nights: 7, price: 150, currency: "KWD",
        discount: "10%",
        includes: JSON.parse(JSON.stringify(["تذاكر الطيران", "فندق 5 نجوم", "الإفطار", "جولات سياحية"])),
      }
    }),
    prisma.package.create({
      data: {
        title: "اكتشف القاهرة",
        destinationId: destinations[1].id,
        days: 5, nights: 4, price: 95, currency: "KWD",
        includes: JSON.parse(JSON.stringify(["تذاكر الطيران", "فندق مطل على النيل", "جولة في الأهرامات"])),
      }
    }),
  ]);
  
  console.log(`✅ تم إنشاء ${destinations.length} وجهات و ${packages.length} باقات`);

  // ═══════════════════════════════════════════════
  // 6. الوظائف (الأيدي العاملة)
  // ═══════════════════════════════════════════════
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "سائق خاص", titleEn: "Private Driver", category: "drivers",
        country: "الكويت", salary: 180, currency: "KWD", experience: "3 سنوات",
        description: "مطلوب سائق خاص ذو خبرة لا تقل عن 3 سنوات في القيادة بالكويت.",
        requirements: JSON.parse(JSON.stringify(["رخصة قيادة سارية", "خبرة 3 سنوات", "حسن السيرة والسلوك"])),
        imageUrl: "https://images.unsplash.com/photo-1449965408869-ebd13bc9e5d8?w=800",
      },
    }),
    prisma.job.create({
      data: {
        title: "عاملة منزلية", titleEn: "Housemaid", category: "domestic",
        country: "الفلبين", salary: 120, currency: "KWD", experience: "سنة واحدة",
        description: "عاملة منزلية من الفلبين ذات خبرة في الطبخ والتنظيف ورعاية الأطفال.",
        requirements: JSON.parse(JSON.stringify(["خبرة سنة", "إجادة الإنجليزية", "شهادة صحية"])),
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      },
    }),
    prisma.job.create({
      data: {
        title: "طباخ محترف", titleEn: "Professional Cook", category: "cooking",
        country: "الهند", salary: 150, currency: "KWD", experience: "5 سنوات",
        description: "طباخ محترف متخصص في المأكولات العربية والهندية والغربية.",
        requirements: JSON.parse(JSON.stringify(["خبرة 5 سنوات", "شهادة في فنون الطبخ", "شهادة صحية"])),
        imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800",
      },
    }),
  ]);
  console.log(`✅ تم إنشاء ${jobs.length} وظائف`);

  // ═══════════════════════════════════════════════
  // 7. الفروع
  // ═══════════════════════════════════════════════
  const branches = await Promise.all([
    prisma.branch.create({ data: { name: "المقر الرئيسي", city: "الكويت", phone: "+96522345678", address: "شارع الخليج العربي — مجمع القاضي" } }),
    prisma.branch.create({ data: { name: "فرع عدن الصنافر", city: "عدن", phone: "+96737123456", address: "عدن — الصنافر" } }),
    prisma.branch.create({ data: { name: "فرع صنعاء", city: "صنعاء", phone: "+96711234567", address: "صنعاء — شارع الزبيري" } }),
  ]);
  console.log(`✅ تم إنشاء ${branches.length} فروع`);

  // ═══════════════════════════════════════════════
  // 8. التسعير
  // ═══════════════════════════════════════════════
  const pricing = await Promise.all([
    prisma.pricing.create({ data: { destination: "إسطنبول", ticket: 120, security: 15, visa: 25 } }),
    prisma.pricing.create({ data: { destination: "القاهرة", ticket: 85, security: 10, visa: 15 } }),
    prisma.pricing.create({ data: { destination: "دبي", ticket: 65, security: 10, visa: 0 } }),
    prisma.pricing.create({ data: { destination: "ماليزيا", ticket: 180, security: 15, visa: 20 } }),
    prisma.pricing.create({ data: { destination: "لندن", ticket: 250, security: 20, visa: 65 } }),
  ]);
  console.log(`✅ تم إنشاء ${pricing.length} أسعار`);

  // ═══════════════════════════════════════════════
  // 9. العملاء
  // ═══════════════════════════════════════════════
  const clients = await Promise.all([
    prisma.client.create({ data: { name: "عبدالله المطيري", email: "abdullah@example.com", phone: "+96599001122", nationality: "كويتي", loyaltyPts: 1500 } }),
    prisma.client.create({ data: { name: "فاطمة الحسن", email: "fatima@example.com", phone: "+96599003344", nationality: "كويتية", loyaltyPts: 2800 } }),
    prisma.client.create({ data: { name: "محمد العمري", email: "m.omari@example.com", phone: "+96599005566", nationality: "سعودي", loyaltyPts: 900 } }),
    prisma.client.create({ data: { name: "نورة السالم", email: "noura@example.com", phone: "+96599007788", nationality: "كويتية", loyaltyPts: 3200 } }),
  ]);
  console.log(`✅ تم إنشاء ${clients.length} عملاء`);

  // ═══════════════════════════════════════════════
  // 10. الحجوزات
  // ═══════════════════════════════════════════════
  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        clientId: clients[0].id, employeeId: employees[2].id,
        serviceType: "FLIGHT", status: "confirmed", totalAmount: 240, paidAmount: 240, currency: "KWD",
        details: JSON.parse(JSON.stringify({ route: "KWI → IST", airline: "الخطوط التركية", pnr: "ABC123" })),
      },
    }),
    prisma.booking.create({
      data: {
        clientId: clients[1].id, employeeId: employees[2].id,
        serviceType: "HOTEL", status: "confirmed", totalAmount: 420, paidAmount: 300, currency: "KWD",
        details: JSON.parse(JSON.stringify({ hotel: "هيلتون مكة", checkIn: "2026-06-01", checkOut: "2026-06-07" })),
      },
    }),
    prisma.booking.create({
      data: {
        clientId: clients[2].id, employeeId: employees[3].id,
        serviceType: "VISA", status: "pending", totalAmount: 25, paidAmount: 0, currency: "KWD",
        details: JSON.parse(JSON.stringify({ country: "تركيا", type: "سياحية" })),
      },
    }),
    prisma.booking.create({
      data: {
        clientId: clients[3].id, employeeId: employees[2].id,
        serviceType: "PACKAGE", status: "completed", totalAmount: 650, paidAmount: 650, currency: "KWD",
        details: JSON.parse(JSON.stringify({ package: "عطلة إسطنبول المميزة", persons: 4 })),
      },
    }),
    prisma.booking.create({
      data: {
        clientId: clients[0].id, employeeId: employees[3].id,
        serviceType: "MANPOWER", status: "pending", totalAmount: 350, paidAmount: 175, currency: "KWD",
        details: JSON.parse(JSON.stringify({ job: "سائق خاص", nationality: "هندي" })),
      },
    }),
  ]);
  console.log(`✅ تم إنشاء ${bookings.length} حجوزات`);

  // ═══════════════════════════════════════════════
  // 11. تذاكر الدعم الفني
  // ═══════════════════════════════════════════════
  const tickets = await Promise.all([
    prisma.supportTicket.create({
      data: { clientId: clients[0].id, subject: "استفسار عن حجز طيران", description: "أرغب بمعرفة تفاصيل الحجز رقم ABC123 وإمكانية تغيير الموعد.", status: "open", priority: "medium" },
    }),
    prisma.supportTicket.create({
      data: { clientId: clients[1].id, subject: "مشكلة في الدفع الإلكتروني", description: "تم خصم المبلغ من حسابي لكن الحجز لم يتأكد بعد.", status: "open", priority: "high" },
    }),
    prisma.supportTicket.create({
      data: { clientId: clients[2].id, subject: "طلب إلغاء تأشيرة", description: "أرغب بإلغاء طلب التأشيرة التركية واسترداد المبلغ.", status: "in_progress", priority: "low" },
    }),
  ]);
  console.log(`✅ تم إنشاء ${tickets.length} تذاكر دعم`);

  // ═══════════════════════════════════════════════
  // 12. إعدادات الموقع (company + stats)
  // ═══════════════════════════════════════════════
  await prisma.siteSetting.upsert({
    where: { key: "company" },
    update: {},
    create: {
      key: "company",
      value: {
        nameAr: "مجموعة القاضي الذهبية", nameEn: "Golden Al'Qadi Group",
        phone: "+96598765432", email: "info@alqadigroup.com",
        address: "الكويت — مجمع القاضي، شارع الخليج العربي",
        whatsapp: "96598765432", foundedYear: "1980",
        taglineAr: "السفريات والسياحة وخدمات الأيادي العاملة",
        taglineEn: "Travel, Tourism & Manpower Services",
      },
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "stats" },
    update: {},
    create: {
      key: "stats",
      value: {
        clients: "860,000+", experience: "45+",
        countries: "75+", satisfaction: "98%",
      },
    },
  });
  console.log("✅ تم إنشاء إعدادات الموقع (company + stats)");

  // ═══════════════════════════════════════════════
  // 13. صفحات CMS
  // ═══════════════════════════════════════════════
  const cmsPages = [
    {
      slug: "home", title: "الصفحة الرئيسية",
      content: {
        heroTitle: "مجموعة القاضي الذهبية",
        heroSubtitle: "شريكك المثالي في السفريات والسياحة وخدمات الأيدي العاملة منذ 1980",
        heroImage: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200",
        welcomeTitlePrefix: "مرحباً بكم في",
        welcomeTitleHighlight: "مجموعة القاضي الذهبية",
        welcomeBody: "نحن في مجموعة القاضي للسفريات والسياحة وخدمات الأيادي العاملة نضع بين أيديكم أكثر من أربعة عقود من التميز والخبرة.",
        inspirationImage1: "/assets/inspiration-cabin-1-v3.png",
        inspirationImage1Alt: "رفاهية السفر مع مجموعة القاضي",
        inspirationImage2: "/assets/inspiration-cabin-2-v4.png",
        inspirationImage2Alt: "الامتياز الذهبي لمجموعة القاضي",
        servicesEyebrow: "SIGNATURE SERVICES",
        servicesTitle: "خدمات مجموعة القاضي المتكاملة",
        servicesSubtitle: "توفر مجموعة القاضي الذهبية تجربة تفاعلية سريعة، ذكية، ومصممة لتبدو فاخرة على كل المستويات.",
        services: [
          { title: "حجز الطيران", desc: "أفضل أسعار تذاكر الطيران لجميع الوجهات", icon: "plane" },
          { title: "حجز الفنادق", desc: "فنادق فاخرة في أكثر من 75 دولة", icon: "hotel" },
          { title: "التأشيرات", desc: "خدمات تأشيرات سريعة واحترافية", icon: "visa" },
          { title: "الأيدي العاملة", desc: "استقدام عمالة مدربة ومؤهلة", icon: "manpower" },
        ],
        offersTitle: "عروض مجموعة القاضي الحصرية",
        offersLink: "/services/travel",
        offersLinkLabel: "كل العروض",
        offers: [
          { title: "باقة أوروبا الملكية", discount: "خصم 22%", body: "تذاكر + فندق + تأمين شامل مع مرونة تغيير." },
          { title: "برنامج الصيف الذهبي", discount: "خصم 18%", body: "أقساط مريحة وخيارات عائلية شاملة." },
          { title: "Business Elite", discount: "امتيازات VIP", body: "مسارات سريعة وصالات مطار وخدمة مدير رحلة." },
        ],
        whyTitle: "لماذا تختار مجموعة القاضي؟",
        whyDesc: "نحوّل تجربة السفر إلى قصة متكاملة: تخطيط، حجز، خدمة، متابعة.",
        whyImage: "/assets/travel_luxury_asset_v3.png",
        whyImageAlt: "تجربة سفر فاخرة",
        tourismTitle: "السياحة الراقية مع مجموعة القاضي",
        tourismDesc: "نقدم في مجموعة القاضي الذهبية برامج فردية وعائلية مع تنقلات خاصة، إرشاد سياحي محترف، وترشيحات ذكية بناء على أسلوب سفرك الفاخر.",
        tourismImage: "/assets/tourism_luxury_v3.png",
        tourismImageAlt: "سياحة فاخرة",
        tourismLink: "/services/travel",
        tourismLinkLabel: "ابدأ برنامجك الآن",
        manpowerTitle: "كوادر القاضي للأيادي العاملة",
        manpowerDesc: "توفر مجموعة القاضي أفضل خدمات ترشيح وتصفية ومتابعة الأيادي العاملة، مع شفافية كاملة في الإجراءات والوثائق واهتمام إنساني عالٍ.",
        manpowerImage: "/assets/manpower_luxury_v2.png",
        manpowerImageAlt: "أيدي عاملة محترفة",
        manpowerLink: "/services/manpower",
        manpowerLinkLabel: "اطلب الخدمة",
        newsTitle: "آخر الأخبار",
        newsLink: "/blog",
        newsLinkLabel: "كل المقالات",
        updates: [
          { title: "إطلاق بوابة متابعة الطلبات", time: "منذ يومين", tag: "تطوير" },
          { title: "تحديث عروض تركيا وماليزيا", time: "منذ 4 أيام", tag: "عروض" },
          { title: "شراكات جديدة مع فنادق 5 نجوم", time: "منذ أسبوع", tag: "شراكات" },
        ],
        bookingTitle: "احجز رحلتك أو خدمتك الآن مع مجموعة القاضي",
        bookingDesc: "رحلة تفاعلية من 3 خطوات، لضمان راحتك مع حفظ تلقائي للبيانات وسهولة متابعة الطلب مع خبراء مجموعة القاضي.",
        newsletterTitle: "اشترك في النشرة الذهبية",
        newsletterDesc: "تنبيهات عروض، تحديثات رحلات، وفرص حصرية لأعضاء المجتمع.",
        newsletterPlaceholder: "أدخل بريدك الإلكتروني",
        newsletterButton: "اشترك الآن",
        heroBadge: "مجموعة القاضي الذهبية · الكويت",
        heroMainTitle: "سافر بثقة · نرتقي بتجربتك",
        heroMainSubtitle: "مجموعة القاضي الذهبية للسفريات والسياحة — تجارب سفر استثنائية بأعلى معايير الفخامة والاحترافية.",
        heroMainImage: "/assets/background.jpg",
        heroPrimaryCtaLabel: "احجز رحلتك الآن",
        heroPrimaryCtaHref: "#booking",
        heroSecondaryCtaLabel: "استكشف خدماتنا",
        heroSecondaryCtaHref: "#services",
        heroStats: [
          { label: "حجوزات طيران", sub: "أفضل الأسعار" },
          { label: "خدمات متكاملة", sub: "حلول شاملة" },
          { label: "برامج سياحية", sub: "تجارب فريدة" },
          { label: "دعم 24/7", sub: "خدمة عملاء" }
        ],
        destinationsEyebrow: "تجربة تفاعلية على الخريطة",
        destinationsTitle: "اختر رحلتك من الكرة الأرضية",
        destinationsSubtitle: "كل نقطة على الخريطة تمثل وجهة حقيقية. اضغط على الدولة لتظهر لك التفاصيل والسعر والخدمات مباشرة.",
        destinationDurationDefault: "5 أيام",
        destinationHighlightsDefault: ["جولات ثقافية", "إقامة فاخرة", "تنقل مريح"],
        footerAbout: "مجموعة القاضي الذهبية — أكثر من 45 عاماً من الخبرة في خدمات السفر والسياحة والاستقدام.",
        whatsappMessage: "مرحباً، أود الاستفسار عن خدماتكم",
        whatsappHint: "تحدث معنا على واتساب",
      },
    },
    {
      slug: "about", title: "من نحن",
      content: {
        heroTitle: "من نحن",
        heroDesc: "مجموعة القاضي الذهبية — أكثر من 45 عاماً من التميز في خدمات السفر والسياحة والاستقدام",
        mission: "نسعى لتقديم أفضل خدمات السفر والسياحة والاستقدام بأعلى معايير الجودة والاحترافية.",
        vision: "أن نكون الخيار الأول والأمثل في منطقة الخليج لخدمات السفر المتكاملة.",
        history: "تأسست مجموعة القاضي الذهبية عام 1980 في دولة الكويت، وتطورت لتصبح واحدة من أبرز الشركات في مجال السفر والسياحة وخدمات الأيدي العاملة.",
        stats: [
          { value: "860,000+", label: "عميل سعيد" },
          { value: "45+", label: "سنة خبرة" },
          { value: "75+", label: "دولة حول العالم" },
          { value: "5", label: "فروع نشطة" },
          { value: "ISO 9001", label: "شهادة الجودة" },
          { value: "98%", label: "نسبة الرضا" },
        ],
        values: [
          { title: "الموثوقية", desc: "نلتزم بأعلى معايير الجودة والشفافية في كل خدماتنا.", icon: "ShieldCheck" },
          { title: "التميّز", desc: "نسعى لتقديم تجربة استثنائية تفوق توقعات عملائنا.", icon: "Star" },
          { title: "العميل أولاً", desc: "نضع رضا العميل في صميم كل قراراتنا التشغيلية.", icon: "Users" },
          { title: "الانتشار العالمي", desc: "شبكة شراكات استراتيجية في 75+ دولة تضمن أفضل الخدمات.", icon: "Globe2" },
        ],
        milestones: [
          { year: "1980", title: "التأسيس", desc: "تأسيس مجموعة القاضي الذهبية للسفريات والسياحة في الكويت." },
          { year: "1992", title: "التوسع الإقليمي", desc: "فتح فروع جديدة في اليمن — عدن وصنعاء." },
          { year: "2005", title: "خدمات الأيادي العاملة", desc: "إطلاق قسم الأيادي العاملة لتوظيف الكفاءات." },
          { year: "2015", title: "شهادة ISO 9001", desc: "الحصول على شهادة الجودة العالمية ISO 9001." },
          { year: "2020", title: "التحول الرقمي", desc: "إطلاق المنصة الرقمية الشاملة للحجوزات الإلكترونية." },
          { year: "2025", title: "860,000 عميل", desc: "تجاوز 860,000 عميل سعيد مع شبكة شراكات في 75+ دولة." },
        ],
        services: [
          { title: "السفريات والسياحة", desc: "حجوزات طيران وبرامج سياحية مخصصة لأكثر من 150 وجهة عالمية.", href: "/services/travel", icon: "Plane" },
          { title: "حجوزات الفنادق", desc: "فنادق 4 و5 نجوم بأسعار حصرية مع ضمان أفضل سعر.", href: "/services/hotels", icon: "Hotel" },
          { title: "خدمات التأشيرات", desc: "معالجة سريعة وموثوقة للتأشيرات لأكثر من 30 دولة.", href: "/services/visa", icon: "Globe2" },
          { title: "الأيادي العاملة", desc: "توظيف الكفاءات من مختلف التخصصات للشركات في الخليج.", href: "/services/manpower", icon: "Briefcase" },
        ],
        ctaTitle: "هل تحتاج مساعدة في تخطيط رحلتك؟",
        ctaDesc: "فريق مجموعة القاضي الذهبية جاهز لمساعدتك على مدار الساعة عبر واتساب أو الهاتف.",
        ctaButton: "تواصل معنا الآن",
      },
    },
    {
      slug: "contact", title: "اتصل بنا",
      content: {
        heroTitle: "اتصل بنا",
        heroDesc: "نحن هنا لخدمتك — تواصل معنا عبر أي من القنوات التالية",
        formFields: ["الاسم الكامل", "البريد الإلكتروني", "رقم الهاتف", "نوع الخدمة", "الرسالة"],
        mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.8!2d47.97!3d29.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDIyJzQ4LjAiTiA0N8KwNTgnMTIuMCJF!5e0!3m2!1sar!2skw!4v1",
      },
    },
    {
      slug: "travel", title: "السفر والسياحة",
      content: {
        heroTitle: "اكتشف العالم مع القاضي",
        heroDesc: "رحلاتك المثالية تنتظرك — وجهات عالمية، باقات مخصصة، وخبرة 45 عاماً في خدمتك.",
        heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
        heroTags: ["+150 وجهة", "+45 سنة خبرة", "دعم 24/7", "أفضل الأسعار"],
        destinationsTitle: "الوجهات المميزة",
        packagesTitle: "باقات السفر",
        packagesSubtitle: "اختر الباقة التي تناسبك من مجموعة القاضي",
        bookingTitle: "احجز رحلتك الآن",
        bookingSubtitle: "أرسل بياناتك ونتواصل معك فوراً",
        ctaTitle: "جاهز للمغامرة؟",
        ctaDesc: "فريق القاضي يساعدك في اختيار وجهتك وتخطيط رحلتك بالكامل.",
        ctaButton: "تواصل عبر واتساب",
      },
    },
    {
      slug: "faq", title: "الأسئلة الشائعة",
      content: {
        heroTitle: "الأسئلة الشائعة",
        questions: [
          { q: "كيف يمكنني حجز تذكرة طيران؟", a: "يمكنك الحجز عبر موقعنا أو الاتصال بنا مباشرة أو زيارة أقرب فرع." },
          { q: "ما هي مدة استخراج التأشيرة؟", a: "تختلف حسب الدولة — من 2 إلى 15 يوم عمل." },
          { q: "هل يمكن إلغاء الحجز واسترداد المبلغ؟", a: "نعم، وفق سياسة الإلغاء الخاصة بكل خدمة." },
          { q: "ما هي خدمات الاستقدام المتاحة؟", a: "نوفر سائقين، عاملات منزليات، طباخين، ومربيات من عدة جنسيات." },
        ],
      },
    },
    {
      slug: "clients", title: "العملاء",
      content: {
        heroTitle: "شركاء النجاح",
        heroDesc: "نفخر بثقة عملائنا من الأفراد والشركات في الكويت والمنطقة.",
        ctaTitle: "انضم إلى عائلة القاضي",
        ctaDesc: "تواصل معنا لوضع حل مخصص لاحتياجاتك.",
        ctaWhatsappMessage: "مرحباً، أود الاستفسار عن خدمات الشركات",
        stats: [
          { value: "860,000+", label: "عميل سعيد" },
          { value: "45+", label: "سنة خبرة" },
          { value: "75+", label: "دولة حول العالم" },
          { value: "ISO 9001", label: "شهادة الجودة" },
        ],
      },
    },
    {
      slug: "blog", title: "المدونة",
      content: {
        title: "مدونة القاضي",
        subtitle: "نصائح السفر وأخبار العروض والتحديثات.",
        posts: [
          { slug: "luxury-travel-trends", title: "اتجاهات السفر الفاخر", date: "2026-04-01" },
          { slug: "visa-checklist-2026", title: "قائمة تدقيق التأشيرات 2026", date: "2026-03-12" },
        ],
      },
    },
    {
      slug: "vip", title: "VIP",
      content: {
        title: "VIP Concierge",
        subtitle: "لوحة مختصرة للعملاء المميزين — حالة الطلبات والمواعيد.",
      },
    },
    {
      slug: "hotels", title: "الفنادق",
      content: {
        heroTitle: "الفنادق الفاخرة",
        heroDesc: "إقامة مميزة في أفضل الفنادق حول العالم.",
        filters: ["الكل", "فاخر", "أعمال", "تراثي", "إقتصادي"],
        whyUs: [
          { title: "أفضل الأسعار المضمونة", desc: "نضمن أفضل سعر مع إمكانية الاسترداد الكامل" },
          { title: "دعم 24/7 عبر واتساب", desc: "فريقنا جاهز لمساعدتك في أي وقت ومن أي مكان" },
          { title: "فنادق مختارة بعناية", desc: "كل فندق يمر بمعايير صارمة للجودة والخدمة" },
        ],
        stats: [
          { label: "فندق شريك", value: "500+" },
          { label: "دولة مغطاة", value: "75+" },
          { label: "عميل راضٍ", value: "860K+" },
          { label: "سنة خبرة", value: "45+" },
        ],
      },
    },
    {
      slug: "visa", title: "التأشيرات",
      content: {
        heroTitle: "خدمات التأشيرات من القاضي",
        heroDesc: "دعم متكامل في الحصول على التأشيرة لأكثر من 30 دولة، بخبرة تمتد لأكثر من 45 عاماً.",
        destinationsTitle: "التأشيرات المتاحة عبر مجموعة القاضي",
        destinationsDesc: "اختر وجهتك واطلب تأشيرتك بسهولة عبر فريق القاضي",
        destinationsBtn: "قدّم طلبك الآن",
        stepsTitle: "كيف تحصل على تأشيرتك؟",
        features: [
          { text: "متابعة مستمرة للطلب", icon: "Shield" },
          { text: "معالجة سريعة وموثوقة", icon: "Clock" },
          { text: "تغطية +30 دولة", icon: "Globe2" },
          { text: "خبرة 45+ سنة", icon: "CheckCircle2" },
          { text: "دعم فني متواصل", icon: "Zap" },
          { text: "إشعارات فورية بحالة الطلب", icon: "Timer" },
        ],
        steps: [
          { title: "أرسل طلبك", desc: "أرسل بياناتك ومعلومات سفرك عبر النموذج أو واتساب", icon: "FileText" },
          { title: "أرفق المستندات", desc: "جواز السفر، الصور، الوثائق الداعمة — نرشدك لكل ما تحتاجه", icon: "Upload" },
          { title: "المراجعة والمعالجة", desc: "يراجع فريقنا الملف ويتولى كامل إجراءات التقديم", icon: "Search" },
          { title: "استلم التأشيرة", desc: "تُسلَّم التأشيرة إليكم إلكترونياً أو مطبوعة في الوقت المحدد", icon: "BadgeCheck" },
        ],
        ctaTitle: "فريق مجموعة القاضي جاهز لمساعدتك الآن",
        ctaDesc: "تواصل معنا عبر واتساب للحصول على رد فوري وخدمة شخصية.",
        ctaBtn: "تواصل عبر واتساب",
      },
    },
    {
      slug: "manpower", title: "الأيدي العاملة",
      content: {
        heroTitle: "خدمات الأيدي العاملة",
        heroDesc: "توفير كوادر مدربة ومؤهلة وفق احتياجك.",
        categories: ["الكل", "هندسة", "صحة", "تقنية", "ضيافة وفنادق", "مالية ومحاسبة", "نقل ولوجستيات"],
        process: [
          { step: "01", title: "تقديم الطلب", desc: "أرسل سيرتك الذاتية عبر واتساب أو النموذج المباشر" },
          { step: "02", title: "المراجعة والتصفية", desc: "يراجع فريقنا ملفك ويتحقق من المؤهلات والخبرات" },
          { step: "03", title: "المطابقة مع الفرص", desc: "نطابق ملفك مع أفضل الفرص المتاحة في قاعدة بياناتنا" },
          { step: "04", title: "التوظيف والمتابعة", desc: "نتولى إجراءات التأشيرة والعقد ونتابع ما بعد التوظيف" },
        ],
        employerFeatures: [
          "قاعدة بيانات 10,000+ مرشح مؤهل",
          "تصفية وفرز الملفات مسبقاً",
          "متابعة ما بعد التوظيف",
          "إجراءات التأشيرة والعقود",
        ],
        stats: [
          { value: "1,200+", label: "وظيفة مُنجزة" },
          { value: "45+", label: "شركة شريكة" },
          { value: "15+", label: "دولة عمل" },
          { value: "98%", label: "نسبة رضا" },
        ],
      },
    },
    {
      slug: "privacy", title: "سياسة الخصوصية",
      content: {
        pageTitle: "سياسة الخصوصية",
        lastUpdated: "آخر تحديث: 1 مايو 2026",
        sections: [
          { title: "1. مقدمة", body: "نحن في مجموعة القاضي الذهبية للسفريات والسياحة نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك." },
          { title: "2. البيانات التي نجمعها", bullets: ["الاسم والبريد والهاتف عند ملء النماذج", "بيانات جواز السفر عند طلب خدمات السفر والتأشيرات", "بيانات الاستخدام عبر ملفات تعريف الارتباط"] },
          { title: "3. كيف نستخدم بياناتك", bullets: ["تنفيذ الحجوزات والخدمات", "الرد على الاستفسارات والدعم", "تحسين تجربة الموقع", "إرسال العروض بموافقة مسبقة"] },
          { title: "4. مشاركة البيانات", bullets: ["شركات الطيران والفنادق والسفارات عند الحاجة", "مزودي خدمات الدفع", "الجهات الحكومية حسب القانون"] },
          { title: "5. أمن البيانات", body: "نتبع إجراءات أمنية وتقنيات حماية ملائمة لمنع الوصول غير المصرح به أو التلاعب بالبيانات." },
          { title: "6. حقوقك", bullets: ["الاطلاع على البيانات", "طلب التصحيح", "طلب الحذف عند عدم وجود التزام قانوني"] }
        ],
        contactTitle: "7. تواصل معنا",
        contactBody: "لأي استفسار حول الخصوصية تواصل معنا عبر البريد أو الهاتف."
      },
    },
    {
      slug: "cookies", title: "سياسة ملفات الارتباط",
      content: {
        pageTitle: "سياسة ملفات تعريف الارتباط",
        lastUpdated: "آخر تحديث: 1 مايو 2026",
        sections: [
          { title: "1. ما هي ملفات تعريف الارتباط؟", body: "هي ملفات نصية صغيرة يتم حفظها على جهازك لتحسين تجربتك وتقديم ميزات إضافية." },
          { title: "2. كيف نستخدم ملفات تعريف الارتباط؟", bullets: ["ملفات أساسية لعمل الموقع", "ملفات أداء وتحليل لتحسين التجربة", "ملفات تسويق عند توفرها"] },
          { title: "3. إدارة ملفات تعريف الارتباط", body: "يمكنك إدارة تفضيلاتك عبر إشعار الكوكيز أو إعدادات المتصفح." },
          { title: "4. الروابط الخارجية", body: "قد يحتوي الموقع على روابط خارجية لها سياسات منفصلة." }
        ],
        contactTitle: "5. تواصل معنا",
        contactBody: "لأي استفسار بخصوص الكوكيز تواصل معنا عبر البريد الإلكتروني."
      },
    },
  ];
  for (const page of cmsPages) {
    await prisma.cmsPage.upsert({
      where: { slug: page.slug },
      update: { content: page.content, active: true },
      create: { ...page, active: true },
    });
  }
  console.log(`✅ تم إنشاء ${cmsPages.length} صفحات CMS`);

  // ═══════════════════════════════════════════════
  // 14. سجل مراقبة (Audit Log) — بيانات أولية
  // ═══════════════════════════════════════════════
  await prisma.auditLog.createMany({
    data: [
      { employeeId: employees[0].id, action: "CREATE", entity: "Hotel", entityId: hotels[0].id, details: JSON.parse(JSON.stringify({ name: "هيلتون مكة" })) },
      { employeeId: employees[0].id, action: "CREATE", entity: "Destination", entityId: destinations[0].id, details: JSON.parse(JSON.stringify({ name: "إسطنبول" })) },
      { employeeId: employees[2].id, action: "CREATE", entity: "Booking", entityId: bookings[0].id, details: JSON.parse(JSON.stringify({ service: "FLIGHT", client: "عبدالله المطيري" })) },
    ],
  });
  console.log("✅ تم إنشاء 3 سجلات مراقبة");

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
