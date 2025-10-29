# Disconnected

A horror-themed art gallery website inspired by Username:666, featuring dynamic categories and admin content management.

## 🚀 Features Implemented

### Core Gallery

- **Category Navigation**: Arts, Gifs, Sketches, Animes tabs
- **Chaotic Gallery View**: Random image sizing, rotation, and positioning for artistic mess
- **Post Cards**: Large images with titles, descriptions, and creation dates
- **Responsive Design**: Works on all devices

### Horror Aesthetics

- **Username:666 Theme**: Blood reds (#ff1a1a), deep blacks (#111), glitchy effects
- **VHS Static Overlay**: Transparent noise animation layer
- **CRT Scanlines**: Retro display effects
- **Glitch Transitions**: Fade animations and old UI flickers
- **Dynamic Backgrounds**: Random images from Supabase bucket

### Admin Panel

- **Supabase Authentication**: Email/password login
- **Horror-Themed Forms**: 550x650px fixed dimensions, glitch borders
- **Content Upload**: Title, description, image file upload → ImgBB → Supabase
- **Date Management**: Manual creation date setting
- **Toast Notifications**: Real-time feedback for all actions

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx        # Category navigation with hover effects
│   ├── PostCard.tsx      # Large image + metadata display
│   ├── Sidebar.tsx       # Suggested posts previews
│   ├── Footer.tsx        # Glitchy copyright text
│   ├── VHSOverlay.tsx    # Static noise animation
│   └── LoadingGlitch.tsx # Horror loading spinner
├── pages/
│   ├── Home.tsx          # Gallery overview page
│   ├── Category.tsx      # Individual category display
│   ├── Login.tsx         # Admin authentication (horror form)
│   └── Admin.tsx         # Content management (horror form)
├── lib/
│   └── supabaseClient.ts # Database connection
└── styles/
    └── globals.css       # Horror theme styling
```

## 🛠️ Tech Used

- **React** + **Vite** - Fast modern development
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Supabase** - Database, storage, auth
- **ImgBB API** - Image hosting
- **React Router** - Client-side navigation
- **React Hot Toast** - Notification system

## 🎮 How It Works

### Gallery Experience

1. Browse chaotic home gallery with all artworks
2. Use tabs to filter by category (arts/gifs/sketches/animes)
3. View individual posts with metadata
4. Random background changes on refresh

### Admin Management

1. Access via hidden footer link or `/login` URL
2. Login with Supabase credentials
3. Upload images (auto-stored on ImgBB)
4. Set title, description, category, date
5. Real-time toast confirmations

## 🎨 Design System

- **Colors**: Blood red (#ff1a1a), deep black (#111), dark greys
- **Fonts**: Fallback system (Screenfont_8_Sans intended)
- **Effects**: VHS static, CRT flicker, glitch animations, blood drip hovers
- **Layout**: Chaotic gallery, fixed-dimension forms (550x650px)
