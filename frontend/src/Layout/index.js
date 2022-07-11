import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ recentVersion }) {
  return (
    <>
      <Header recentVersion={recentVersion} />
      <Outlet />
      <Footer />
    </>
  )
}
