import { create } from 'zustand';

// Small UI-only store for cross-cutting layout state (cart drawer, mobile
// nav) that doesn't belong in either the cart or auth domain stores.
export const useUiStore = create((set) => ({
  isCartOpen: false,
  isMobileNavOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen }))
}));
