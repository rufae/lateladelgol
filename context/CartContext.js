'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  CLEAR_CART: 'CLEAR_CART'
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const item = action.payload;
      const exists = state.find(i => i.id === item.id);
      if (exists) {
        return state.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...state, item];
    }
    case ACTIONS.REMOVE_ITEM:
      return state.filter(i => i.id !== action.payload.id);
    case ACTIONS.UPDATE_QTY:
      return state.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i);
    case ACTIONS.CLEAR_CART:
      return [];
    default:
      return state;
  }
}

const LS_KEY = 'lateladelgol_cart_v1';

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {}
  }, [state]);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

export function useCartState() {
  const ctx = useContext(CartStateContext);
  if (ctx === undefined) throw new Error('useCartState must be used within CartProvider');
  return ctx;
}

export function useCartDispatch() {
  const ctx = useContext(CartDispatchContext);
  if (ctx === undefined) throw new Error('useCartDispatch must be used within CartProvider');
  return ctx;
}

// Helper functions
export function addItem(dispatch, item) {
  dispatch({ type: ACTIONS.ADD_ITEM, payload: item });
}

export function removeItem(dispatch, id) {
  dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { id } });
}

export function updateQuantity(dispatch, id, quantity) {
  dispatch({ type: ACTIONS.UPDATE_QTY, payload: { id, quantity } });
}

export function clearCart(dispatch) {
  dispatch({ type: ACTIONS.CLEAR_CART });
}

export function useCart() {
  const state = useCartState();
  const dispatch = useCartDispatch();

  const total = state.reduce((sum, it) => sum + (Number(it.precio || 0) * Number(it.quantity || 1)), 0);

  return {
    items: state,
    dispatch,
    total,
    addItem: (item) => addItem(dispatch, item),
    removeItem: (id) => removeItem(dispatch, id),
    updateQuantity: (id, qty) => updateQuantity(dispatch, id, qty),
    clear: () => clearCart(dispatch)
  };
}

