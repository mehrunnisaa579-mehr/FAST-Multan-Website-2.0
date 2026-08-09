import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';

export default function SiteLayout() {
  return (
    <div className="min-h-screen bg-white text-[#222222] flex flex-col relative">
      <TopBar />
      <Header />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
