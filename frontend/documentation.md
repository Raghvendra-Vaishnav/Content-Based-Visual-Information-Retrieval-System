# CBVIRS Frontend Documentation

## Overview

The CBVIRS (Content-Based-Visual-Information-Retrieval-System) frontend is a React-based web application built with Material-UI (MUI) that provides an intuitive interface for semantic image search. The application supports text-based search, image-based search, and automatic caption generation, with a responsive design that works across desktop and mobile devices.

## Architecture

### Technology Stack

- **React 18**: Component-based UI framework
- **Material-UI (MUI)**: Component library for consistent design
- **Axios**: HTTP client for API communication
- **Vite**: Build tool and development server
- **React Router**: Client-side routing (if needed for future expansion)

### Component Structure

#### Main Components

##### 1. App (`src/App.jsx`)

- **Purpose**: Main application component and routing
- **Features**:
  - Theme provider setup
  - Main layout with navigation
  - State management for global settings

##### 2. UploadSection (`src/components/UploadSection.jsx`)

- **Purpose**: Handles image uploads and batch processing
- **Features**:
  - Drag-and-drop file upload
  - Progress indicators
  - Batch upload support
  - Error handling and validation

##### 3. SearchSection (`src/components/SearchSection.jsx`)

- **Purpose**: Main search interface with multiple search modes
- **Features**:
  - Tabbed interface for different search types
  - Text search with query input
  - Image search with file upload
  - Caption generation
  - Results display with expandable details

##### 4. ImageResultCard (`src/components/ImageResultCard.jsx`)

- **Purpose**: Displays individual search results
- **Features**:
  - Image preview with fallback
  - Caption display with distance scores
  - Expandable details view
  - Responsive card layout

#### Common Components

##### 1. SearchControls (`src/components/common/SearchControls.jsx`)

- **Purpose**: Reusable search input controls
- **Features**:
  - Number of results slider
  - Show all images toggle
  - Text input for search queries
  - Image upload interface
  - Dynamic UI based on search type

##### 2. ActionButtons (`src/components/common/ActionButtons.jsx`)

- **Purpose**: Standardized action buttons
- **Features**:
  - Search/Generate buttons
  - Reset functionality
  - Loading states with progress indicators

##### 3. FileUploadArea (`src/components/common/FileUploadArea.jsx`)

- **Purpose**: Generic file upload component
- **Features**:
  - Drag-and-drop support
  - File validation
  - Multiple file support
  - Progress feedback

##### 4. ProgressIndicator (`src/components/common/ProgressIndicator.jsx`)

- **Purpose**: Loading and progress states
- **Features**:
  - Circular progress indicators
  - Linear progress bars
  - Customizable messages

##### 5. ImagePreviewCard (`src/components/common/ImagePreviewCard.jsx`)

- **Purpose**: Image preview with remove functionality
- **Features**:
  - Thumbnail display
  - Remove button
  - File information

##### 6. SnakeGame (`src/components/common/SnakeGame.jsx`)

- **Purpose**: Entertainment component for loading states
- **Features**:
  - Simple snake game
  - Keyboard controls
  - Score tracking

## State Management

### Component State

Each component manages its own local state using React hooks:

#### SearchSection State

```javascript
const [searchType, setSearchType] = useState(0); // 0: text, 1: image, 2: caption
const [query, setQuery] = useState("");
const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [searching, setSearching] = useState(false);
const [results, setResults] = useState([]);
const [error, setError] = useState(null);
const [numImages, setNumImages] = useState(5);
const [showAllImages, setShowAllImages] = useState(false);
const [captionResults, setCaptionResults] = useState([]);
```

### Data Flow

#### Search Operations

##### Text Search Flow

1. User enters query in text field
2. Clicks search or presses Enter
3. Component calls `handleTextSearch()`
4. Axios POST to `/api/search_text` with query and top_k
5. Results processed and grouped by image
6. Results displayed in grid layout

##### Image Search Flow

1. User selects image file
2. File converted to FormData
3. Axios POST to `/api/search_image` with file and top_k
4. Results processed and displayed

##### Caption Generation Flow

1. User selects image file
2. Axios POST to `/api/get_captions` with file
3. Captions displayed as chips
4. Image automatically indexed for future searches

## API Integration

### Axios Configuration

```javascript
const API_BASE_URL = "http://localhost:8000/api";

// Example API calls
const response = await axios.post(`${API_BASE_URL}/search_text`, {
  query: query.trim(),
  top_k: showAllImages ? 50 : numImages,
});

const formData = new FormData();
formData.append("file", selectedImage);
formData.append("top_k", showAllImages ? 50 : numImages);
const response = await axios.post(`${API_BASE_URL}/search_image`, formData, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

### Error Handling

- Network errors caught and displayed as alerts
- Invalid responses handled gracefully
- Loading states prevent multiple simultaneous requests

## UI/UX Design

### Material-UI Theme

- Consistent color palette
- Typography hierarchy
- Responsive breakpoints
- Dark/light mode support (extensible)

### Responsive Design

- Mobile-first approach
- Grid layouts for results
- Flexible card components
- Touch-friendly interactions

### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

## File Structure

```bash
frontend/src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── ActionButtons.jsx
│   │   ├── FileUploadArea.jsx
│   │   ├── ImagePreviewCard.jsx
│   │   ├── ProgressIndicator.jsx
│   │   ├── SearchControls.jsx
│   │   └── SnakeGame.jsx
│   ├── ImageResultCard.jsx
│   ├── SearchSection.jsx
│   └── UploadSection.jsx
├── App.jsx
├── main.jsx
└── theme.js (if exists)
```

## Key Features

### Search Functionality

#### Text Search

- Real-time query input
- Semantic understanding via CLIP embeddings
- Results ranked by similarity score
- Grouped results by image with multiple captions

#### Image Search

- File upload with preview
- Similarity search using image embeddings
- Configurable number of results
- "Show all images" toggle for unlimited results

#### Caption Generation

- Automatic caption creation
- Multiple captions per image
- Real-time indexing of new images

### User Experience

#### Loading States

- Progress indicators during API calls
- Disabled buttons during processing
- Clear feedback for all operations

#### Error Handlings

- User-friendly error messages
- Graceful fallbacks for failed operations
- Network error recovery

#### Image Display

- Optimized image loading
- Fallback placeholders
- Responsive image sizing
- Expandable result details

## Performance Optimizations

### Image Handling

- Lazy loading for result images
- Base64 preview generation for uploads
- Efficient file validation

### Component Optimization

- React.memo for expensive components
- useCallback for event handlers
- Minimal re-renders through proper state management

### Bundle Optimization

- Code splitting (future enhancement)
- Tree shaking via Vite
- Optimized imports

## Browser Support

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements

- ES6+ support
- File API for uploads
- Canvas API for image processing

## Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5173 (or next available port)
```

### Build for Production

```bash
npm run build
npm run preview
```

## Testing Strategy

### Component Testing

- Unit tests for individual components
- Mock API responses
- Event handler testing

### Integration Testing

- End-to-end search workflows
- File upload validation
- Error state handling

### Manual Testing Checklist

- [ ] Text search returns relevant results
- [ ] Image search works with various file formats
- [ ] Caption generation produces coherent text
- [ ] Responsive design on mobile devices
- [ ] Error states display appropriate messages
- [ ] Loading states prevent user confusion

## Future Enhancements

### Planned Features

- User authentication and image collections
- Advanced filtering options
- Image comparison tools
- Batch operations
- Export functionality

### Technical Improvements

- React Query for better data fetching
- Redux Toolkit for complex state management
- PWA capabilities
- Offline support

## Troubleshooting

### Common Issues

#### API Connection Problems

- Verify backend server is running on port 8000
- Check CORS configuration
- Ensure correct API endpoints

#### Image Upload Issues

- Validate file formats (JPEG, PNG, etc.)
- Check file size limits
- Verify File API support

#### Performance Issues

- Monitor network requests
- Check for memory leaks
- Optimize image loading

### Debug Mode

- Browser developer tools for network inspection
- React DevTools for component debugging
- Console logging for API responses

## Deployment

### Build Process

```bash
npm run build
# Output in dist/ directory
```

### Environment Variables

```javascript
// .env file
VITE_API_BASE_URL=http://your-api-domain.com/api
```

### Static Hosting

- Deploy `dist/` folder to any static host
- Configure API proxy if needed
- Set up proper CORS headers on backend

## Contributing

### Code Style

- ESLint configuration
- Prettier for code formatting
- Consistent naming conventions
- Component composition patterns

### Best Practices

- Functional components with hooks
- Proper prop types (future: TypeScript migration)
- Accessibility considerations
- Performance optimizations

This documentation provides a comprehensive guide for developers working with the CBVIRS frontend application, covering architecture, components, API integration, and development practices.
