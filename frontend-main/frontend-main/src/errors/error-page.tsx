// components/ErrorPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  code: number;
  message: string;
  description?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code,
  message,
  description,
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-main-400 mb-4">{code}</h1>
        <h2 className="text-2xl font-semibold mb-2">{message}</h2>
        {description && (
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <button
          onClick={handleBack}
          className="mt-6 inline-block px-6 py-2 bg-main-400 text-white rounded-lg shadow hover:bg-main-300 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
};
