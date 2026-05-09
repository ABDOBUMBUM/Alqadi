import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | مجموعة القاضي الذهبية",
  description: "سياسة الخصوصية وحماية البيانات في مجموعة القاضي الذهبية للسفريات والسياحة.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gold-500/70">
          <Link href="/" className="transition-colors hover:text-gold-400">الرئيسية</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gold-400">سياسة الخصوصية</span>
        </nav>

        <div className="rounded-3xl border border-gold-500/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gold-400">سياسة الخصوصية</h1>
          <p className="mb-10 text-sm text-gold-500/60">آخر تحديث: 1 مايو 2026</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 leading-loose">
            <section>
              <h2 className="text-xl font-bold text-white">1. مقدمة</h2>
              <p className="text-white/70">
                نحن في مجموعة القاضي الذهبية للسفريات والسياحة نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. 
                تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند زيارتك لموقعنا الإلكتروني أو استخدامك لخدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">2. البيانات التي نجمعها</h2>
              <p className="text-white/70">
                قد نقوم بجمع ومعالجة البيانات التالية:
              </p>
              <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                <li>المعلومات الشخصية (مثل الاسم، البريد الإلكتروني، رقم الهاتف) التي تقدمها عند ملء النماذج.</li>
                <li>بيانات جواز السفر والهوية (عند طلب خدمات التأشيرات وحجوزات السفر).</li>
                <li>معلومات حول كيفية استخدامك لموقعنا (من خلال ملفات تعريف الارتباط).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">3. كيف نستخدم بياناتك</h2>
              <p className="text-white/70">
                نستخدم معلوماتك الشخصية للأغراض التالية:
              </p>
              <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                <li>إتمام حجوزات السفر والفنادق ومعاملات التأشيرات.</li>
                <li>التواصل معك للرد على استفساراتك أو تقديم الدعم الفني.</li>
                <li>تحسين موقعنا وتجربة المستخدم.</li>
                <li>إرسال العروض الترويجية والتحديثات (فقط في حال موافقتك الصريحة).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">4. مشاركة البيانات</h2>
              <p className="text-white/70">
                نحن لا نبيع بياناتك الشخصية. قد نشارك معلوماتك الضرورية فقط مع أطراف ثالثة موثوقة مثل:
              </p>
              <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                <li>شركات الطيران، الفنادق، والسفارات (لإتمام خدماتك المطلوبة).</li>
                <li>مزودي خدمات الدفع الآمن.</li>
                <li>الجهات الحكومية (إذا تطلب القانون ذلك).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">5. أمن البيانات</h2>
              <p className="text-white/70">
                نحن نتخذ إجراءات أمنية وتشفير متقدم لحماية بياناتك الشخصية من الوصول غير المصرح به، التغيير، أو الإفشاء. يتم تخزين جميع البيانات في خوادم آمنة تتوافق مع المعايير الدولية للحماية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">6. حقوقك</h2>
              <p className="text-white/70">
                لديك الحق في:
              </p>
              <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                <li>الوصول إلى بياناتك الشخصية التي نحتفظ بها.</li>
                <li>طلب تصحيح أو تحديث بياناتك.</li>
                <li>طلب حذف بياناتك (ما لم يكن هناك التزام قانوني بالاحتفاظ بها).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">7. تواصل معنا</h2>
              <p className="text-white/70">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية أو كيفية تعاملنا مع بياناتك، يرجى التواصل معنا عبر:
                <br />
                البريد الإلكتروني: {process.env.NEXT_PUBLIC_EMAIL || "info@alqadigroup.com"}
                <br />
                رقم الهاتف: {process.env.NEXT_PUBLIC_PHONE_NUMBER || "+965 9876 5432"}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
