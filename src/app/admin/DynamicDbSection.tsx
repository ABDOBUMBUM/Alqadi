import { useState, useEffect } from "react";
import { Database, Plus, Trash2, Edit3, Save } from "lucide-react";

export function DynamicDbSection({ isDark }: { isDark?: boolean }) {
  const [schemas, setSchemas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dynamic-schema")
      .then(r => r.json())
      .then(data => {
        setSchemas(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleAddSchema = async () => {
    const name = prompt("Enter DB Table Name (e.g., packages, custom_cars):");
    const labelAr = prompt("Enter Arabic Label (e.g., باقات مميزة):");
    if (!name || !labelAr) return;

    // Simple schema creation with two default fields
    const fields = [
      { name: "title", type: "string", labelAr: "العنوان", required: true },
      { name: "price", type: "number", labelAr: "السعر", required: false }
    ];

    await fetch("/api/admin/dynamic-schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, labelAr, fields })
    });
    
    // Refresh
    fetch("/api/admin/dynamic-schema").then(r => r.json()).then(data => setSchemas(Array.isArray(data) ? data : []));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schema and ALL its records?")) return;
    await fetch(`/api/admin/dynamic-schema?id=${id}`, { method: "DELETE" });
    setSchemas(schemas.filter(s => s.id !== id));
  };

  if (loading) return <div className="text-white/50">جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="h-6 w-6 text-emerald-400" /> قواعد البيانات الديناميكية
        </h3>
        <button onClick={handleAddSchema} className="flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-900 px-4 py-2 font-bold hover:bg-emerald-400 transition">
          <Plus className="h-4 w-4" /> إنشاء جدول جديد
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {schemas.map(schema => (
          <div key={schema.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{schema.labelAr}</h4>
                  <p className="text-xs text-white/40 font-mono">db: {schema.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-white/40 hover:text-white transition"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(schema.id)} className="px-2 py-1 text-red-400 hover:text-red-300 transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="pt-3 border-t border-white/5 text-xs text-white/60 flex justify-between">
              <span>عدد الحقول: {(schema.fields as any[])?.length || 0}</span>
              <span>عدد السجلات: {schema.records?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {schemas.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-slate-900 p-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
            <Database className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">لا توجد جداول مخصصة بعد</h4>
          <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">هذه الميزة تتيح لك إضافة أقسام جديدة بالكامل للنظام بدون كتابة أي كود برمجي.</p>
        </div>
      )}
    </div>
  );
}
