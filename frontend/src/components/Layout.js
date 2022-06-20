import React from 'react'
import {Outlet} from 'react-router-dom'
import {Header, Footer} from './layout/index'

export default function Layout({recentVersion}) {
  return (
    <>
      <Header recentVersion={recentVersion}/>
      <Outlet/>     
      <Footer/>
    </>
  ) 
}
