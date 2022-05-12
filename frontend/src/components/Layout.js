import React from 'react'
import {Outlet} from 'react-router-dom'
import {Header, Footer} from './layout/index'

export default function Layout() {
  return (
    <>
      <Header/>
      <Outlet/>     
      <Footer/>
    </>
  ) 
}
