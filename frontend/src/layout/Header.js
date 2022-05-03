import React from 'react'
import {Container, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <header className='header'>
      <Container className='header-container'>
        <Link to='/' className='logo-wrap'>
          <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/KWANGDONG.png`} />
        </Link>
        <Link to="/board">Ban-Pick</Link >
        <Link to="/statistics">Match analysis</Link >
      </Container>
    </header>
    
  )
}
