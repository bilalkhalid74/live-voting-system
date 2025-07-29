# 🌟 Live Voting System - America's Got Talent Style

A real-time voting application built with Next.js and React that allows audiences to vote for contestants during a live talent show. Features responsive design, localStorage persistence, error boundaries, and comprehensive testing.

## 🎯 Project Overview

This project was built as a technical assessment demonstrating:
- ✅ **Custom React Hooks** for voting logic and state management
- ✅ **Error Boundaries** for graceful failure handling
- ✅ **Responsive Design** that works seamlessly across all devices
- ✅ **localStorage Persistence** that survives page reloads
- ✅ **Real-time Updates** simulating live voting data
- ✅ **Comprehensive Testing** including critical localStorage tests
- ✅ **TypeScript** for type safety and better developer experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/bilalkhalid74/live-voting-system.git
cd live-voting-system

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🧪 Testing

### Run All Tests
```bash
# Run complete test suite
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Critical localStorage Test
```bash
# Run the specific localStorage persistence test (key requirement)
npm run test:critical

# Watch mode for critical test development
npm run test:critical:watch
```

This test validates:
- ✅ Vote button disables after voting
- ✅ Vote state persists after page reload  
- ✅ Multiple contestants maintain separate vote states
- ✅ localStorage errors are handled gracefully

## 🏗️ Architecture

### Project Structure
```
live-voting-system/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ContestantCard.tsx # Individual contestant display
│   │   ├── VoteButton.tsx     # Voting interface
│   │   ├── VotingStatus.tsx   # Voting window status
│   │   └── ErrorBoundary.tsx  # Error handling
│   ├── hooks/                 # Custom React hooks
│   │   ├── useLocalStorage.ts # localStorage wrapper
│   │   ├── useVoting.ts       # Voting logic per contestant
│   │   ├── useContestants.ts  # Contestant data management
│   │   ├── useVotingWindow.ts # Voting window timing
│   │   └── useRealTimeUpdates.ts # Live vote updates
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts          # Core type definitions
│   └── utils/                 # Utilities and constants
│       └── constants.ts       # Configuration constants
├── __tests__/                 # Test files
│   ├── critical-localstorage.test.tsx # Key requirement test
│   ├── hooks/                 # Hook unit tests
│   └── components/            # Component tests
└── README.md                  # This file
```

### Key Technologies
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library with hooks
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Jest + React Testing Library** - Testing framework
- **localStorage** - Client-side vote persistence

## 🎮 Features

### 🗳️ Voting System
- **Vote Limits**: 3 votes maximum per contestant per user
- **Real-time Feedback**: Immediate vote confirmation and error handling
- **Persistence**: Vote state survives browser refreshes and restarts
- **Visual Indicators**: Clear display of remaining votes and current totals

### ⏱️ Live Voting Window
- **Timed Sessions**: 5-minute voting windows with countdown
- **Auto-close**: Voting automatically disabled when time expires
- **Status Display**: Clear visual indicators for voting availability

### 📱 Responsive Design
- **Mobile-First**: Optimized for touch interfaces
- **Tablet Support**: Adapted layouts for medium screens
- **Desktop Enhanced**: Full-featured experience on large screens
- **Cross-Browser**: Works on Chrome, Firefox, Safari, and Edge

### 🛡️ Error Handling
- **Error Boundaries**: Graceful degradation when components fail
- **Network Simulation**: Handles simulated API failures (10% rate)
- **localStorage Fallbacks**: Continues working if storage fails
- **User Feedback**: Clear error messages and recovery options

### 🔄 Real-time Updates
- **Live Vote Counts**: Updates every 2 seconds during voting
- **Visual Feedback**: Loading indicators during updates
- **Smooth Animations**: Engaging transitions and hover effects

## 🎨 User Interface

### Design Highlights
- **Modern Gradient Background**: Purple-to-blue gradient theme
- **Card-based Layout**: Clean contestant cards with hover effects
- **Responsive Grid**: Adapts from 1 column (mobile) to 3 columns (desktop)
- **Accessibility**: WCAG 2.1 compliant with proper contrast and focus management
- **Smooth Animations**: CSS transitions for engaging interactions

### Interactive Elements
- **Vote Buttons**: Dynamic state display with heart icons
- **Progress Indicators**: Visual vote count displays
- **Status Badges**: Live/closed voting indicators
- **Countdown Timer**: Real-time voting window countdown

## 🧠 Custom Hooks

### `useVoting(contestantId)`
Manages voting state for individual contestants:
- Vote counting and limits
- localStorage persistence
- Loading and error states
- Vote submission simulation

### `useLocalStorage(key, initialValue)`
Type-safe localStorage wrapper:
- SSR-safe initialization
- Error handling and fallbacks
- JSON serialization
- TypeScript generics support

### `useVotingWindow()`
Manages voting window timing:
- Countdown timer
- Auto-close functionality
- Status tracking
- Time formatting

### `useRealTimeUpdates(contestants, setContestants)`
Simulates live vote updates:
- Interval-based updates
- Random vote increments
- Visual update indicators
- Proper cleanup

### `useContestants()`
Manages contestant data:
- Initial data loading
- State management interface
- Type-safe contestant handling

## 🔧 Configuration

### Voting Configuration (`src/utils/constants.ts`)
```typescript
export const VOTING_CONFIG = {
  MAX_VOTES_PER_CONTESTANT: 3,     // Vote limit per user
  VOTE_SUBMISSION_DELAY: 500,      // Simulated API delay (ms)
  FAILURE_RATE: 0.1,               // Simulated failure rate (10%)
  UPDATE_INTERVAL: 2000,           // Real-time update interval (ms)
  VOTING_DURATION: 300000,         // Voting window duration (5 min)
};
```

### Customization Options
- **Vote Limits**: Adjust `MAX_VOTES_PER_CONTESTANT`
- **Timing**: Modify `UPDATE_INTERVAL` and `VOTING_DURATION`
- **Reliability**: Change `FAILURE_RATE` for testing
- **Performance**: Tune `VOTE_SUBMISSION_DELAY`

## 📊 Testing Strategy

### Test Coverage
- **Unit Tests**: Individual hooks and utilities
- **Integration Tests**: Component interactions
- **Critical Flow Tests**: End-to-end voting scenarios
- **Error Boundary Tests**: Failure recovery validation

### Key Test Files
```bash
__tests__/
├── critical-localstorage.test.tsx    # Main requirement test
├── hooks/
│   ├── useLocalStorage.test.ts       # Storage hook tests
│   ├── useVoting.test.ts             # Voting logic tests
│   └── useContestants.test.ts        # Data management tests
└── components/
    ├── VoteButton.test.tsx           # Button interaction tests
    ├── ContestantCard.test.tsx       # Card component tests
    └── ErrorBoundary.test.tsx        # Error handling tests
```

### Critical Test Validation
The `critical-localstorage.test.tsx` specifically validates:
1. **Vote Persistence**: Votes survive page reloads
2. **Button State**: Disabled state persists correctly
3. **Multiple Contestants**: Independent vote tracking
4. **Error Handling**: Graceful localStorage failure handling

## 🚀 Performance Optimizations

### React Optimizations
- **React.memo**: ContestantCard and VoteButton memoized
- **useCallback**: Event handlers optimized
- **Component Isolation**: Error boundaries prevent cascade failures
- **Efficient Re-renders**: Strategic state management

### Next.js Optimizations
- **App Router**: Modern routing with better performance
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic bundle optimization
- **Tree Shaking**: Unused code elimination

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Recovery**: Retry mechanisms for failures
- **Responsive Images**: Optimized for different screen sizes
- **Smooth Animations**: CSS transitions for engagement

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation**: All user inputs validated
- **XSS Prevention**: React built-in protection
- **Rate Limiting**: Vote submission delays
- **Data Sanitization**: Safe data handling

### Vote Integrity
- **Local Limits**: Client-side vote enforcement
- **Tamper Resistance**: Basic localStorage protection
- **Error Handling**: Secure error message display

## 📈 Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Support
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Android Browser**: Latest versions

### Required Features
- **ES2020**: Modern JavaScript features
- **localStorage**: Client-side storage
- **CSS Grid/Flexbox**: Layout systems
- **Fetch API**: Network requests

## 📝 Documentation

### Complete Documentation Set
- **📋 Business Specification** (`docs/business-spec.md`)
  - Requirements, user stories, success criteria
- **🔧 Technical Specification** (`docs/technical-spec.md`)
  - Architecture, implementation details, API reference
- **📝 Prompts Log** (`docs/prompts-log.md`)
  - Complete development process with all prompts used

### API Reference
All custom hooks are fully documented with TypeScript interfaces and JSDoc comments.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build

# Serve static files from 'out' directory
# Upload to any static hosting service
```

### Environment Variables
No environment variables required for basic functionality.

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run test suite: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit pull request

### Code Standards
- **TypeScript**: All code must be typed
- **Testing**: Critical paths must have tests
- **Documentation**: Public APIs must be documented
- **Formatting**: Use Prettier and ESLint

## 📄 License

MIT License - see LICENSE file for details.

## 🎯 Job Assessment Compliance

This project specifically demonstrates the requested skills:

### ✅ Technical Requirements Met
- **Custom Hooks**: ✅ Isolated, reusable voting logic per contestant
- **Error Boundaries**: ✅ Fallback UIs for component failures  
- **Responsive Design**: ✅ Mobile, tablet, desktop optimization
- **Form Validation**: ✅ Vote limits and user feedback
- **Real-time Updates**: ✅ Simulated live data with polling
- **Clean Architecture**: ✅ Separation of concerns and testability
- **Error Handling**: ✅ Graceful degradation under failure

### ✅ Deliverables Completed
1. **✅ Business Specification**: Complete requirements document
2. **✅ Technical Specification**: Detailed implementation guide
3. **✅ All Prompts Used**: Complete development process log
4. **✅ Working Application**: Fully functional voting system
5. **✅ Critical localStorage Test**: Vote persistence validation
6. **✅ Git Repository**: Complete project with proper structure

### 🏆 Key Differentiators
- **Process Transparency**: Every prompt and decision documented
- **Production Quality**: Error handling, testing, documentation
- **Performance Focus**: Optimized React patterns and Next.js features
- **User Experience**: Engaging design with smooth interactions
- **Maintainability**: Clean code architecture with comprehensive docs

---

**Built with ❤️ using Next.js, React, and TypeScript**

For questions or support, please refer to the comprehensive documentation in the `docs/` directory or create an issue in the repository.