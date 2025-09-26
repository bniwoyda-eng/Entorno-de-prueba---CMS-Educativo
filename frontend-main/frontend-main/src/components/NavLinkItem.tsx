import React from "react";
import { useLocation } from "react-router-dom";

interface NavLinkItemProps {
  text: string;
  path: string;
  handleNavigate: (url: string) => void;
  icon?: React.ReactElement;
  exact?: boolean;
}

export default function NavLinkItem({
  text,
  path,
  handleNavigate,
  icon,
  exact = false,
}: NavLinkItemProps) {
  const { pathname } = useLocation();

  // Función mejorada para determinar si el link está activo
  const isActive = (): boolean => {
    // Normalizar paths removiendo trailing slashes
    const normalizedPath = path.replace(/\/$/, '') || '/';
    const normalizedPathname = pathname.replace(/\/$/, '') || '/';

    // Caso 1: Coincidencia exacta
    if (normalizedPathname === normalizedPath) {
      return true;
    }

    // Si se especifica exact=true, solo coincidencia exacta
    if (exact) {
      return false;
    }

    // Obtener segmentos
    const pathSegments = normalizedPath.split('/').filter(Boolean);
    const pathnameSegments = normalizedPathname.split('/').filter(Boolean);

    // Para rutas base (como /educators, /admin, /students)
    // Solo marcar como activo si:
    // 1. Es exactamente la misma ruta, O
    // 2. Es la ruta base Y no hay más segmentos específicos después
    if (pathSegments.length === 1) {
      // Es una ruta base como /educators
      // Solo activar si estamos exactamente en esa ruta o si es la ruta raíz del módulo
      return normalizedPathname === normalizedPath || 
             (pathnameSegments.length === 1 && pathnameSegments[0] === pathSegments[0]);
    }

    // Para rutas más específicas (como /educators/posts)
    // Verificar coincidencia exacta de todos los segmentos
    if (pathSegments.length !== pathnameSegments.length) {
      return false;
    }

    return pathSegments.every((segment, index) => {
      return segment === pathnameSegments[index];
    });
  };

  return (
    <button
      onClick={() => handleNavigate(path)}
      className={`group flex justify-start items-center gap-3 w-[216px] h-[47px] rounded-2xl px-4 transition-colors
        ${
          isActive()
            ? "bg-main-100 text-main-400"
            : "bg-transparent text-dark hover:bg-main-100 hover:text-main-400 active:bg-main-200"
        }`}
    >
      {icon && <div className="w-[24px] h-[24px] text-main-400">{icon}</div>}
      <p className="font-medium">{text}</p>
    </button>
  );
}
