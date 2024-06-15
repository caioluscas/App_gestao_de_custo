// CategoriasContext.js
import React, { createContext, useContext, useState } from 'react';

const CategoriasContext = createContext();

export const useCategorias = () => useContext(CategoriasContext);

export const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);

  return (
    <CategoriasContext.Provider value={{ categorias, setCategorias }}>
      {children}
    </CategoriasContext.Provider>
  );
};
