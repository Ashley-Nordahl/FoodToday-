# FoodToday 🍽️

A modern, beautiful web application for exploring dishes, drinks, sauces, and food-related meetups.

## Features

- **DishToday** 🍽️ - Browse through a variety of delicious dishes
- **Drink** 🥤 - Discover refreshing beverages
- **Sauce** 🍯 - Explore flavorful sauces to complement your meals
- **Parties** 🎉 - Book catering services for special occasions and events
- **MyFavorite** ❤️ - Save and manage your favorite items

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with modern CSS features

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features in Detail

### Favorites System
- Add items to your favorites by clicking the heart icon
- Favorites are persisted in localStorage
- View all your favorites in one place on the MyFavorite page

### Party Booking System
- Book catering services for special occasions
- Track your party bookings
- View party details including pricing, duration, and categories

### Responsive Design
- Mobile-first approach
- Seamless experience across all devices
- Modern, clean UI with smooth animations

## Project Structure

```
FoodToday/
├── src/
│   ├── pages/
│   │   ├── DishToday.jsx
│   │   ├── Drink.jsx
│   │   ├── Sauce.jsx
│   │   ├── Parties.jsx
│   │   └── MyFavorite.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Design Philosophy

The app features a modern, vibrant design with:
- Gradient color schemes (orange to yellow)
- Card-based layouts
- Smooth hover effects and animations
- Clean typography using Poppins font
- Intuitive navigation

## License

MIT

---

Made with ❤️ and 🍕

