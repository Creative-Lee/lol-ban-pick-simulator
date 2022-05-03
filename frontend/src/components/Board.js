import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export default function Board({recentVersion, championDataList}) {


  return (
    <Container className='ban-pick-board'> 
      <Row className='board-top'>
        <Col className="team1">
          <div className='team1__title'>
            team1
          </div>
          <div className='team1__logo'>
            team1 logo
          </div>
        </Col>

        <Col className="match-info">
          <div className="date">match date</div>
          <div className="round">round</div>
        </Col>

        <Col className="team2">
          <div className='team2__logo'>
            team2 logo
          </div>
          <div className='team2__title'>
            team2
          </div>
        </Col>
      </Row>

      <Row className='board-middle'>
        <Col className="team1__summoners">
          <div className="summoner1">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner2">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner3">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner4">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner5">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
        </Col>

        <Col className="todays-goal">
          <h4>
            title
          </h4>
          <div>
            Today's Goal
          </div>
        </Col>

        <Col className="team2__summoners">
        <div className="summoner1">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner2">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner3">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner4">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
          <div className="summoner5">
            <div className="champion">
              champion1 img
            </div>
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <div className="player">
              player
            </div>
          </div>
        </Col>
      </Row>

      <Row className='board-bottom'>
        <Col>
          <div>
            team1 벤3마리
          </div>
          <div>
            team1 벤2마리
          </div>
        </Col>
        
        <Col>
          <div>
            승리 패배
          </div>          
        </Col>

        <Col>
          <div>
            team2 벤3마리
          </div>
          <div>
            team2 벤2마리
          </div>
        </Col>
      </Row>
    </Container>
  )
}


