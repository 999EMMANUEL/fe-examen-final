import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import ReportarFraude from "@/pages/ReportarFraude";
import Reportes from "@/pages/Reportes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/reportar-estafa",
    element: <ReportarFraude />,
  },
  {
    path: "/reportes",
    element: <Reportes />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
