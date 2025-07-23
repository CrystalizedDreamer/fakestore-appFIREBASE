import { configureStore, createSlice } from '@reduxjs/toolkit';

// Example: products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action) => {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});
// --- Cart Persistence Helpers ---
function loadCartFromSession() {
  try {
    const data = sessionStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveCartToSession(cart) {
  try {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  } catch {
    // Ignore write errors
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromSession(),
  reducers: {
    addToCart: (state, action) => {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => state.filter(item => item.id !== action.payload),
    incrementQuantity: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      // Remove item if quantity is 1 and decrement is called
      return state.filter(i => i.quantity > 0);
    },
    clearCart: () => [],
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;


export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
  },
});

// Subscribe to cart changes and persist to sessionStorage
store.subscribe(() => {
  const cart = store.getState().cart;
  saveCartToSession(cart);
});
