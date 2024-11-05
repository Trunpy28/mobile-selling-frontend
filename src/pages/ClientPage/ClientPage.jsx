import React from 'react'
import HeaderNavbar from '../../components/HeaderNavbar/HeaderNavbar'

function ClientPage({children}) {
  return (
    <div>
      <HeaderNavbar />
      {children}
    </div>
  )
}

export default ClientPage