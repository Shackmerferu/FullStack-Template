import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { VariableSizeGrid as Grid } from 'react-window';

const styles = {
  container: {
    fontFamily: "'Orbitron', sans-serif",
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    color: '#00ffe7',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  placeholderImageSpace: {
    width: '240px',
    height: '96px',
    marginBottom: '30px',
  },
  buttonItem: {
    backgroundColor: 'rgba(0, 255, 231, 0.1)',
    border: '2px solid #00ffe7',
    borderRadius: '12px',
    color: '#00ffe7',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    userSelect: 'none',
    transition: 'all 0.3s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px',
    width: '180px',
    boxSizing: 'border-box',
    marginTop: '8px',
  },
  itemImageContainer: {
    width: '180px',
    height: '200px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
  },
  itemImage: {
    width: '160px',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '8px',
    backgroundColor: '#1c2a33',
    display: 'block',
  },
  cellWrapper: {
    paddingRight: '2rem',
    paddingBottom: '4rem',
    boxSizing: 'border-box',
  },
  singleItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '4rem',
  },
  loading: {
    fontSize: '18px',
    fontWeight: '700',
  },
  noResults: {
    fontSize: '16px',
    fontWeight: '700',
    marginTop: 40,
  },
  input: {
    marginBottom: 20,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #00ffe7',
    backgroundColor: 'rgba(0, 255, 231, 0.05)',
    color: '#00ffe7',
    width: '100%',
    maxWidth: '400px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  headerLink: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    color: '#00ffe7',
    fontWeight: '700',
    fontSize: '18px',
    textDecoration: 'none',
    padding: '5px 10px',
    border: '2px solid #00ffe7',
    borderRadius: '8px',
    boxSizing: 'content-box',
    userSelect: 'none',
    transition: 'background-color 0.3s',
    outline: 'none',
  },
  headerLinkHover: {
    backgroundColor: 'rgba(0, 255, 231, 0.2)',
  },
};

function Items() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);
  const itemsPerPage = 1000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: itemsPerPage, q });
      const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`);
      if (!res.ok) throw new Error('Fetch error');
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = items.filter(item =>
    item.name && item.name.trim() !== '' && item.name.toLowerCase() !== 'newitem'
  );

  // Layout params
  const columnCount = 4;
  const itemCount = filteredItems.length;
  const rowCount = Math.ceil(itemCount / columnCount) * 2;

  const getRowHeight = rowIndex => (rowIndex % 2 === 0 ? 200 : 88);
  const getColumnWidth = () => 180 + 32;

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemRow = Math.floor(rowIndex / 2);
    const itemIndex = itemRow * columnCount + columnIndex;
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
              onError={e => {
                e.currentTarget.style.display = 'none';
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

  // Render single item centered if only one result
  if (filteredItems.length === 1) {
    const item = filteredItems[0];
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
          onChange={e => setSearchTerm(e.target.value)}
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
                e.currentTarget.style.display = 'none';
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
        onChange={e => setSearchTerm(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        style={styles.input}
      />

      <div style={styles.placeholderImageSpace} />

      <Grid
        columnCount={columnCount}
        rowCount={rowCount}
        columnWidth={getColumnWidth}
        rowHeight={getRowHeight}
        height={600}
        width={getColumnWidth() * columnCount}
      >
        {Cell}
      </Grid>
    </div>
  );
}

export default Items;
