import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from '../Cart/CartDrawer';
import Analytics from '../Analytics/Analytics';
import { useAuthStore } from '../../stores/authStore';

export default function Layout() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    if (localStorage.getItem('token') && !user) fetchUser();
  }, [fetchUser, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Analytics />
      <Header/>
      <MobileNav/>
      <CartDrawer/>
      <main className="flex-1 w-full">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  );
}
