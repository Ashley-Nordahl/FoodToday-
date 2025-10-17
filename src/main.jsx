import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n' // Initialize i18n

// Override console methods to filter out React Router warnings
const originalConsoleWarn = console.warn
const originalConsoleError = console.error

console.warn = (...args) => {
  const message = args[0]
  if (typeof message === 'string') {
    // Filter out React Router warnings
    if (message.includes('React Router Future Flag') || 
        message.includes('v7_relativeSplatPath') ||
        message.includes('Relative route resolution') ||
        message.includes('BrowserRouter') ||
        message.includes('react-router-dom')) {
      return // Don't log these warnings
    }
  }
  originalConsoleWarn.apply(console, args)
}

console.error = (...args) => {
  const message = args[0]
  if (typeof message === 'string') {
    // Filter out React Router errors
    if (message.includes('React Router') || 
        message.includes('BrowserRouter') ||
        message.includes('react-router-dom')) {
      return // Don't log these errors
    }
  }
  originalConsoleError.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

