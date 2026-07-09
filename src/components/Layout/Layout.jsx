import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import CartDrawer from '../Cart/CartDrawer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
