# SmartHabit Pro - Gamified Habit Tracker

A modern, professional habit tracking application with gamification, social features, and real-time data synchronization.

## 🚀 Features

### Core Features
- **Smart Habit Tracking**: Create, track, and manage habits with flexible scheduling
- **Gamification System**: Earn XP, level up, unlock achievements, and maintain streaks
- **Real-time Analytics**: Detailed progress charts and insights
- **Social Features**: Friend challenges, leaderboards, and community motivation
- **Cross-platform**: Responsive design that works on desktop, tablet, and mobile

### Professional Features
- **Enterprise Authentication**: Powered by Kinde for secure, scalable auth
- **Real-time Database**: Convex provides instant data synchronization
- **Modern UI/UX**: Glass morphism design with smooth animations
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized with lazy loading and efficient state management

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Responsive chart library

### Backend & Infrastructure
- **Convex** - Real-time database and backend-as-a-service
- **Kinde** - Enterprise-grade authentication and user management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd SmartHabit/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Convex (Get from https://dashboard.convex.dev)
VITE_CONVEX_URL=your_convex_deployment_url

# Kinde Auth (Get from https://app.kinde.com)
VITE_KINDE_CLIENT_ID=your_kinde_client_id
VITE_KINDE_DOMAIN=your_kinde_domain
VITE_KINDE_REDIRECT_URI=http://localhost:3000/dashboard
VITE_KINDE_LOGOUT_URI=http://localhost:3000
```

### 4. Set Up Convex Database

Install Convex CLI:
```bash
npm install -g convex
```

Initialize and deploy:
```bash
npx convex dev
```

This will:
- Create a new Convex project
- Deploy your schema and functions
- Provide your `VITE_CONVEX_URL`

### 5. Set Up Kinde Authentication

1. Go to [Kinde](https://app.kinde.com) and create an account
2. Create a new application
3. Configure redirect URLs:
   - **Allowed callback URLs**: `http://localhost:3000/dashboard`
   - **Allowed logout redirect URLs**: `http://localhost:3000`
4. Copy your credentials to `.env`

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components (navbar, sidebar)
│   └── features/       # Feature-specific components
├── pages/              # Page components
│   ├── Landing.jsx     # Landing page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Habits.jsx      # Habit management
│   ├── Analytics.jsx   # Progress analytics
│   ├── Social.jsx      # Social features
│   └── Settings.jsx    # User settings
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── lib/                # Third-party library configurations
└── styles/             # Global styles and themes
```

## 🎨 Design System

### Colors
- **Primary**: Purple gradient (#8b5cf6 to #7c3aed)
- **Secondary**: Pink accent (#ec4899 to #db2777)
- **Neutral**: Gray scale for text and backgrounds
- **Semantic**: Success (green), warning (yellow), error (red)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Tailwind's default scale (text-sm to text-7xl)
- **Weights**: 300 (light) to 800 (extra bold)

### Components
- **Glass morphism**: Backdrop blur with transparency
- **Rounded corners**: Consistent border radius
- **Shadows**: Layered shadow system
- **Animations**: Smooth micro-interactions

## 🔧 Configuration

### Theme Customization
Edit `tailwind.config.js` to customize colors, fonts, and other design tokens:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Database Schema
The Convex schema includes:
- **Users**: Profile, stats, preferences
- **Habits**: Habit definitions and settings
- **Completions**: Habit completion records
- **Categories**: Habit categorization
- **Achievements**: Gamification achievements
- **Friends**: Social connections
- **Challenges**: Social challenges

## 🚀 Deployment

### Frontend (Vercel Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database (Convex)
```bash
npx convex deploy --prod
```

### Environment Variables for Production
Update your `.env` for production:
```env
VITE_CONVEX_URL=https://your-production-convex-url
VITE_KINDE_DOMAIN=your-production-domain
VITE_KINDE_REDIRECT_URI=https://your-domain.com/dashboard
VITE_KINDE_LOGOUT_URI=https://your-domain.com
```

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Run Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📱 Mobile Responsiveness

The app is fully responsive with:
- **Mobile-first design**: Optimized for small screens
- **Touch interactions**: Proper touch targets and gestures
- **Progressive Web App**: Can be installed on mobile devices
- **Offline support**: Basic caching for core functionality

## 🔒 Security Features

- **Secure Authentication**: Kinde provides enterprise-grade security
- **Data Validation**: Client and server-side validation
- **HTTPS Only**: Enforced in production
- **Content Security Policy**: Prevents XSS attacks
- **Regular Updates**: Dependencies kept up to date

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Community**: Join our Discord server for discussions

## 🎯 Roadmap

### Near Term (1-2 months)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Habit templates and marketplace
- [ ] Team/organization features

### Medium Term (3-6 months)
- [ ] AI-powered habit recommendations
- [ ] Integration with fitness trackers
- [ ] Habit coaching and insights
- [ ] Premium subscription features

### Long Term (6+ months)
- [ ] API for third-party integrations
- [ ] Advanced social features
- [ ] Habit psychology insights
- [ ] White-label solutions

---

**Built with ❤️ by the SmartHabit team**