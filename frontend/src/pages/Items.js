import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VariableSizeGrid as Grid } from 'react-window';

const styles = {
  container: { fontFamily: "'Orbitron', sans-serif", background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: '#00ffe7', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }, // Main container style
  placeholderImageSpace: { width: '240px', height: '96px', marginBottom: '30px' }, // Spacer to balance layout
  buttonItem: { backgroundColor: 'rgba(0, 255, 231, 0.1)', border: '2px solid #00ffe7', borderRadius: '12px', color: '#00ffe7', fontWeight: '700', fontSize: '16px', cursor: 'pointer', textAlign: 'center', textDecoration: 'none', userSelect: 'none', transition: 'all 0.3s', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', width: '180px', boxSizing: 'border-box', marginTop: '8px' }, // Button styling for item names
  itemImageContainer: { width: '180px', height: '200px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center' }, // Container for item images
  itemImage: { width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#1c2a33', display: 'block' }, // Image style with fixed size and rounded corners
  cellWrapper: { paddingRight: '2rem', paddingBottom: '4rem', boxSizing: 'border-box' }, // Grid cell padding
  singleItemWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '4rem' }, // Style for single item display
  loading: { fontSize: '18px', fontWeight: '700' }, // Loading text style
  noResults: { fontSize: '16px', fontWeight: '700', marginTop: 40 }, // No results text style
  input: { marginBottom: 20, padding: '10px', fontSize: '16px', borderRadius: '8px', border: '1px solid #00ffe7', backgroundColor: 'rgba(0, 255, 231, 0.05)', color: '#00ffe7', width: '100%', maxWidth: '400px', outline: 'none', boxSizing: 'border-box' }, // Search input style
  headerLink: { alignSelf: 'flex-start', marginBottom: 20, color: '#00ffe7', fontWeight: '700', fontSize: '18px', textDecoration: 'none', padding: '5px 10px', border: '2px solid #00ffe7', borderRadius: '8px', boxSizing: 'content-box', userSelect: 'none', transition: 'background-color 0.3s', outline: 'none' }, // Header link style
  headerLinkHover: { backgroundColor: 'rgba(0, 255, 231, 0.2)' }, // Hover effect for header link
};

function Items() {
  const [items, setItems] = useState([]); // Items state
  const [q, setQ] = useState(''); // Debounced search query
  const [searchTerm, setSearchTerm] = useState(''); // Immediate input value
  const [loading, setLoading] = useState(false); // Loading indicator
  const [headerHover, setHeaderHover] = useState(false); // Hover state for header link
  const itemsPerPage = 1000; // Fetch limit

  useEffect(() => {
    const timer = setTimeout(() => setQ(searchTerm), 200); // Debounce input by 200ms
    return () => clearTimeout(timer); // Clear timeout on input change
  }, [searchTerm]);

  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading state before fetch
    try {
      const params = new URLSearchParams({ limit: itemsPerPage, q }); // Prepare query params
      const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`); // Fetch API
      if (!res.ok) throw new Error('Fetch error'); // Handle non-200 status
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []); // Validate and set items
    } catch {
      setItems([]); // Clear items on error
    } finally {
      setLoading(false); // Clear loading state
    }
  }, [q]);

  useEffect(() => {
    fetchData(); // Fetch on query change
  }, [fetchData]);

  const filteredItems = items.filter(item => item.name && item.name.trim() !== '' && item.name.toLowerCase() !== 'newitem'); // Filter out empty and placeholder names

  // Layout params
  const columnCount = 4; // Number of columns in grid
  const itemCount = filteredItems.length; // Total filtered items
  const rowCount = Math.ceil(itemCount / columnCount) * 2; // Each item uses 2 rows (image + button)

  const getRowHeight = rowIndex => (rowIndex % 2 === 0 ? 200 : 88); // Row height alternates between image and button rows
  const getColumnWidth = () => 180 + 32; // Fixed column width with padding

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemRow = Math.floor(rowIndex / 2); // Calculate item index based on row
    const itemIndex = itemRow * columnCount + columnIndex; // Calculate item index
    if (itemIndex >= itemCount) return null; // No cell if out of bounds

    const item = filteredItems[itemIndex];
    const isImageRow = rowIndex % 2 === 0; // Even rows: images, odd rows: buttons

    return (
      <div
        style={{
          ...style,
          ...styles.cellWrapper,
          display: 'flex',
          justifyContent: 'center',
          boxSizing: 'border-box',
          paddingLeft: 0,
          paddingTop: 0,
        }}
      >
        {isImageRow ? (
          <div style={styles.itemImageContainer}>
            <img
              src={item.imageUrl || ''}
              alt={item.name}
              style={styles.itemImage}
              onError={e => {
                e.currentTarget.style.display = 'none'; // Hide broken images
              }}
            />
          </div>
        ) : (
          <Link to={`/items/${item.id}`} style={styles.buttonItem}>
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading...</p> {/* Loading indicator */}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.noResults}>No results found</p> {/* No results message */}
      </div>
    );
  }

  if (filteredItems.length === 1) {
    const item = filteredItems[0];
    return (
      <div style={styles.container}>
        <Link
          to="/"
          style={{ ...styles.headerLink, ...(headerHover ? styles.headerLinkHover : {}) }} // Header link with hover
          onMouseEnter={() => setHeaderHover(true)}
          onMouseLeave={() => setHeaderHover(false)}
        >
          Items
        </Link>

        <input
          type="search"
          value={searchTerm}
          aria-label="Search items"
          placeholder="Search products..."
          onChange={e => setSearchTerm(e.target.value)} // Update immediate input value
          spellCheck={false}
          autoComplete="off"
          style={styles.input}
        />

        <div style={styles.singleItemWrapper}>
          <div style={styles.itemImageContainer}>
            <img
              src={item.imageUrl || ''}
              alt={item.name}
              style={styles.itemImage}
              onError={e => {
                e.currentTarget.style.display = 'none'; // Hide broken image
              }}
            />
          </div>
          <Link to={`/items/${item.id}`} style={styles.buttonItem}>
            {item.name}
          </Link>
        </div>
      </div>
    );
  }

  // Default grid rendering for multiple items
  return (
    <div style={styles.container}>
      <Link
        to="/"
        style={{ ...styles.headerLink, ...(headerHover ? styles.headerLinkHover : {}) }} // Header link hover effect
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
      >
        Items
      </Link>

      <input
        type="search"
        value={searchTerm}
        aria-label="Search items"
        placeholder="Search products..."
        onChange={e => setSearchTerm(e.target.value)} // Search input handler
        spellCheck={false}
        autoComplete="off"
        style={styles.input}
      />

      <div style={styles.placeholderImageSpace} /> {/* Spacer for layout alignment */}

      <Grid
        columnCount={columnCount} // Number of columns
        rowCount={rowCount} // Number of rows (2x for image + button)
        columnWidth={getColumnWidth} // Width per column
        rowHeight={getRowHeight} // Height per row
        height={600} // Grid height
        width={getColumnWidth() * columnCount} // Grid width
      >
        {Cell} {/* Render cells */}
      </Grid>
    </div>
  );
}

export default Items;
