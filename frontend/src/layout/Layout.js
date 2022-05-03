import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {Link, Outlet} from 'react-router-dom'
import {Header, Footer} from './index'

export default function Layout() {
  return (
    <>
      <Header/>
      <Outlet/>     
      <Footer/>
    </>
  ) 
}
