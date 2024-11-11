import HeaderNavbar from '../../components/HeaderNavbar/HeaderNavbar'
import Footer from '../../components/Footer/Footer'

function ClientPage({ children }) {
  return (
    <div>
      <HeaderNavbar />
      {children}
      <Footer />
    </div>
  )
}

export default ClientPage