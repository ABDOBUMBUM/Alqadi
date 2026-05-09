# 🔴 تقرير التدقيق الأمني العميق — مجموعة القاضي الذهبية
# Deep Security Audit Report — Al-Qadi Golden Group Platform

> **مستوى الخطورة:** 🔴 حرج  
> **تاريخ التدقيق:** مايو 2026  
> **المُدقق:** Antigravity Security Engine  
> **النطاق:** Full-Stack (Frontend + Backend + Database + Infrastructure)

---

## ⚡ ملخص تنفيذي (Executive Summary)

```
┌────────────────────────────────────────────────┐
│           نتائج التدقيق الأمني                  │
├────────────────────────────────────────────────┤
│ ثغرات حرجة (Critical):        6               │
│ ثغرات عالية الخطورة (High):    8               │
│ ثغرات متوسطة (Medium):        7               │
│ ثغرات منخفضة (Low):           5               │
│ ─────────────────────────────────              │
│ المجموع:                      26 ثغرة          │
│ التقييم الأمني:                35/100 🔴        │
└────────────────────────────────────────────────┘
```

---

## 🔴 الثغرات الحرجة (CRITICAL — P0)

### VULN-001: 🔓 لوحة الإدارة بدون حماية خادمية (Broken Access Control)
**OWASP: A01:2021 — Broken Access Control**
**CVSS: 9.8/10**

**الوصف:**  
لوحة الإدارة (`/admin`) تعتمد على مقارنة كلمة مرور مُخزنة في الكود المصدري على جانب العميل (Client-Side). لا يوجد أي فحص أمني على الخادم.

**الدليل:**
```typescript
// src/app/admin/page.tsx — السطر 13
const ADMIN_PASSWORD = "[REDACTED]"; // مكشوفة في الكود!

// التحقق يتم فقط في المتصفح:
if (pw === ADMIN_PASSWORD) {
  localStorage.setItem(STORAGE_KEY, "true");
  setAuthed(true);
}
```

**الخطر:**
- أي شخص يفحص الكود المصدري (View Source أو DevTools) يرى كلمة المرور مباشرة
- يمكن تجاوز المصادقة بالكامل عبر تنفيذ: `localStorage.setItem("alqadi_admin_auth", "true")` في Console
- كلمة المرور مكشوفة في مستودع GitHub

**الإصلاح:**
```typescript
// 1. نقل المصادقة إلى الخادم عبر NextAuth أو API Route
// 2. استخدام bcrypt للمقارنة
// 3. إضافة JWT token للجلسة
// 4. تخزين كلمة المرور في .env مُشفرة
```

---

### VULN-002: 🚪 جميع APIs الإدارية مفتوحة بالكامل (Zero Authentication on Admin APIs)
**OWASP: A01:2021 — Broken Access Control**
**CVSS: 9.8/10**

**الوصف:**  
جميع الـ API Routes تحت مسار `/api/admin/*` لا تحتوي على أي فحص مصادقة (Authentication) أو تخويل (Authorization). يمكن لأي شخص على الإنترنت:

**الملفات المتأثرة:**
| الملف | العمليات المكشوفة |
|-------|------------------|
| `/api/admin/content` | قراءة/تعديل كل إعدادات الموقع + بيانات الموظفين |
| `/api/admin/bookings` | قراءة/إنشاء/تعديل جميع الحجوزات |
| `/api/admin/crm` | قراءة/حذف جميع بيانات العملاء |
| `/api/admin/tickets` | قراءة/تعديل تذاكر الدعم |
| `/api/admin/audit` | قراءة سجل المراقبة + إنشاء سجلات مزيفة |
| `/api/admin/dynamic-schema` | إنشاء/حذف جداول في قاعدة البيانات |
| `/api/admin/api-config` | قراءة/تعديل مفاتيح APIs الخارجية |
| `/api/admin/api-config/test` | إجراء طلبات HTTP من الخادم (SSRF!) |

**هجوم مثال (cURL):**
```bash
# قراءة جميع بيانات العملاء بدون أي مصادقة!
curl https://your-domain.com/api/admin/crm

# حذف عميل بدون أي مصادقة!
curl -X DELETE "https://your-domain.com/api/admin/crm?id=TARGET_ID"

# تعديل إعدادات الموقع بالكامل!
curl -X POST https://your-domain.com/api/admin/content \
  -H "Content-Type: application/json" \
  -d '{"company":{"nameAr":"تم الاختراق"}}'
```

**الإصلاح:**
```typescript
// إضافة middleware.ts في مجلد src/
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function middleware(request: Request) {
  if (request.url.includes("/api/admin")) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
}
```

---

### VULN-003: 🗝️ كلمات مرور افتراضية مكشوفة في الكود (Hardcoded Credentials)
**OWASP: A07:2021 — Identification and Authentication Failures**
**CVSS: 9.1/10**

**الوصف:**  
كلمات مرور افتراضية مُخزنة في الكود المصدري ومرئية في GitHub:

**المواقع:**
```typescript
// admin/page.tsx:13
const ADMIN_PASSWORD = "[REDACTED]";

// admin/page.tsx:139
const DEFAULT_EMPLOYEE_PASSWORD = "[REDACTED]";

// admin/page.tsx:53-55 — كلمات مرور الموظفين بالنص الصريح
{ password: "[REDACTED]", ... }

// api/admin/content/route.ts:108
if (emp.password !== "[REDACTED]" && emp.password.length >= 6) {

// api/admin/content/route.ts:122 — كلمة مرور افتراضية للموظفين الجدد
password: await hash(emp.password || "[REDACTED]", 12),
```

**الخطر:**
- كلمات المرور مكشوفة في المستودع العام على GitHub
- أي شخص يمكنه الدخول كمدير أو موظف
- حتى لو تم تغيير كلمات المرور لاحقاً، تبقى الأصلية في تاريخ Git

---

### VULN-004: 🌐 SSRF عبر API Test Endpoint (Server-Side Request Forgery)
**OWASP: A10:2021 — Server-Side Request Forgery**
**CVSS: 8.6/10**

**الوصف:**  
يسمح endpoint `/api/admin/api-config/test` بإجراء طلبات HTTP من الخادم إلى أي عنوان يحدده المستخدم. بما أنه بدون مصادقة، يمكن استغلاله لـ:

**الملف:** `src/app/api/admin/api-config/test/route.ts`

```typescript
// السطر 29 — يُرسل طلب HTTP إلى أي endpoint مُخزن
const res = await fetch(api.endpoint, { method: "GET", headers, signal: controller.signal });
```

**سيناريو الهجوم:**
1. المهاجم يُضيف API جديدة عبر POST (بدون مصادقة)
2. يضع `endpoint: "http://169.254.169.254/latest/meta-data/"` (AWS Metadata)
3. يطلب اختبار الاتصال → الخادم يقرأ بيانات AWS الداخلية
4. يمكن الوصول إلى: مفاتيح AWS، بيانات الشبكة الداخلية، خدمات محلية

**الإصلاح:**
```typescript
// التحقق من أن الـ URL خارجي وليس داخلياً
const url = new URL(api.endpoint);
const blocked = ["localhost", "127.0.0.1", "169.254.169.254", "10.", "172.16.", "192.168."];
if (blocked.some(b => url.hostname.startsWith(b))) {
  return NextResponse.json({ ok: false, message: "عنوان محظور" });
}
```

---

### VULN-005: 💉 Mass Assignment — تحديث أي حقل بدون قيود
**OWASP: A04:2021 — Insecure Design**
**CVSS: 8.5/10**

**الوصف:**  
عدة API Routes تمرر بيانات المستخدم مباشرة إلى Prisma بدون تصفية الحقول المسموحة:

**الأمثلة:**
```typescript
// api/admin/bookings/route.ts:19
const booking = await prisma.booking.create({ data }); // كل شيء!

// api/admin/crm/route.ts:16
const client = await prisma.client.create({ data }); // كل شيء!

// api/admin/tickets/route.ts:22
const ticket = await prisma.supportTicket.create({ data }); // كل شيء!

// api/hotels/route.ts:77-87
const { id, ...updateData } = data;
const hotel = await prisma.hotel.update({ where: { id }, data: updateData }); // كل شيء!
```

**الخطر:**  
المهاجم يمكنه إضافة/تعديل حقول غير مصرح بها مثل:
```json
// تعديل نقاط ولاء عميل
POST /api/admin/crm
{ "name": "Hacker", "loyaltyPts": 999999 }

// تعديل مبلغ حجز
PUT /api/admin/bookings
{ "id": "xxx", "paidAmount": 0, "totalAmount": 0 }
```

---

### VULN-006: 🔑 NEXTAUTH_SECRET غير مُعرّف (Missing JWT Secret)
**OWASP: A02:2021 — Cryptographic Failures**
**CVSS: 8.2/10**

**الوصف:**  
ملف `.env` لا يحتوي على `NEXTAUTH_SECRET`. يعتمد NextAuth على قيمة افتراضية ضعيفة.

**الملف:** `.env` (سطران فقط!)
```env
# الموجود حالياً:
DATABASE_URL="mysql://root:@localhost:3306/alqadi_db"

# المفقود:
# NEXTAUTH_SECRET=    ← غير موجود!
# NEXTAUTH_URL=       ← غير موجود!
```

**الخطر:**
- يمكن تزوير JWT tokens
- يمكن انتحال هوية أي موظف
- الجلسات غير آمنة cryptographically

---

## 🟠 الثغرات عالية الخطورة (HIGH — P1)

### VULN-007: قاعدة بيانات MySQL بدون كلمة مرور
**CVSS: 7.5/10**

```env
DATABASE_URL="mysql://root:@localhost:3306/alqadi_db"
#                        ↑ لا كلمة مرور!
```
- المستخدم `root` بدون كلمة مرور
- أي شخص على الشبكة المحلية يمكنه الوصول للبيانات

---

### VULN-008: تسرب بيانات الموظفين عبر API عامة
**CVSS: 7.3/10**

**الملف:** `api/admin/content/route.ts` — GET (بدون مصادقة)

```typescript
// السطر 15-25 — يُرجع بيانات كل الموظفين!
const employees = await prisma.employee.findMany({
  select: {
    id: true, name: true, username: true, // ← مكشوف!
    phone: true, role: true, branch: true, active: true,
  },
});
```

- أسماء المستخدمين مكشوفة → يمكن استخدامها في هجمات Brute Force
- أرقام الهواتف مكشوفة → انتهاك خصوصية

---

### VULN-009: عدم وجود Content Security Policy (CSP)
**CVSS: 7.0/10**

ملف `next.config.ts` لا يحتوي على CSP header، مما يجعل الموقع عرضة لـ:
- XSS Attacks عبر حقن سكريبتات خارجية
- Data Exfiltration عبر inline scripts
- Clickjacking (رغم وجود X-Frame-Options)

---

### VULN-010: Rate Limiting غير مطبق بشكل شامل
**CVSS: 6.8/10**

| API | Rate Limit | الحالة |
|-----|-----------|--------|
| `/api/hotels` GET | 30/min | ✅ |
| `/api/visas` GET | 30/min | ✅ |
| `/api/lead` POST | 5/hr | ✅ |
| `/api/admin/*` | ❌ لا يوجد | 🔴 |
| `/api/content` | ❌ لا يوجد | 🔴 |
| `/api/jobs` | ❌ لا يوجد | 🔴 |
| `/api/leads` | ❌ لا يوجد | 🔴 |
| Admin Login | ❌ لا يوجد | 🔴 |

- يمكن تنفيذ هجوم Brute Force على كلمة مرور Admin
- يمكن تنفيذ هجوم DDoS على APIs غير المحمية

---

### VULN-011: In-Memory Rate Limiter غير مناسب للإنتاج
**CVSS: 6.5/10**

```typescript
// lib/rate-limit.ts:12
const store = new Map<string, RateLimitEntry>();
```

- يتم مسحه عند إعادة تشغيل الخادم
- لا يعمل مع أكثر من instance (Serverless/Vercel)
- يمكن تجاوزه عبر إعادة تشغيل الخادم

---

### VULN-012: Prisma Client Leak — إنشاء instances متعددة
**CVSS: 6.2/10**

```typescript
// api/jobs/route.ts:6
const prisma = new PrismaClient(); // ← Instance جديدة!

// api/leads/route.ts:6
const prisma = new PrismaClient(); // ← Instance أخرى!

// بينما lib/prisma.ts يوفر Singleton
```

- يؤدي إلى استنزاف اتصالات قاعدة البيانات
- قد يسبب `Connection pool exhausted` في الإنتاج

---

### VULN-013: X-Forwarded-For Header Spoofing
**CVSS: 6.0/10**

```typescript
// lib/rate-limit.ts:58
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim(); // ← قابل للتزوير!
}
```

يمكن تجاوز Rate Limiting بإضافة header مزيف:
```bash
curl -H "X-Forwarded-For: 1.2.3.4" https://domain.com/api/hotels
```

---

### VULN-014: عدم تطهير مدخلات JSON في CMS Editor
**CVSS: 6.0/10**

محرر CMS يقبل أي JSON بدون validation:
```typescript
// admin/page.tsx — saveCmsPage()
const parsed = JSON.parse(cmsEditData);
await fetch("/api/admin/content", {
  body: JSON.stringify({ [cmsEditKey]: parsed }), // ← أي شيء!
});
```

يمكن حقن:
- `<script>` tags في القيم (Stored XSS)
- بيانات ضخمة لاستنزاف قاعدة البيانات

---

## 🟡 الثغرات المتوسطة (MEDIUM — P2)

### VULN-015: ملف .env مُضاف في Git
**CVSS: 5.5/10**

ملف `.gitignore` لا يحتوي على `.env` في قائمة الاستثناء بشكل صحيح. وقد تم commit الملف:
```
warning: in the working copy of '.env', LF will be replaced by CRLF
```

---

### VULN-016: عدم وجود Input Validation (No Schema Validation)
**CVSS: 5.3/10**

لا يوجد استخدام لـ Zod أو Yup أو أي مكتبة تحقق في أي API Route. جميع البيانات الواردة يتم تمريرها مباشرة.

---

### VULN-017: كلمات مرور الموظفين قابلة للتعديل بدون تحقق القوة
**CVSS: 5.0/10**

```typescript
// api/admin/content/route.ts:108
if (emp.password && emp.password !== "[REDACTED]" && emp.password.length >= 6) {
```

- الحد الأدنى 6 أحرف فقط — ضعيف جداً
- لا يوجد تحقق من تعقيد كلمة المرور
- لا يوجد حماية من كلمات المرور الشائعة

---

### VULN-018: عدم وجود CORS Policy محددة
**CVSS: 4.8/10**

لا يوجد تكوين CORS مخصص. Next.js يسمح بالطلبات من نفس الأصل افتراضياً، لكن في بعض الحالات قد تتسرب البيانات.

---

### VULN-019: Audit Log يمكن التلاعب به
**CVSS: 4.5/10**

```typescript
// api/admin/audit/route.ts:18-25
export async function POST(req: Request) {
  const data = await req.json();
  const log = await prisma.auditLog.create({ data }); // ← بدون مصادقة!
}
```

يمكن لأي شخص إنشاء سجلات مراقبة مزيفة لإخفاء آثار هجوم حقيقي.

---

### VULN-020: معلومات تقنية مكشوفة في رسائل الخطأ
**CVSS: 4.2/10**

```typescript
console.error("Hotels API error:", error); // ← تفاصيل في الخادم
console.error("Admin Content POST Error:", error);
```

في بيئة التطوير، قد تتسرب stack traces إلى العميل.

---

### VULN-021: عدم تشفير بيانات API المخزنة
**CVSS: 4.0/10**

مفاتيح APIs الخارجية (`apiKey`, `secret`) مُخزنة كنص صريح في جدول `SiteSetting`:
```typescript
// api-config/route.ts:35
const newApi = { ..., apiKey, secret, ... };
// يُخزن في DB كـ JSON بدون تشفير
```

---

## 🟢 الثغرات المنخفضة (LOW — P3)

### VULN-022: عدم وجود Session Rotation
- جلسات الموظفين لا تتجدد بعد تغيير كلمة المرور

### VULN-023: عدم وجود Account Lockout
- لا يوجد قفل للحساب بعد محاولات فاشلة متعددة

### VULN-024: Service Worker بدون تحديث آمن
- `sw.js` في `/public` قد يُخزّن نسخ قديمة من الموقع

### VULN-025: عدم وجود Subresource Integrity (SRI)
- الملفات الخارجية تُحمّل بدون تحقق من سلامتها

### VULN-026: تبعيات Puppeteer في الإنتاج
- `puppeteer` و `puppeteer-extra` في dependencies (وليس devDependencies)
- يزيد حجم الحزمة ويمثل خطراً أمنياً إذا استُغل

---

## 📋 خطة الإصلاح المُرتبة بالأولوية

### 🔴 فوري (خلال 48 ساعة):
1. **VULN-001/002:** إضافة NextAuth middleware لحماية `/api/admin/*`
2. **VULN-003:** نقل كلمات المرور إلى `.env` وحذفها من الكود
3. **VULN-006:** إضافة `NEXTAUTH_SECRET` قوي (32+ حرف)
4. **VULN-015:** إضافة `.env` إلى `.gitignore` + حذفها من تاريخ Git

### 🟠 خلال أسبوع:
5. **VULN-004:** إضافة SSRF Protection للـ API Test
6. **VULN-005:** إضافة Zod schemas لتصفية المدخلات
7. **VULN-007:** تعيين كلمة مرور لـ MySQL root
8. **VULN-008:** إزالة بيانات الموظفين من API العامة

### 🟡 خلال أسبوعين:
9. **VULN-009:** إضافة Content Security Policy
10. **VULN-010/011:** الانتقال إلى Redis-based Rate Limiting
11. **VULN-012:** توحيد Prisma Client عبر `lib/prisma.ts`
12. **VULN-013:** التحقق من IP عبر Trusted Proxies
13. **VULN-014:** إضافة HTML Sanitization للـ CMS

### 🟢 خلال شهر:
14. باقي الثغرات (P2/P3)
15. اختبارات أمنية آلية (SAST)
16. Penetration Testing خارجي

---

> ⚠️ **تحذير:** هذا التقرير يحتوي على معلومات حساسة. يجب عدم مشاركته علنياً والتعامل معه كوثيقة سرية.
