import HeaderNavbar from '../../components/HeaderNavbar/HeaderNavbar'
import Footer from '../../components/Footer/Footer'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ClientPage({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <HeaderNavbar />
      {children}
      <Footer />
    </div>
  )
}

export default ClientPage