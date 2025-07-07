import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const styles = {
  container: {
    fontFamily: "'Orbitron', sans-serif",
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    color: '#00ffe7',
    minHeight: '100vh',
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 24,
  },
  imageWrapper: {
    width: 482,
    height: 500,
    backgroundColor: 'rgba(0, 255, 231, 0.1)',
    border: '2px solid #00ffe7',
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  infoContainer: {
    maxWidth: 400,
  },
  backLink: {
    color: '#00ffe7',
    fontWeight: '700',
    fontSize: 18,
    textDecoration: 'none',
    padding: '5px 10px',
    border: '2px solid #00ffe7',
    borderRadius: 8,
    display: 'inline-block',
    userSelect: 'none',
    transition: 'background-color 0.3s',
    outline: 'none',
    marginBottom: 16,
  },
  backLinkHover: {
    backgroundColor: 'rgba(0, 255, 231, 0.2)',
  },
};

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch('http://localhost:3001/api/items/' + id)
      .then(res => {
        if (!res.ok) throw new Error('Fetch error');
        return res.json();
      })
      .then(data => {
        if (!data || !data.name) throw new Error('Item not found');
        setItem(data);
      })
      .catch(() => {
        setError(true);
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div style={styles.container}>
        <p style={{ color: '#00ffe7', fontWeight: '700' }}>Loading item details...</p>
      </div>
    );

  if (error)
    return (
      <div style={styles.container}>
        <Link
          to="/"
          style={{ ...styles.backLink, ...(backHover ? styles.backLinkHover : {}) }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          Back to Items
        </Link>
        <p>Error loading item or item not found.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.imageWrapper}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} style={styles.image} />
        ) : (
          <span style={{ color: '#00ffe7', fontWeight: '700' }}>No Image</span>
        )}
      </div>

      <div style={styles.infoContainer}>
        <Link
          to="/"
          style={{ ...styles.backLink, ...(backHover ? styles.backLinkHover : {}) }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          Back to Items
        </Link>

        <h2>{item.name}</h2>
        <p>
          <strong>Category:</strong> {item.category || 'N/A'}
        </p>
        <p>
          <strong>Price:</strong> ${item.price != null ? item.price : 'N/A'}
        </p>
        {item.description && (
          <p>
            <strong>Description:</strong> {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
