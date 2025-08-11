import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/theme-provider'
import { UserProvider } from './context/UserContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
export const server = "http://localhost:5000";

export const categories = [
  "sayur",
  "buah",
  "herba",
  "teh",
  "kopi",
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
          <App/>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
