import React from 'react'
import {Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'

export default function Header({recentVersion}) {
  return (
    <header className='header'>
      <Container id='header-container' className='header-container'>
        <Link to='/' className='logo-wrap'>
          <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/KDF.png`} />
        </Link>
        <Link to="/board">Ban-Pick</Link >
        <Link to="/analysis">Match analysis</Link >
        <span>{`Patch version - ${recentVersion}`}</span>
      </Container>
    </header>
    
  )
}
