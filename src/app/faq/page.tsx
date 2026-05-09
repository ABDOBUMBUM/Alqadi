import type { Metadata } from "next";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | مجموعة القاضي الذهبية",
  description: "إجابات على أكثر الأسئلة شيوعاً حول خدمات السفر والتأشيرات والفنادق لدى مجموعة القاضي الذهبية.",
};

const faqs = [
  {
    category: "الحجز والسفر",
    questions: [
      {
        q: "كيف أحجز تذكرة طيران أو رحلة سياحية؟",
        a: "يمكنك التواصل معنا مباشرة عبر الواتساب أو الاتصال بنا، وسيقوم فريقنا بمتابعة طلبك فوراً وتقديم أفضل الخيارات المناسبة لك.",
      },
      {
        q: "هل تقدمون خدمات حجز الفنادق؟",
        a: "نعم، نقدم حجوزات فندقية محلية ودولية في أفضل الفنادق حول العالم بأسعار تنافسية مع ضمان أفضل سعر.",
      },
      {
        q: "ما هي طرق الدفع المتاحة؟",
        a: "نقبل الدفع نقداً، بطاقة ائتمان، أو تحويل بنكي. للشركات، نوفر خيارات دفع آجل وفق الاتفاقية.",
      },
      {
        q: "هل يمكنني إلغاء أو تعديل الحجز؟",
        a: "تعتمد سياسة الإلغاء على نوع الخدمة والمزود. فريقنا يساعدك في معرفة الشروط المحددة لحجزك وإجراء التعديلات اللازمة.",
      },
    ],
  },
  {
    category: "التأشيرات",
    questions: [
      {
        q: "ما هي الدول التي تساعدون في استخراج تأشيراتها؟",
        a: "نغطي أكثر من 30 دولة بما فيها الأردن، مصر، تركيا، الإمارات، ماليزيا، المملكة المتحدة، وأوروبا الشنغن وغيرها. تواصل معنا للاستفسار عن دولتك.",
      },
      {
        q: "كم يستغرق الحصول على تأشيرة الأردن؟",
        a: "تأشيرة الأردن متاحة بثلاثة أنواع: طارئة (24 ساعة)، مستعجلة (4-5 أيام عمل)، وعادية (7-9 أيام عمل).",
      },
      {
        q: "ما هي المستندات المطلوبة للتأشيرة؟",
        a: "تختلف المستندات حسب الدولة، لكن بشكل عام: جواز سفر ساري، صور شخصية، إثبات الإقامة، إثبات الدخل، حجز الفندق. فريقنا يرشدك للقائمة الكاملة.",
      },
      {
        q: "هل تتكفلون بكامل إجراءات التأشيرة؟",
        a: "نعم، نتولى جمع وتجهيز الملف وتقديمه وإبلاغك بكل تحديث حتى استلام التأشيرة.",
      },
    ],
  },
  {
    category: "خدمات الشركات",
    questions: [
      {
        q: "هل تقدمون خدمات توظيف للشركات؟",
        a: "نعم، نقدم خدمات الأيادي العاملة وفق متطلباتكم وامتثالاً للأنظمة المعمول بها، مع متابعة شاملة لكل مراحل التوظيف.",
      },
      {
        q: "هل لديكم عقود سنوية لإدارة سفر الشركات؟",
        a: "نعم، نوفر برامج مخصصة لإدارة سفر الشركات بأسعار خاصة ومزايا إضافية. تواصل معنا للحصول على عرض مفصل.",
      },
    ],
  },
  {
    category: "الدعم والتواصل",
    questions: [
      {
        q: "كيف أتواصل معكم في حالات الطوارئ؟",
        a: "نوفر دعماً على مدار الساعة عبر واتساب. يمكنك التواصل على +965 9876 5432 في أي وقت.",
      },
      {
        q: "هل لديكم تطبيق للهاتف؟",
        a: "نعم، يمكنك إضافة موقعنا كتطبيق على شاشتك الرئيسية (PWA) للوصول السريع. كما نعمل على تطبيق كامل قريباً.",
      },
    ],
  },
];

export default async function FaqPage() {
  const cms = await getCmsData("cms_faq");
  const _faqs = cms?.faqs ?? faqs;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: _faqs.flatMap((cat: any) =>
      cat.questions.map((f: any) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      }))
    ),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative min-h-screen pt-28 marble-bg" style={{ color: "var(--page-text)" }}>
        <div className="mx-auto max-w-4xl px-5 py-16">
          <Link href="/" className="text-sm text-gold-400 underline hover:text-gold-300">
            ← الرئيسية
          </Link>

          <div className="mt-8 text-center">
            <p className="text-xs tracking-[0.35em] text-gold-400">FAQ</p>
            <h1 className="mt-4 text-4xl font-black" style={{ color: "var(--page-text)" }}>
              الأسئلة الشائعة
            </h1>
            <p className="mt-4" style={{ color: "var(--page-text-muted)" }}>
              إجابات على كل ما قد يخطر ببالك
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {_faqs.map((section: any) => (
              <div key={section.category}>
                <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-gold-400">
                  <span className="h-px flex-1 bg-gold-500/20" />
                  {section.category}
                  <span className="h-px flex-1 bg-gold-500/20" />
                </h2>
                <dl className="space-y-5">
                  {section.questions.map((f: any) => (
                    <div
                      key={f.q}
                      className="rounded-2xl border p-5 transition hover:border-gold-500/20"
                      style={{ borderColor: "var(--page-border-subtle)", background: "var(--page-surface)" }}
                    >
                      <dt className="font-semibold" style={{ color: "var(--page-text)" }}>
                        {f.q}
                      </dt>
                      <dd className="mt-3 text-sm leading-relaxed" style={{ color: "var(--page-text-muted)" }}>
                        {f.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-gold-500/10 to-transparent p-8 text-center">
            <h2 className="text-xl font-bold" style={{ color: "var(--page-text)" }}>
              لم تجد إجابتك؟
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--page-text-muted)" }}>
              تواصل مع فريقنا مباشرة وسنجيب على كل استفساراتك.
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=96598765432"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mx-auto mt-6 inline-flex"
            >
              تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
