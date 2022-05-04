import React from 'react'
import {Container, Row} from 'react-bootstrap'


export default function Footer() {
  return (    
    <footer className="footer">
      <Container className="footer__inner">  
        <div className="footer__inform">  
          <div className="inform__img-wrap">
            <img className="inform__img" src={`${process.env.PUBLIC_URL}/assets/useful/footer_spirit1.jpeg`} alt="inform__img"/>
            <span className="inform__span">The</span>
          </div>
          <div className="inform__img-wrap">
            <img className="inform__img" src={`${process.env.PUBLIC_URL}/assets/useful/footer_spirit2.jpeg`} alt="inform__img"/>
            <span className="inform__span">Legend</span>
          </div>
          <div className="inform__img-wrap">
            <img className="inform__img" src={`${process.env.PUBLIC_URL}/assets/useful/footer_spirit3.jpeg`} alt="inform__img"/>
            <span className="inform__span">Jungler</span>
          </div>
        </div>
        <div className="footer__etc">
          <p className="etc__contact">
            <h1>CONTACT</h1>
            <h2>EMAIL :</h2>
            <span>spirit777@gmail.com</span>
            <h2>PHONE :</h2>
            <span>010-1234-5678</span>
            <h2>INSTAGRAM :</h2>
            <a href="https://www.instagram.com/kdf_lol/" target="_blank">
              <span>@kdf_lol</span>
            </a>
          </p>
          <p className="etc__partners">
            <h1>PARTNERS</h1>
            <h2>Thanks for :</h2>
            <a href="http://www.ekdp.com/main/main.asp" target="_blank">
              <span>Kwangdong</span>
            </a>  
            <a href="https://www.afreecatv.com/" target="_blank">
              <span>Afreeca TV</span>
            </a>  
            <a href="https://www.logitech.com/ko-kr" target="_blank">
              <span>Logitech</span>
            </a>  
            <a href="https://shop.descentekorea.co.kr/index.do" target="_blank">
              <span>le coq sportif</span> 
            </a>  
          </p>
        </div>
        <div className="footer__copyright">
          <span className="copyright__text">
            ALL CONTENTS COPYRIGHT KWANGDONG FREECS CO., LTD. ALL RIGHTS RESERVED.
          </span>                    
        </div>          
      </Container>
    </footer>    
  )
}
