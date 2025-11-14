# Site360 - Property Inspection App
## Product Requirements Document v2.0

---

## 1. Executive Summary

Site360 is a comprehensive mobile application designed for property tax professionals to conduct thorough property inspections, manage property portfolios, and maintain detailed inspection records. The app streamlines the inspection process with advanced features including photo annotation, AR-assisted measurements, voice dictation, and intelligent property management.

---

## 2. Product Overview

### 2.1 Vision
To provide property tax professionals with a mobile-first, intuitive platform that simplifies property inspections while maintaining detailed, accurate records for tax assessment purposes.

### 2.2 Target Users
- Property tax assessors
- Property inspection professionals
- Real estate appraisers
- Property management firms

### 2.3 Key Value Propositions
- Streamlined property inspection workflow
- Advanced photo annotation capabilities
- AR-assisted room measurements
- Comprehensive property portfolio management
- Intelligent favorites and bookmarking system

---

## 3. Core Features

### 3.1 Authentication & Onboarding

#### Welcome Screen
- Clean, branded welcome interface
- Smooth transition to login

#### Login Screen
- Split background design (50/50 navy blue top, light gray bottom)
- Site360 branding prominently displayed
- White form container with rounded corners
- Email and password authentication
- Bottom rounded corners matching home screen aesthetic (24px radius)

### 3.2 Home Screen

#### Header
- Navy blue background (#1e3a5f)
- Rounded bottom corners (24px radius)
- Search functionality
- Filter options for property types

#### Property Discovery
- **Featured Properties Section**
  - Horizontal scrollable cards
  - Property images
  - Price display
  - Quick favorite/bookmark action
  - Client/company name display

- **Recent Inspections Section**
  - Horizontal scrollable inspection cards
  - Inspection status indicators
  - Property thumbnails
  - Document icon for inspection details
  - Date of inspection
  - "View All" navigation to detailed list

- **Nearby Properties Section**
  - Properties geographically close to user
  - Distance indicators
  - Quick access to property details
  - "View All" navigation

#### Navigation
- Floating navigation bar with glassmorphism effect
- Active page indicator (navy blue circular background)
- Five navigation items:
  1. Home (house icon)
  2. Favorites (heart icon)
  3. New Inspection (plus circle icon - center, larger)
  4. Your Inspections (clipboard-document-check icon)
  5. Profile (user icon)

### 3.3 Property Management

#### Property Details Screen
- **Header**
  - Full-width property image
  - Back button (top left)
  - Bookmark button (top right)
  - Image carousel indicators

- **Property Information Card**
  - Navy blue background with rounded top corners
  - Unique office building name (e.g., "Van Ness Executive Plaza")
  - Location with map pin icon
  - Client/company name with briefcase icon
  - Property description with "Read More" expansion

- **Property Features Badges**
  - Square footage (with square icon)
  - Year built (with calendar icon)
  - Property type (with building icon)
  - Unit count (with cube icon)
  - Horizontally scrollable

- **Pricing & Action**
  - Current assessed value
  - Valuation date
  - "Inspect Property" CTA button

#### Property Database
Properties include:
- 2550 Van Ness Ave - Van Ness Executive Plaza - $3,450,000 - 24 units
- 456 Oak Ave - Oak Street Corporate Center - $3,200,000 - 18 units
- 789 Pine Blvd - Pine Boulevard Tower - $2,650,000 - 32 units
- 1425 Market St - Market Street Business Hub - $2,950,000 - 28 units
- 3210 Fillmore St - Fillmore Financial Complex - $4,100,000 - 42 units
- 875 Lombard St - Lombard Professional Suites - $3,750,000 - 36 units

### 3.4 Favorites System

#### Functionality
- Context-based favorites management using React Context
- Persistent favorites across app sessions
- Heart icon toggles (outline ↔ solid)
- Visual feedback on favorite/unfavorite actions

#### Favorites Screen
- Navy blue header with rounded bottom corners
- Property count display
- List view of favorited properties
- Each card shows:
  - Property thumbnail
  - Price badge overlay
  - Address with map pin
  - Client name with briefcase icon
  - Inspection status with checkmark icon
  - Heart icon for quick unfavorite
- Empty state with centered icon and messaging
- Floating navigation bar

### 3.5 Inspection Management

#### Inspection Detail Screen
- **Header Section**
  - Property ID display
  - Address information
  - Back navigation

- **Inspector Information**
  - Inspector name field
  - Inspection date picker with calendar icon
  - Date selection modal with smooth animations

- **Notes Section**
  - Multi-line text input
  - Voice dictation capability
  - Microphone icon with recording indicator
  - Real-time transcription display

- **Photo Management**
  - Add photo button with camera icon
  - Photo grid display
  - Each photo card includes:
    - Thumbnail preview (tappable to open full viewer)
    - Editable filename (tap to edit)
    - Location field (default: "Location N/A")
    - Tag count display (e.g., "3 tags")
    - Paintbrush icon for annotation access
    - Remove button (minus circle icon)

#### Photo Annotation System
- **Tap-to-Place Markers**
  - Tap anywhere on image to place annotation marker
  - Sequential letter labels (A, B, C, etc.)
  - Yellow circular markers with letters
  - Draggable markers for repositioning

- **Annotation Panel**
  - Slides up from bottom (70% screen height)
  - List of all annotations
  - Each annotation shows:
    - Letter label
    - Description text field
    - Delete option
  - Save/close functionality

- **Image Viewer**
  - Full-screen image display (75% screen height)
  - Editable filename at top
  - Annotation markers overlaid
  - Pan and zoom capabilities
  - Close button

#### Room Measurements
- **Manual Entry Mode**
  - Length input (feet and inches / meters and cm)
  - Width input (feet and inches / meters and cm)
  - Height input (feet and inches / meters and cm)
  - Unit toggle (US / International)
  - Multiple room support

- **AR Mode**
  - AR-assisted room mapping
  - "Room Mapped" status indicator
  - Automatic dimension capture

- **Room Management**
  - Add multiple rooms
  - Room name labels
  - Measurement summary display
  - Remove room functionality

### 3.6 Navigation Screens

#### Nearby Properties Screen
- Navy blue header with rounded corners
- Property count subtitle
- Vertical list of nearby properties
- Each property card:
  - Property image (120x120)
  - Price badge overlay
  - Address (split display: street / city, state)
  - Client name
  - Status indicator
  - Heart icon for favoriting
- Floating navigation bar

#### Recent Inspections Screen
- Similar layout to Nearby Properties
- Displays inspection-specific information:
  - Inspection images
  - Property prices
  - Inspection dates
  - Inspector names
  - Status indicators
- Active "Home" indicator in nav bar

#### Your Inspections Screen
- Dedicated screen for user's personal inspections
- Same layout as Recent Inspections
- Active "Clipboard" indicator in nav bar
- Loads inspection data from storage
- Empty state support

### 3.7 Profile Screen

#### Profile Header
- White background
- User profile image (circular, 140px diameter)
- User name (Grace Lee)
- Location (San Francisco, CA) with map pin
- Organization (Property Tax Practice) with users icon

#### Account Section
- Edit Profile option with user icon
- Security settings with shield icon
- Privacy settings with lock icon
- Log Out with arrow icon

#### Support & Policies Section
- Help & Support with question mark icon
- Terms and Policies with information icon

#### Actions Section
- Report a Problem with flag icon

#### Navigation
- Floating nav bar
- Active "Profile" indicator (user icon with navy background)

---

## 4. Design System

### 4.1 Color Palette
- **Primary Navy**: #1e3a5f (headers, active states, CTAs)
- **Background Light**: #f8fafc (main background)
- **White**: #ffffff (cards, containers)
- **Text Primary**: #1e293b (headings)
- **Text Secondary**: #64748b (body text, icons)
- **Border/Divider**: #f1f5f9
- **Accent Blue**: #2563eb (primary actions)
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444

### 4.2 Typography
- **Font Family**: System default
- **Header Large**: 32px, weight 700
- **Header Medium**: 24px, weight 700
- **Header Small**: 20px, weight 700
- **Body Large**: 16px, weight 500
- **Body Medium**: 15px, weight 400
- **Body Small**: 14px, weight 400
- **Caption**: 11px, weight 700

### 4.3 Spacing & Layout
- **Border Radius**:
  - Cards: 16px
  - Buttons: 20-24px
  - Header bottom: 24px
  - Badges: 12px
- **Shadows**: Consistent elevation system using shadowOffset, shadowOpacity
- **Padding**: 12px, 16px, 20px, 24px, 32px scale
- **Gap**: 8px, 12px, 16px, 20px scale

### 4.4 Components

#### Floating Navigation Bar
- Position: Absolute, 32px from bottom
- Blur effect with glassmorphism
- Rounded: 24px border radius
- 5 evenly spaced navigation items
- Active state: Navy circular background (48x48px)
- Inactive state: Gray icon color

#### Property Cards
- White background
- 16px border radius
- Shadow effect
- Image section (120x120px or full width)
- Info section with icon-text pairs
- Price badge overlay
- Heart icon for favorites

#### Headers
- Navy blue background
- Rounded bottom corners (24px)
- White text
- Consistent padding (60px top, 20px horizontal, 24px bottom)
- Optional subtitle

#### Badges/Chips
- White background with colored icons
- Rounded: 12px
- Padding: 16px horizontal, 12px vertical
- Icon + text layout
- Horizontally scrollable when multiple

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Framework**: React Native
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack)
- **State Management**: React Context API
- **Icons**: react-native-heroicons
- **UI Effects**: @react-native-community/blur
- **Date/Time**: @react-native-community/datetimepicker
- **Voice**: @react-native-voice/voice (ready for integration)
- **Storage**: AsyncStorage for persistence

### 5.2 Key Dependencies
```json
{
  "@react-native-community/blur": "BlurView effects",
  "@react-navigation/native": "Navigation framework",
  "@react-navigation/native-stack": "Stack navigation",
  "react-native-heroicons": "Icon library",
  "@react-native-community/datetimepicker": "Date selection",
  "@react-native-voice/voice": "Voice recognition"
}
```

### 5.3 Screen Navigation Structure
```
- Welcome Screen
- Login Screen
- Home Screen
  ├─ Property Details
  ├─ Nearby Properties (View All)
  ├─ Recent Inspections (View All)
  └─ Inspection Detail
     └─ Annotation Panel
     └─ Image Viewer
     └─ Measurement Panel
- Favorites Screen
  └─ Property Details
- Your Inspections Screen
  └─ Inspection Detail
- Profile Screen
```

### 5.4 Data Models

#### Inspection Type
```typescript
interface Inspection {
  id: string;
  propertyId: string;
  address: string;
  inspectorName: string;
  inspectionDate: Date;
  status: 'draft' | 'completed' | 'in-progress' | 'synced';
  notes: string;
  photos: Photo[];
  floorPlan?: FloorPlan;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Photo Type
```typescript
interface Photo {
  id: string;
  uri: any;
  filename: string;
  annotations: Annotation[];
}
```

#### Annotation Type
```typescript
interface Annotation {
  x: number;
  y: number;
  letter: string;
  description: string;
}
```

#### Room Type
```typescript
interface Room {
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'feet' | 'meters';
  };
}
```

### 5.5 Context Providers
- **FavoritesContext**: Manages favorited properties state across the app
  - `favoritedProperties`: Set of property IDs
  - `toggleFavorite(propertyId)`: Add/remove from favorites
  - `isFavorited(propertyId)`: Check favorite status

---

## 6. User Flows

### 6.1 Property Inspection Flow
1. User logs in → Home Screen
2. Browses properties → Selects property
3. Views property details → Taps "Inspect Property"
4. Enters inspection details (date, inspector name)
5. Adds photos → Annotates photos with markers
6. Adds room measurements (manual or AR)
7. Saves inspection → Returns to Home

### 6.2 Property Favoriting Flow
1. User sees property card (any screen)
2. Taps heart icon
3. Heart fills solid red
4. Property added to Favorites screen
5. Can unfavorite from property card or Favorites screen

### 6.3 Photo Annotation Flow
1. User uploads photo in inspection
2. Taps paintbrush icon on photo
3. Image viewer opens at 75% height
4. Taps location on image → Marker placed with letter
5. Enters description for marker
6. Repeats for additional annotations
7. Saves and returns to inspection detail

---

## 7. Future Enhancements

### 7.1 Planned Features
- Cloud sync for inspections
- Offline mode with sync when online
- PDF export of inspection reports
- Team collaboration features
- Advanced analytics dashboard
- Location-based automatic check-in
- Photo metadata extraction (GPS, timestamp)
- Integration with property tax databases
- Multi-language support
- Dark mode

### 7.2 Technical Improvements
- Performance optimization for large image sets
- Improved AR measurement accuracy
- Enhanced voice recognition with custom commands
- Real-time collaboration on inspections
- Advanced search and filtering
- Property comparison feature
- Historical data tracking

---

## 8. Success Metrics

### 8.1 Key Performance Indicators
- User engagement: Daily/weekly active users
- Inspection completion rate
- Average inspection time
- Photo annotations per inspection
- User retention rate (30-day, 90-day)
- App crash rate
- Average app rating

### 8.2 User Satisfaction Metrics
- Feature adoption rates
- Time to complete inspection
- Number of inspections per user per week
- Favorites usage rate
- Voice dictation usage rate
- AR measurement adoption

---

## 9. Appendix

### 9.1 Icon Reference
All icons use react-native-heroicons library with consistent sizing:
- Navigation icons: 28-32px
- Action icons: 20-24px
- Info icons: 14-16px
- All have outline and solid variants where applicable

### 9.2 Animation Guidelines
- Panel slides: 300ms duration with easing
- Fade transitions: 200ms
- Button press: scale(0.95) feedback
- Navigation transitions: Native stack defaults

### 9.3 Accessibility Considerations
- Touch targets minimum 44x44px
- High contrast text on backgrounds
- Semantic icon usage with clear purposes
- Form validation with clear error messages
- Keyboard accessibility for all inputs

---

**Document Version**: 2.0
**Last Updated**: November 2025
**Status**: Current Implementation
