import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ChatBubble from './components/ChatBubble';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import { CartProvider } from './contexts/CartContext';

export default function App() {
  const [checkout, setCheckout] = useState(false);
  const [admin, setAdmin] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar onAdmin={() => setAdmin(true)} />
        <main className="flex-1">
          <Shop />
        </main>
        <Footer />
      </div>

      <CartDrawer onCheckout={() => setCheckout(true)} />
      <ChatBubble />

      {checkout && <Checkout onClose={() => setCheckout(false)} />}
      {admin && <Admin onClose={() => setAdmin(false)} />}
    </CartProvider>
  );
}
