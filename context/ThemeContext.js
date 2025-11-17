// Compatibility shim for ThemeContext while dark mode is removed.
// Exports a no-op ThemeProvider and a harmless `useTheme` hook so
// components that still import them won't crash while we clean up
// remaining references across the codebase.

'use client';

import React from 'react';

export function ThemeProvider({ children }) {
	return <>{children}</>;
}

export function useTheme() {
	return { theme: 'light', toggleTheme: () => {} };
}

// Flag for any scripts that check the old placeholder.
export const __THEME_REMOVED = true;
