'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar wishlist desde localStorage al iniciar
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved = localStorage.getItem('lateladelgol_wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  // Guardar en localStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lateladelgol_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, loading]);

  const addToWishlist = (producto) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === producto.id)) {
        return prev; // Ya está en la wishlist
      }
      return [...prev, producto];
    });
  };

  const removeFromWishlist = (productoId) => {
    setWishlist(prev => prev.filter(p => p.id !== productoId));
  };

  const isInWishlist = (productoId) => {
    return wishlist.some(p => p.id === productoId);
  };

  const toggleWishlist = (producto) => {
    if (isInWishlist(producto.id)) {
      removeFromWishlist(producto.id);
    } else {
      addToWishlist(producto);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
