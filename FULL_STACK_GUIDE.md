# 📚 دليل المطور الشامل — مجموعة القاضي الذهبية (Full-Stack Developer Guide)

> **الإصدار:** 3.0 | **آخر تحديث:** مايو 2026  
> **المنصة:** Next.js 16 + Prisma + MySQL + Tailwind CSS v4  
> **النوع:** منصة ERP مؤسسية متكاملة للسفر والسياحة وخدمات الأيدي العاملة

---

## 1. نظرة عامة على المشروع (Project Overview)

منصة مجموعة القاضي الذهبية هي نظام ERP مؤسسي متكامل يجمع بين:
- **موقع عام فاخر** للسياحة والسفر (Public-Facing Website)
- **لوحة تحكم إدارية** شاملة (Admin Panel)
- **بوابة موظفين** بنظام صلاحيات (Employee Portal)
- **نظام CRM** لإدارة العملاء والحجوزات
- **نظام CMS** ديناميكي لإدارة محتوى الصفحات

---

## 2. التقنيات المستخدمة (Tech Stack)

| الطبقة | التقنية | الإصدار |
|--------|---------|---------|
| **Framework** | Next.js (App Router) | 16.2.4 |
| **UI Library** | React | 19.2.4 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | v4 |
| **Database** | MySQL (XAMPP) | 8.x |
| **ORM** | Prisma | 6.19.3 |
| **Auth** | NextAuth.js (JWT) | 4.24.14 |
| **3D Graphics** | Three.js + R3F | 0.184.0 |
| **Animation** | Framer Motion + GSAP | 12.x / 3.15 |
| **Icons** | Lucide React | 1.12.0 |
| **Charts** | Recharts | 3.8.1 |
| **Image Processing** | Sharp | 0.34.5 |
| **Password Hashing** | bcryptjs | 3.0.3 |

---

## 3. بنية الملفات (File Structure)

```
a:\Alqadi\web\
├── prisma/
│   └── schema.prisma          # 14 نموذج بيانات (Models)
├── public/
│   ├── assets/                # صور الخدمات والعلامة التجارية
│   ├── brand/                 # شعار الشركة
│   └── sw.js                  # Service Worker
├── src/
│   ├── app/                   # App Router Pages
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   ├── about/page.tsx     # من نحن
│   │   ├── admin/page.tsx     # لوحة الإدارة (1725 سطر)
│   │   ├── blog/page.tsx      # المدونة
│   │   ├── clients/page.tsx   # عملاؤنا
│   │   ├── contact/page.tsx   # اتصل بنا
│   │   ├── cookies/page.tsx   # سياسة ملفات تعريف الارتباط
│   │   ├── en/page.tsx        # النسخة الإنجليزية
│   │   ├── faq/page.tsx       # الأسئلة الشائعة
│   │   ├── privacy/page.tsx   # سياسة الخصوصية
│   │   ├── trust/page.tsx     # صفحة الثقة والأمان
│   │   ├── vip/page.tsx       # برنامج VIP
│   │   ├── not-found.tsx      # صفحة 404 مخصصة
│   │   ├── portal/            # بوابة الموظفين
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── leads/page.tsx
│   │   │   └── workspace/page.tsx
│   │   ├── services/          # صفحات الخدمات
│   │   │   ├── hotels/page.tsx
│   │   │   ├── travel/page.tsx
│   │   │   ├── visa/page.tsx
│   │   │   └── manpower/
│   │   │       ├── page.tsx
│   │   │       ├── data.ts
│   │   │       └── [jobId]/page.tsx
│   │   ├── api/               # API Routes
│   │   │   ├── content/route.ts       # GET محتوى الموقع (عام)
│   │   │   ├── hotels/route.ts        # CRUD فنادق
│   │   │   ├── jobs/route.ts          # CRUD وظائف
│   │   │   ├── visas/route.ts         # CRUD تأشيرات
│   │   │   ├── lead/route.ts          # POST عميل محتمل (عام)
│   │   │   ├── leads/route.ts         # GET/PUT عملاء (محمي)
│   │   │   └── admin/
│   │   │       ├── content/route.ts   # GET/POST إعدادات
│   │   │       ├── bookings/route.ts  # CRUD حجوزات
│   │   │       ├── crm/route.ts       # CRUD عملاء CRM
│   │   │       ├── tickets/route.ts   # CRUD تذاكر الدعم
│   │   │       ├── audit/route.ts     # GET/POST سجل المراقبة
│   │   │       ├── dynamic-schema/    # CRUD قواعد ديناميكية
│   │   │       └── api-config/        # CRUD ربط APIs خارجية
│   │   │           ├── route.ts
│   │   │           └── test/route.ts  # اختبار الاتصال
│   │   ├── globals.css        # نظام التصميم (Design System v3)
│   │   ├── layout.tsx         # التخطيط الرئيسي + SEO
│   │   ├── sitemap.ts         # خريطة الموقع الآلية
│   │   ├── robots.ts          # ملف Robots
│   │   ├── manifest.ts        # PWA Manifest
│   │   ├── feed.xml/route.ts  # RSS Feed
│   │   └── template.tsx       # قالب الصفحات مع Transitions
│   ├── components/
│   │   ├── site/              # مكونات الصفحة الرئيسية
│   │   │   ├── HomeExperience.tsx       # التجربة الرئيسية
│   │   │   ├── HeroSection.tsx         # قسم البطل
│   │   │   ├── InteractiveWorldMap.tsx  # خريطة عالمية تفاعلية
│   │   │   ├── PackageConfigurator.tsx  # مُكوّن الباقات
│   │   │   ├── PricingSection.tsx       # قسم التسعير
│   │   │   └── SectionShell.tsx        # قالب الأقسام
│   │   ├── chrome/            # Header, Footer, Toolbar
│   │   ├── forms/             # نماذج الحجز والتواصل
│   │   ├── ui/                # مكونات UI عامة
│   │   │   ├── GlassPanel.tsx          # لوحات زجاجية
│   │   │   ├── GoldParticleCanvas.tsx  # تأثيرات ذهبية
│   │   │   ├── GrainOverlay.tsx        # طبقة الحبيبات
│   │   │   ├── ThemeToggle.tsx         # تبديل الثيم
│   │   │   └── WhatsAppFloat.tsx       # زر واتساب عائم
│   │   ├── chat/              # Chatbot Stub
│   │   ├── seo/               # Schema.org Markup
│   │   ├── vip/               # VIP Dashboard
│   │   └── providers/         # Context Providers
│   ├── context/
│   │   ├── CurrencyContext.tsx      # تحويل العملات
│   │   └── SiteExperienceContext.tsx # إعدادات التجربة
│   ├── hooks/
│   │   ├── useCmsContent.ts   # جلب محتوى CMS
│   │   ├── useAdaptiveFps.ts  # تحسين أداء 3D
│   │   └── useScrollProgress.ts
│   └── lib/
│       ├── prisma.ts          # Prisma Client Singleton
│       ├── auth.ts            # NextAuth Configuration
│       ├── cms.ts             # Server-Side CMS Helper
│       ├── rate-limit.ts      # Rate Limiter (In-Memory)
│       ├── feature-flags.ts   # Feature Flags
│       └── utils.ts           # Utilities (cn helper)
├── .env                       # Database URL
├── DESIGN.md                  # توثيق نظام التصميم
├── AGENTS.md                  # توثيق الوكلاء
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

## 4. نماذج قاعدة البيانات (Database Models — 14 نموذج)

```
┌─────────────────────────────────────────────────────┐
│                    Prisma Schema                     │
├─────────────────────────────────────────────────────┤
│ Employee ──┐                                        │
│   ├─ Session        (JWT Sessions)                  │
│   ├─ Lead           (1:N — العملاء المحتملين)        │
│   ├─ Booking        (1:N — الحجوزات)                │
│   └─ AuditLog       (1:N — سجل العمليات)            │
│                                                     │
│ Client ──┐                                          │
│   ├─ Booking        (1:N — الحجوزات)                │
│   └─ SupportTicket  (1:N — تذاكر الدعم)             │
│                                                     │
│ Hotel ──── Room     (1:N — الغرف)                   │
│                                                     │
│ Visa                (مستقل)                         │
│ Job                 (مستقل)                         │
│ SiteSetting         (Key-Value Store للإعدادات)      │
│ DynamicSchema ── DynamicRecord (1:N — كيانات حرة)   │
└─────────────────────────────────────────────────────┘
```

### تفصيل النماذج:

| النموذج | الوصف | الحقول الرئيسية |
|---------|-------|----------------|
| **Employee** | الموظفون | name, username, password(bcrypt), role, branch, active |
| **Session** | جلسات المصادقة | sessionToken, employeeId, expires |
| **Hotel** | الفنادق | name, city, country, stars, priceFrom, images, imageUrl, rooms[] |
| **Room** | غرف الفنادق | hotelId, type, price, capacity, available, amenities |
| **Visa** | التأشيرات | country, type, price, processingDays, requirements, documents |
| **Lead** | العملاء المحتملين | name, email, phone, service, status, assignedTo |
| **Job** | الأيدي العاملة | title, category, country, salary, experience, imageUrl |
| **SiteSetting** | إعدادات الموقع | key(unique), value(JSON) |
| **Client** | عملاء CRM | name, email, phone, passportNo, loyaltyPts |
| **Booking** | الحجوزات | clientId, serviceType, status, totalAmount, paidAmount |
| **SupportTicket** | تذاكر الدعم | clientId, subject, status, priority |
| **DynamicSchema** | كيانات ديناميكية | name, labelAr, fields(JSON) |
| **DynamicRecord** | سجلات ديناميكية | schemaId, data(JSON) |
| **AuditLog** | سجل المراقبة | employeeId, action, entity, entityId, details |

---

## 5. الـ API Routes (خريطة كاملة)

### أ) APIs عامة (Public — بدون مصادقة):

| Method | المسار | الوصف | Rate Limit |
|--------|--------|-------|------------|
| `GET` | `/api/content` | جلب كل محتوى الموقع + CMS | ❌ |
| `GET` | `/api/hotels` | الفنادق النشطة + الغرف | 30/min |
| `GET` | `/api/jobs` | الوظائف النشطة | ❌ |
| `GET` | `/api/visas` | التأشيرات النشطة | 30/min |
| `POST` | `/api/lead` | إرسال طلب عميل محتمل | 5/hr |

### ب) APIs محمية (Portal — تتطلب NextAuth Session):

| Method | المسار | الوصف | الصلاحية |
|--------|--------|-------|---------|
| `GET` | `/api/leads` | عرض كل العملاء المحتملين | أي موظف |
| `PUT` | `/api/leads` | تحديث حالة العميل | أي موظف |
| `POST/PUT/DELETE` | `/api/jobs` | إدارة الوظائف | admin فقط |

### ج) APIs إدارية (Admin — بدون حماية خادمية!):

| Method | المسار | الوصف |
|--------|--------|-------|
| `GET/POST` | `/api/admin/content` | إعدادات الموقع + الموظفين |
| `GET/POST/PUT` | `/api/admin/bookings` | الحجوزات |
| `GET/POST/DELETE` | `/api/admin/crm` | العملاء CRM |
| `GET/POST/PUT` | `/api/admin/tickets` | تذاكر الدعم |
| `GET/POST` | `/api/admin/audit` | سجل المراقبة |
| `GET/POST/DELETE` | `/api/admin/dynamic-schema` | قواعد ديناميكية |
| `GET/POST/PUT/DELETE` | `/api/admin/api-config` | ربط APIs خارجية |
| `POST` | `/api/admin/api-config/test` | اختبار اتصال API |

---

## 6. نظام المصادقة (Authentication)

### أ) بوابة الموظفين (Employee Portal):
- **التقنية:** NextAuth.js مع JWT Strategy
- **مدة الجلسة:** 8 ساعات
- **التخزين:** JWT في Cookie
- **الأدوار:** `admin` | `supervisor` | `agent`
- **كلمات المرور:** bcrypt (12 rounds)

### ب) لوحة الإدارة (Admin Panel):
- **التقنية:** Client-Side password check
- **كلمة المرور:** تُقرأ من `process.env.NEXT_PUBLIC_ADMIN_PASSWORD`
- **التخزين:** `localStorage` (key: `alqadi_admin_auth`)
- **لا يوجد:** JWT، ولا session server-side، ولا middleware

---

## 7. نظام CMS (Content Management System)

### مفاتيح CMS في جدول SiteSetting:

| المفتاح | الصفحة | البيانات |
|---------|--------|---------|
| `cms_about` | `/about` | المراحل، القيم، الرؤية، المهمة |
| `cms_contact` | `/contact` | بيانات الفروع |
| `cms_blog` | `/blog` | المقالات |
| `cms_faq` | `/faq` | الأسئلة والأجوبة |
| `cms_clients` | `/clients` | العملاء، الشهادات، الإحصائيات |
| `cms_vip` | `/vip` | محتوى VIP |
| `cms_home` | الرئيسية | الخدمات، الأخبار |
| `cms_travel` | `/services/travel` | لماذا نحن |

### آلية التدفق:
```
Admin Panel → POST /api/admin/content → SiteSetting (DB)
                                              ↓
Public Pages ← GET /api/content ←───── SiteSetting (DB)
    ├── Server Components: getCmsData() من lib/cms.ts
    └── Client Components: fetch('/api/content') في useEffect
```

---

## 8. الواجهات والصفحات (UI Pages)

### الصفحات العامة (15 صفحة):
| الصفحة | المسار | النوع | الوصف |
|--------|--------|-------|-------|
| الرئيسية | `/` | Client | Hero + خريطة + وجهات + باقات |
| من نحن | `/about` | Server | تاريخ الشركة + القيم + الإحصائيات |
| المدونة | `/blog` | Server | المقالات |
| الأسئلة الشائعة | `/faq` | Server | أسئلة بالفئات + JSON-LD |
| اتصل بنا | `/contact` | Client | نموذج تواصل + خريطة فروع |
| عملاؤنا | `/clients` | Client | شهادات + إحصائيات + شركاء |
| VIP | `/vip` | Server | برنامج الولاء |
| الفنادق | `/services/hotels` | Client | بطاقات فنادق + تصفية |
| السفريات | `/services/travel` | Client | حجز طيران + مقاعد |
| التأشيرات | `/services/visa` | Client | تأشيرات حسب الدولة |
| الأيدي العاملة | `/services/manpower` | Client | وظائف بالتصنيف |
| تفاصيل وظيفة | `/services/manpower/[jobId]` | Dynamic | صفحة وظيفة مفردة |
| سياسة الخصوصية | `/privacy` | Static | قانونية |
| ملفات الارتباط | `/cookies` | Static | قانونية |
| الثقة والأمان | `/trust` | Static | شهادات أمان |

### بوابة الموظفين (4 صفحات):
| الصفحة | المسار | الوصف |
|--------|--------|-------|
| تسجيل الدخول | `/portal/login` | NextAuth Credentials |
| لوحة القيادة | `/portal/dashboard` | إحصائيات + مهام |
| العملاء المحتملين | `/portal/leads` | إدارة Leads |
| مساحة العمل | `/portal/workspace` | أدوات العمل |

### لوحة الإدارة (17 قسم في صفحة واحدة):
| القسم | الوظيفة |
|-------|---------|
| بيانات الشركة | تعديل الاسم والهاتف والعنوان |
| الإحصائيات | تعديل أرقام العملاء والخبرة |
| إدارة الحجوزات | عرض وتعديل حالات الحجوزات |
| إدارة العملاء CRM | CRUD عملاء + نقاط ولاء |
| تذاكر الدعم الفني | عرض وإغلاق التذاكر |
| الوجهات السياحية | تعديل الأسعار والحالة |
| الباقات والعروض | تعديل الليالي والخصومات |
| إدارة الفنادق | CRUD + صور + غرف |
| إدارة التأشيرات | CRUD + متطلبات |
| الأيدي العاملة | CRUD وظائف + صور |
| التسعير التلقائي | أسعار التذاكر والتأشيرات |
| إدارة الموظفين | CRUD + كلمات مرور |
| إدارة الفروع | إضافة/حذف فروع |
| قواعد بيانات ديناميكية | إنشاء كيانات مخصصة |
| إدارة المحتوى CMS | تحرير JSON لكل صفحة |
| سجل المراقبة | عرض Audit Logs |
| ربط APIs | إضافة/اختبار APIs خارجية |

---

## 9. SEO والأداء (SEO & Performance)

### SEO المُطبّق:
- ✅ `sitemap.ts` — خريطة موقع ديناميكية
- ✅ `robots.ts` — قواعد الزحف
- ✅ `feed.xml` — RSS Feed
- ✅ `manifest.ts` — PWA Support
- ✅ `opengraph-image.tsx` — صور OG ديناميكية
- ✅ `SchemaMarkup.tsx` — JSON-LD Structured Data
- ✅ `apple-icon.tsx` — أيقونة Apple

### Security Headers (في next.config.ts):
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` (production فقط)

---

## 10. الأوامر الأساسية (Developer Commands)

```bash
# تثبيت المشروع
npm install

# تشغيل التطوير
npm run dev              # يعمل على 0.0.0.0:3000

# بناء الإنتاج
npm run build

# قاعدة البيانات
npx prisma db push       # مزامنة Schema مع DB
npx prisma generate      # توليد Prisma Client
npx prisma studio        # واجهة مرئية للبيانات

# التحليل
npm run analyze           # Bundle Size Analysis

# البناء والتشغيل
npm run start             # تشغيل الإنتاج
```

---

## 11. متغيرات البيئة (Environment Variables)

```env
# مطلوب
DATABASE_URL="mysql://root:@localhost:3306/alqadi_db"

# مُوصى به (غير موجود حالياً!)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
CRM_WEBHOOK_URL="https://your-crm.com/webhook"
```

---

> **ملاحظة:** هذا الدليل يُحدّث مع كل تغيير جوهري في المشروع. راجع `DESIGN.md` لتفاصيل نظام التصميم البصري.
