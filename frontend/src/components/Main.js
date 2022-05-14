import React from 'react'
import { Container } from 'react-bootstrap'

export default function Main() {
  return (
    <Container id="main-container">
      <div className="main-banner-wrap">
        <a href="http://freecs.gg/main/main.html" target='_blank'>
          <img className="main-banner" alt="main-banner" src={`${process.env.PUBLIC_URL}/assets/useful/KWANGDONG_banner.jpg`}/>
        </a>
      </div>
      <div className="spirit-img-wrap">
        <img className="spirit-img" alt="spirit-img" src={`${process.env.PUBLIC_URL}/assets/useful/spirit_coach_blur.png`}/>
        <div className="text-wrap">
          <span className="spirit__text">SPIRIT</span>
          <span className="spirit__text">KING IS BACK</span>
        </div> 
      </div>
      <div className="spirit-banner-wrap">
        <img className="spirit-banner" alt="spirit-banner" src={`${process.env.PUBLIC_URL}/assets/useful/spirit_footer.png`}/>
      </div>
    </Container>
  )
}
