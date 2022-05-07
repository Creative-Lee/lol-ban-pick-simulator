import React,{ useState } from 'react'
import { useSelect } from 'downshift'
import { Container, Row, Col } from 'react-bootstrap'

export default function Board({recentVersion, championDataList}) {

  const [team1, setTeam1] = useState('KDF')
  const [team2, setTeam2] = useState('')
  
  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const {
    isOpen,
    selectedItem,  
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({items : teamArr})

  return (
    <Container className='ban-pick-board'> 
      <Row className='board-top'>
        <Col className="team1">
          <div className='team1__name'>
            <button type="button" {...getToggleButtonProps()}>
              {selectedItem || 'Select Team!'}
            </button>
            <ul className="ululul" {...getMenuProps()}>
              {
                isOpen && teamArr.map((team, index) => {
                  return (                    
                    <li className="lilili" key={index} {...getItemProps({ team, index })}>
                      <img  src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`}/>
                    </li>
                  )
                })
              }
            </ul>

            {/* <select className="team__select" defaultValue={'Select Team!'} onChange={e => setTeam1(e.target.value)}>
              <option disabled>Select Team!</option>
            {
              teamArr.map(team =>{
                return (
                  <option className="option" value={team} }>
                    {team}
                  </option>)
              })
              }
            </select> */}
          </div>
          <div className='team1__logo'> 
            {
              team1 && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team1}.png`} />            
            }
            {/* <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team1}.png`} /> */}
          </div>
        </Col>

        <Col className="match-info">
          <div className="date">2022-05-07</div>
          <div className="round">GAME 1</div>
        </Col>

        <Col className="team2">
          <div className='team2__logo'>
            {
              team2 && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team2}.png`} />            
            }
            {/* <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team2}.png`} />             */}
          </div>
          <div className='team2__name'>
            <select className="team__select" onChange={e => setTeam2(e.target.value)}>
              {
              teamArr.map(team =>{
                return ( <option className="option" defaultValue={"KDF"}>{team}</option>)
              })
              }
            </select>
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


