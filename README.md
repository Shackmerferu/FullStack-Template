# Full Stack Items Manager

A full-stack web application for managing items with search, pagination and detailed views. Built with React and Node.js.

## Features

### Frontend
- Responsive item grid layout with virtualization
- Real-time search with debouncing
- Item detail view with navigation
- Loading states and error handling
- Memory leak prevention
- Styled components with hover effects
- Accessibility considerations

### Backend
- RESTful API endpoints for items and stats
- Server-side pagination and search
- Asynchronous file operations
- Request logging and monitoring
- Error handling middleware
- Caching for performance optimization
- CORS security

## Tech Stack

### Frontend
- React 18
- React Router 6
- React Window (virtualization)
- Custom hooks and context
- Modern CSS-in-JS styling

### Backend
- Node.js 18
- Express 4
- Jest & Supertest
- Morgan logging
- CORS
- File-based storage

## Getting Started

### Prerequisites
- Node.js 18.x
- npm/yarn

### Installation & Running

1. Clone the repository
```bash
git clone https://github.com/Shackmerferu/test6-answer.git
```

2. Install and start backend
```bash
cd backend
npm install
npm start
```

3. Install and start frontend (in new terminal)
```bash
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000
The backend API runs at http://localhost:3001

## API Endpoints

### Items
- `GET /api/items` - List items (supports pagination and search)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item

### Stats
- `GET /api/stats` - Get item statistics (cached)

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   └── state/
│   └── public/
└── data/
```

## License

This project is licensed under the MIT License.