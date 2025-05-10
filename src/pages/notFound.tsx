import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-5xl font-bold text-blue-800">404</h1>
      <p className="mt-4 text-xl text-gray-700">Página não encontrada</p>
      <p className="mt-2 text-gray-500">A página que você está procurando não existe ou foi movida.</p>
      
      <Link 
        to="/dashboard" 
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Voltar para o Dashboard
      </Link>
    </div>
  );
};

export default NotFound;