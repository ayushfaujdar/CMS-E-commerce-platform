import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.cart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (productId, size, quantity = 1) => {
    const { data } = await api.post('/cart', { productId, size, quantity });
    setItems(data.cart);
  };
  const update = async (productId, size, quantity) => {
    const { data } = await api.put('/cart', { productId, size, quantity });
    setItems(data.cart);
  };
  const remove = async (productId, size) => {
    const { data } = await api.delete('/cart/item', { data: { productId, size } });
    setItems(data.cart);
  };
  const clear = async () => {
    await api.delete('/cart');
    setItems([]);
  };

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.finalPrice || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, loading, refresh, add, update, remove, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
