import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ItemDetail page component
// Displays detailed information about a single item
// Features:
// - Fetches and displays item details by ID
// - Responsive layout with image display
// - Loading and error states
// - Back navigation
// - Hover effects on interactive elements

const styles = {
  container: {
    fontFamily: "'Orbitron', sans-serif", // Custom font for styling
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // Dark gradient background
    color: '#00ffe7', // Neon accent color
    minHeight: '100vh', // Full viewport height
    padding: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 24, // Space between image and info
  },
  imageWrapper: {
    width: 482,
    height: 500,
    backgroundColor: 'rgba(0, 255, 231, 0.1)', // Semi-transparent background
    border: '2px solid #00ffe7', // Neon border
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box', // Include padding/border in size
    overflow: 'hidden', // Prevent overflow
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain', // Maintain aspect ratio within container
  },
  infoContainer: {
    maxWidth: 400, // Limit width of text content
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
    userSelect: 'none', // Prevent text selection on click
    transition: 'background-color 0.3s', // Smooth hover transition
    outline: 'none', // Remove focus outline
    marginBottom: 16,
  },
  backLinkHover: {
    backgroundColor: 'rgba(0, 255, 231, 0.2)', // Hover effect background
  },
};

function ItemDetail() {
  const { id } = useParams(); // Extract item id from route params
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [error, setError] = useState(false); // Error state indicator
  const [backHover, setBackHover] = useState(false); // Hover state for back link

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch('http://localhost:3001/api/items/' + id) // Fetch item data by id
      .then(res => {
        if (!res.ok) throw new Error('Fetch error'); // Handle non-200 status
        return res.json();
      })
      .then(data => {
        if (!data || !data.name) throw new Error('Item not found'); // Validate data
        setItem(data); // Set fetched item data
      })
      .catch(() => {
        setError(true); // Set error state on failure
        setItem(null);
      })
      .finally(() => setLoading(false)); // End loading state
  }, [id]); // Re-run effect on id change

  if (loading)
    return (
      <div style={styles.container}>
        <p style={{ color: '#00ffe7', fontWeight: '700' }}>Loading item details...</p> {/* Loading feedback */}
      </div>
    );

  if (error)
    return (
      <div style={styles.container}>
        <Link
          to="/"
          style={{ ...styles.backLink, ...(backHover ? styles.backLinkHover : {}) }} // Apply hover styles conditionally
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          Back to Items
        </Link>
        <p>Error loading item or item not found.</p> {/* Error feedback */}
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.imageWrapper}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} style={styles.image} /> // Show item image
        ) : (
          <span style={{ color: '#00ffe7', fontWeight: '700' }}>No Image</span> // Fallback if no image
        )}
      </div>

      <div style={styles.infoContainer}>
        <Link
          to="/"
          style={{ ...styles.backLink, ...(backHover ? styles.backLinkHover : {}) }} // Back link with hover styles
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          Back to Home
        </Link>

        <h2>{item.name}</h2> { }
        <p>
          <strong>Category:</strong> {item.category || 'N/A'} {/* Category with fallback */}
        </p>
        <p>
          <strong>Price:</strong> ${item.price != null ? item.price : 'N/A'} {/* Price with fallback */}
        </p>
        {item.description && (
          <p>
            <strong>Description:</strong> {item.description} {/* Optional description */}
          </p>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
