import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';

function App() {
  useEffect(() => {
    document.body.style.margin = '0'; // Reset body margin for consistent layout
    document.body.style.padding = '0'; // Reset body padding for consistent layout
  }, []); // Run once on mount

  return (
    <DataProvider> {}
      <Routes>
        <Route path="/" element={<Items />} /> {/* Main items list route */}
        <Route path="/items/:id" element={<ItemDetail />} /> {/* Item detail route */}
      </Routes>
    </DataProvider>
  );
}

export default App;