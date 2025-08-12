import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { VariableSizeGrid as Grid } from 'react-window';

// Items page component
// Displays a virtualized grid of items with search functionality
// Uses react-window for efficient rendering of large lists
// Features:
// - Real-time search filtering
// - Responsive grid layout
// - Smooth hover effects
// - Loading states
// - Error handling

const styles = {
  container: {
    fontFamily: "'Orbitron', sans-serif",
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    color: '#00ffe7',
    minHeight: '100vh',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  placeholderImageSpace: {
    width: 240,
    height: 96,
    marginBottom: 30,
  },
  buttonItem: {
    backgroundColor: 'rgba(0, 255, 231, 0.1)',
    border: '2px solid #00ffe7',
    borderRadius: 12,
    color: '#00ffe7',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'none',
    transition: 'all 0.3s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 180,
    boxSizing: 'border-box',
    marginTop: 8,
  },
  buttonItemHover: {
    backgroundColor: 'rgba(0, 255, 231, 0.3)',
    borderColor: '#00e0c2',
    color: '#000',
  },
  itemImageContainer: {
    width: 180,
    height: 200,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  itemImage: {
    width: 160,
    height: 160,
    objectFit: 'cover',
    borderRadius: 8,
    backgroundColor: '#1c2a33',
    display: 'block',
  },
  cellWrapper: {
    paddingRight: 32,
    paddingBottom: 64,
    boxSizing: 'border-box',
  },
  singleItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginTop: 64,
  },
  loading: {
    fontSize: 18,
    fontWeight: 700,
  },
  noResults: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 40,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #00ffe7',
    backgroundColor: 'rgba(0, 255, 231, 0.05)',
    color: '#00ffe7',
    width: '100%',
    maxWidth: 400,
    outline: 'none',
    boxSizing: 'border-box',
  },
  headerLink: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    color: '#00ffe7',
    fontWeight: 700,
    fontSize: 18,
    textDecoration: 'none',
    padding: '5px 10px',
    border: '2px solid #00ffe7',
    borderRadius: 8,
    boxSizing: 'content-box',
    userSelect: 'none',
    transition: 'background-color 0.3s',
    outline: 'none',
  },
  headerLinkHover: {
    backgroundColor: 'rgba(0, 255, 231, 0.2)',
  },
};

// Button with hover effect implemented with local state to apply styles idiomatically
function HoverButton({ to, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      style={{ ...styles.buttonItem, ...(isHovered ? styles.buttonItemHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}

function Items() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);
  const ITEMS_PER_PAGE = 1000;

  // Debounce input changes to limit API requests
  useEffect(() => {
    const timeoutId = setTimeout(() => setQuery(searchTerm), 200);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch items from API with query params
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: ITEMS_PER_PAGE, q: query });
      const response = await fetch(`http://localhost:3001/api/items?${params.toString()}`);
      if (!response.ok) throw new Error('Fetch error');
      const data = await response.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter invalid or placeholder items
  const filteredItems = items.filter(
    ({ name }) => name && name.trim() !== '' && name.toLowerCase() !== 'newitem'
  );

  const COLUMN_COUNT = 4;
  const itemCount = filteredItems.length;
  const ROW_COUNT = Math.ceil(itemCount / COLUMN_COUNT) * 2; // images and buttons rows

  const getRowHeight = (rowIndex) => (rowIndex % 2 === 0 ? 200 : 88);
  const getColumnWidth = () => 212;

  // Render grid cell for image (even rows) or button (odd rows)
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemRow = Math.floor(rowIndex / 2);
    const itemIndex = itemRow * COLUMN_COUNT + columnIndex;
    if (itemIndex >= itemCount) return null;

    const item = filteredItems[itemIndex];
    const isImageRow = rowIndex % 2 === 0;

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
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        ) : (
          <HoverButton to={`/items/${item.id}`}>
            {item.name}
          </HoverButton>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.noResults}>No results found</p>
      </div>
    );
  }

  if (filteredItems.length === 1) {
    const [item] = filteredItems;
    return (
      <div style={styles.container}>
        <Link
          to="/"
          style={{ ...styles.headerLink, ...(headerHover ? styles.headerLinkHover : {}) }}
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
          onChange={(e) => setSearchTerm(e.target.value)}
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
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <HoverButton to={`/items/${item.id}`}>
            {item.name}
          </HoverButton>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Link
        to="/"
        style={{ ...styles.headerLink, ...(headerHover ? styles.headerLinkHover : {}) }}
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
      >
        Home
      </Link>

      <input
        type="search"
        value={searchTerm}
        aria-label="Search items"
        placeholder="Search products..."
        onChange={(e) => setSearchTerm(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        style={styles.input}
      />

      <div style={styles.placeholderImageSpace} />

      <Grid
        columnCount={COLUMN_COUNT}
        rowCount={ROW_COUNT}
        columnWidth={getColumnWidth}
        rowHeight={getRowHeight}
        height={600}
        width={getColumnWidth() * COLUMN_COUNT}
      >
        {(props) => <Cell {...props} />}
      </Grid>
    </div>
  );
}

export default Items;
