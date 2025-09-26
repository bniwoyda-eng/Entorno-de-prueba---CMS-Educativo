import { useLocation } from "react-router-dom";
import { ErrorPage } from "./error-page";

export const NotFoundPage = () => {
  const location = useLocation();

  return (
    <ErrorPage
      code={404}
      message="Página no encontrada"
      description={`No existe una ruta para ${location.pathname}. Por favor, verificá la URL.`}
    />
  );
};
