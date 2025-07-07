import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  /*  const fetchItems = useCallback(async () => {
      const res = await fetch('http://localhost:3001/api/items?limit=500'); // Intentional bug: backend ignores limit
      const json = await res.json();
      setItems(json);
    }, []);
    */
  const fetchItems = useCallback(async (isActive) => {
    try {
      const res = await fetch('http://localhost:3001/api/items?limit=500');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      if (isActive && isActive() && Array.isArray(json)) setItems(json);
      else if (isActive && isActive()) setItems([]);
    } catch {
      if (isActive && isActive()) setItems([]);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);