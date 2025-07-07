import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext(); // Create context for data sharing

export function DataProvider({ children }) {
  const [items, setItems] = useState([]); // State to store fetched items

  /*  const fetchItems = useCallback(async () => {
      const res = await fetch('http://localhost:3001/api/items?limit=500'); // Intentional bug: backend ignores limit
      const json = await res.json();
      setItems(json);
    }, []);
  */

  const fetchItems = useCallback(async (isActive) => {
    try {
      const res = await fetch('http://localhost:3001/api/items?limit=500'); // Fetch with limit param
      if (!res.ok) throw new Error(`HTTP error ${res.status}`); // Throw error on bad status
      const json = await res.json();
      if (isActive && isActive() && Array.isArray(json)) setItems(json); // Update only if component is active and data valid
      else if (isActive && isActive()) setItems([]); // Clear items if active but data invalid
    } catch {
      if (isActive && isActive()) setItems([]); // On error, clear items if active
    }
  }, []); // Empty deps: stable function

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children} {/* Provide context values */}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext); // Hook to consume data context
