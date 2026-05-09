import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "سياسة ملفات الارتباط | مجموعة القاضي الذهبية",
  description: "سياسة استخدام ملفات الارتباط (Cookies) في موقع مجموعة القاضي الذهبية.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gold-500/70">
          <Link href="/" className="transition-colors hover:text-gold-400">الرئيسية</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gold-400">ملفات تعريف الارتباط</span>
        </nav>

        <div className="rounded-3xl border border-gold-500/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md md:p-12">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-gold-400">سياسة ملفات تعريف الارتباط</h1>
          <p className="mb-10 text-sm text-gold-500/60">آخر تحديث: 1 مايو 2026</p>

          <div className="prose prose-invert prose-gold max-w-none space-y-8 leading-loose">
            <section>
              <h2 className="text-xl font-bold text-white">1. ما هي ملفات تعريف الارتباط؟</h2>
              <p className="text-white/70">
                ملفات تعريف الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهازك (الكمبيوتر أو الهاتف المحمول) 
                عندما تقوم بزيارة موقعنا. تساعدنا هذه الملفات على تحسين تجربتك وتوفير ميزات إضافية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">2. كيف نستخدم ملفات تعريف الارتباط؟</h2>
              <p className="text-white/70">
                نستخدم ملفات تعريف الارتباط للأغراض التالية:
              </p>
              <ul className="mt-4 list-disc space-y-2 pr-6 text-white/70">
                <li>
                  <strong>ملفات أساسية جداً:</strong> ضرورية لعمل الموقع، مثل حفظ حالة تسجيل الدخول وتفضيلات اللغة والمظهر. لا يمكن تعطيل هذه الملفات.
                </li>
                <li>
                  <strong>ملفات الأداء والتحليل:</strong> تساعدنا على فهم كيفية استخدام الزوار لموقعنا، مما يمكننا من تحسين أداء الموقع وتجربة المستخدم. (مثل Google Analytics).
                </li>
                <li>
                  <strong>ملفات التسويق (إن وجدت):</strong> تُستخدم لتتبع الزوار عبر مواقع الويب لتقديم إعلانات ملائمة وذات صلة باهتماماتهم.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">3. إدارة ملفات تعريف الارتباط</h2>
              <p className="text-white/70">
                عند زيارتك لموقعنا لأول مرة، يظهر لك إشعار لطلب موافقتك على استخدام ملفات تعريف الارتباط غير الأساسية. 
                يمكنك أيضاً تغيير إعدادات المتصفح الخاص بك لرفض جميع ملفات تعريف الارتباط أو الإشعار عند إرسال أي منها. 
                يرجى ملاحظة أن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف معينة في الموقع.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">4. الروابط الخارجية</h2>
              <p className="text-white/70">
                قد يحتوي موقعنا على روابط لمواقع خارجية (مثل وسائل التواصل الاجتماعي أو شركاء الدفع). 
                هذه المواقع لها سياسات ملفات تعريف ارتباط خاصة بها والتي لا نتحكم بها. 
                يرجى الرجوع إلى سياساتهم لمزيد من المعلومات.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white">5. تواصل معنا</h2>
              <p className="text-white/70">
                لأي استفسارات بخصوص استخدامنا لملفات تعريف الارتباط، تواصل معنا عبر:
                <br />
                البريد الإلكتروني: {process.env.NEXT_PUBLIC_EMAIL || "info@alqadigroup.com"}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
