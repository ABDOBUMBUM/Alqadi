import { useState, useEffect } from "react";
import { RefreshCw, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

export function ApiIntegrationsSection({ isDark }: { isDark?: boolean }) {
  const [apis, setApis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("/api/admin/api-config")
      .then(r => r.json())
      .then(data => {
        setApis(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const handleTest = async (id: string) => {
    setTestResult(prev => ({ ...prev, [id]: { loading: true } }));
    try {
      const res = await fetch("/api/admin/api-config/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      setTestResult(prev => ({ ...prev, [id]: { loading: false, data } }));
    } catch (error) {
      setTestResult(prev => ({ ...prev, [id]: { loading: false, data: { ok: false, message: "فشل الاتصال" } } }));
    }
  };

  const handleAdd = async () => {
    const name = prompt("Enter API variable name (e.g., new_api):");
    const label = prompt("Enter Display Label (e.g., New Payment Gateway):");
    const endpoint = prompt("Enter API Endpoint URL:");
    if (!name || !label) return;

    await fetch("/api/admin/api-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, label, endpoint, apiKey: "", secret: "", type: "REST" })
    });
    
    // Refresh
    fetch("/api/admin/api-config").then(r => r.json()).then(data => setApis(Array.isArray(data) ? data : []));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API configuration?")) return;
    await fetch(`/api/admin/api-config?id=${id}`, { method: "DELETE" });
    setApis(apis.filter(a => a.id !== id));
  };

  if (loading) return <div className="text-white/50">جاري تحميل الـ APIs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-indigo-400" /> إدارة ربط الـ APIs
        </h3>
        <button onClick={handleAdd} className="flex items-center gap-2 rounded-xl bg-indigo-500 text-white px-4 py-2 font-bold hover:bg-indigo-400 transition">
          <Plus className="h-4 w-4" /> إضافة API جديد
        </button>
      </div>

      <div className="grid gap-4">
        {apis.map(api => (
          <div key={api.id} className="rounded-2xl border border-white/5 bg-slate-900 p-5 hover:border-white/10 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  {api.label} <span className="bg-white/10 text-white/60 text-[10px] px-2 py-0.5 rounded border border-white/20">{api.type || "REST"}</span>
                </h4>
                <p className="text-xs text-white/40 font-mono mt-1">{api.endpoint || "لم يتم تعيين رابط"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleTest(api.id)} disabled={testResult[api.id]?.loading} className="px-3 py-1.5 text-xs rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition disabled:opacity-50">
                  {testResult[api.id]?.loading ? "جاري الفحص..." : "اختبار الاتصال"}
                </button>
                <button onClick={() => handleDelete(api.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            {testResult[api.id]?.data && (
              <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2 ${testResult[api.id].data.ok ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
                {testResult[api.id].data.ok ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <XCircle className="h-4 w-4 mt-0.5" />}
                <div>
                  <p className="font-bold">{testResult[api.id].data.ok ? "الاتصال ناجح" : "فشل الاتصال"}</p>
                  <p className="opacity-80 mt-1">{testResult[api.id].data.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {apis.length === 0 && (
          <div className="text-center py-10 text-white/40 border border-dashed border-white/10 rounded-2xl">
            لا يوجد أي APIs مضافة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
