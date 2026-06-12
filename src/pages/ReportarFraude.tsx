import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { API_URL } from "@/lib/config";

interface FraudForm {
  impostorDetails: string;
  contactInfo: string;
  comments: string;
}

const EMPTY_FORM: FraudForm = { impostorDetails: "", contactInfo: "", comments: "" };

const ReportarFraude = () => {
  const [form, setForm] = useState<FraudForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FraudForm>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const validate = (): boolean => {
    const next: Partial<FraudForm> = {};
    if (!form.impostorDetails.trim())
      next.impostorDetails = "Este campo es obligatorio.";
    if (!form.comments.trim())
      next.comments = "Este campo es obligatorio.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/fraud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm(EMPTY_FORM);
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FraudForm])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 mt-20 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">

          {/* Encabezado */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-danger-100 mb-4">
              <ShieldAlert className="w-7 h-7 text-danger-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Reportar un fraude</h1>
            <p className="mt-2 text-gray-500">
              Complete el formulario con la información disponible sobre el caso.
            </p>
          </div>

          {/* Barra de progreso decorativa */}
          <div className="flex gap-2 mb-8">
            <div className="h-1 flex-1 rounded bg-danger-500" />
            <div className="h-1 flex-1 rounded bg-gray-200" />
          </div>

          {/* Alerta de éxito */}
          {status === "success" && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-success-50 border border-success-200 text-success-700">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Reporte enviado exitosamente.</p>
                <p className="text-sm">Gracias por contribuir a la seguridad ciudadana.</p>
              </div>
            </div>
          )}

          {/* Alerta de error */}
          {status === "error" && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-danger-50 border border-danger-200 text-danger-700">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">Ocurrió un error al enviar el reporte. Intente de nuevo.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* Sección 1: Detalles del impostor */}
            <div className="bg-white rounded-xl shadow-soft p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detalles sobre el impostor</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Comparta lo que sepa sobre quién decía ser el estafador.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre de la persona, empresa o entidad que decía ser el impostor
                  <span className="text-danger-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="impostorDetails"
                  value={form.impostorDetails}
                  onChange={handleChange}
                  placeholder="ej. Banco Nacional, Juan Pérez..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.impostorDetails ? "border-danger-400 bg-danger-50" : "border-gray-300"
                  }`}
                />
                {errors.impostorDetails && (
                  <p className="mt-1 text-xs text-danger-600">{errors.impostorDetails}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Número, correo o usuario desde el que contactó
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={form.contactInfo}
                  onChange={handleChange}
                  placeholder="ej. 8888-8888, fraude@mail.com, @usuario"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                />
              </div>
            </div>

            {/* Sección 2: Comentarios */}
            <div className="bg-white rounded-xl shadow-soft p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Comentarios</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Describa lo que ocurrió con el mayor detalle posible. Mencione URLs, números,
                  montos o fechas si las recuerda. No incluya contraseñas ni información bancaria completa.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción del caso
                  <span className="text-danger-500 ml-1">*</span>
                </label>
                <textarea
                  name="comments"
                  value={form.comments}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describa el incidente..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none ${
                    errors.comments ? "border-danger-400 bg-danger-50" : "border-gray-300"
                  }`}
                />
                {errors.comments && (
                  <p className="mt-1 text-xs text-danger-600">{errors.comments}</p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Volver al inicio
              </Link>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-danger-600 hover:bg-danger-700 text-white text-sm font-semibold transition disabled:opacity-60"
              >
                {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "loading" ? "Enviando..." : "Enviar reporte"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-400">
              ¿Desea ver los reportes registrados?{" "}
              <Link to="/reportes" className="text-primary-600 hover:underline font-medium">
                Ver todos los reportes
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportarFraude;
