import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, AlertCircle, Loader2, Calendar, Phone } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { API_URL } from "@/lib/config";

interface Fraud {
  id: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt: string;
}

const Reportes = () => {
  const [frauds, setFrauds] = useState<Fraud[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    fetch(`${API_URL}/api/fraud`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setFrauds(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 mt-20 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes de fraude</h1>
              <p className="text-gray-500 mt-1">Registros públicos reportados por la ciudadanía.</p>
            </div>
            <Link
              to="/reportar-estafa"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-danger-600 hover:bg-danger-700 text-white text-sm font-semibold transition shrink-0"
            >
              <ShieldAlert className="w-4 h-4" />
              Nuevo reporte
            </Link>
          </div>

          {/* Estado: cargando */}
          {status === "loading" && (
            <div className="flex justify-center items-center py-20 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span>Cargando reportes...</span>
            </div>
          )}

          {/* Estado: error */}
          {status === "error" && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-danger-50 border border-danger-200 text-danger-700">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm">No se pudieron cargar los reportes. Intente más tarde.</p>
            </div>
          )}

          {/* Lista de reportes */}
          {status === "success" && frauds.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No hay reportes registrados aún.</p>
            </div>
          )}

          {status === "success" && frauds.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{frauds.length} reporte(s) encontrado(s)</p>
              {frauds.map((fraud) => (
                <div
                  key={fraud.id}
                  className="bg-white rounded-xl shadow-soft p-5 border-l-4 border-danger-500 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-gray-900 text-base">
                      {fraud.impostorDetails}
                    </h2>
                    <span className="text-xs text-gray-400 shrink-0">#{fraud.id}</span>
                  </div>

                  {fraud.contactInfo && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{fraud.contactInfo}</span>
                    </div>
                  )}

                  {fraud.comments && (
                    <p className="text-sm text-gray-700 leading-relaxed">{fraud.comments}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-1 border-t border-gray-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(fraud.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reportes;
