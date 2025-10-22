# AktivTracker Frontend

A modern Vue.js 3 frontend application for tracking job applications, scholarships, and activities.

## Features

- **User Authentication**: Login, registration, password reset with Google OAuth
- **Job Tracking**: Manage job applications with status tracking
- **Scholarship Management**: Track scholarship applications and deadlines
- **Activity Logging**: Record and monitor various activities
- **Document Management**: Upload and manage application documents
- **Analytics Dashboard**: View insights and statistics
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Composition API** - Modern Vue.js development approach
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **PrimeVue** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API requests

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KimutaiLawrence/aktivtrackersoftware.git
   cd aktivtrackersoftware
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```bash
   # .env.local
   VITE_API_BASE_URL=https://aktivtrackerbackend.onrender.com
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Environment Variables**
   ```bash
   VITE_API_BASE_URL=https://aktivtrackerbackend.onrender.com
   ```

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/                 # API service modules
│   ├── auth.js         # Authentication API
│   ├── users.js        # User management API
│   ├── jobs.js         # Job applications API
│   ├── scholarships.js # Scholarship applications API
│   └── activities.js   # Activities API
├── components/         # Reusable Vue components
├── layouts/           # Layout components
├── router/            # Vue Router configuration
├── stores/            # Pinia state management
├── views/             # Page components
├── assets/            # Static assets
└── utils/             # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- **ESLint** for code linting
- **Prettier** for code formatting
- **Vue.js 3 Composition API** for component development

## API Integration

The frontend integrates with the AktivTracker backend API:

- **Base URL**: `https://aktivtrackerbackend.onrender.com`
- **Authentication**: JWT token-based
- **CORS**: Configured for cross-origin requests

## Responsive Design

- **Mobile-first** approach
- **Tailwind CSS** for responsive utilities
- **PrimeVue** components for consistent UI
- **Dark mode** support

## Performance

- **Vite** for fast development and building
- **Code splitting** for optimal loading
- **Lazy loading** for routes and components
- **Optimized assets** and images

## License

This project is private and proprietary.

## Author

**Lawrence Kimutai**
- GitHub: [@KimutaiLawrence](https://github.com/KimutaiLawrence)
- Email: kimutai.lawrence19@students.dkut.ac.ke

---

**AktivTracker** - Your comprehensive application tracking solution.