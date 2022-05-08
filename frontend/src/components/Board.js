import React,{ useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export default function Board({recentVersion, championDataList}) {

  const [selectedTeam1, setSelectedTeam1] = useState('')
  const [isTeam1MenuOpen, setIsTeam1MenuOpen] = useState(false)
  const [selectedTeam2, setSelectedTeam2] = useState('')
  const [isTeam2MenuOpen, setisTeam2MenuOpen] = useState(false)
  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')
  
  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  

  return (
    <Container className='ban-pick-board'> 
      <Row className='board-top'>
        <label className="team1" onClick={()=> setIsTeam1MenuOpen(!isTeam1MenuOpen)} >
          <div className='team1__name'>
            <input id='team1' type='button' className='name__button' value={ selectedTeam1 ||  'Blue' } />             
            <ul className="name__select" >
            {isTeam1MenuOpen && teamArr.map((team, index) => (
              <li className={`name__option`} key={index} onClick={()=> setSelectedTeam1(team)}> 
                <img className='option__logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`} />
                <div>{team}</div>
              </li>  
              ))}
            </ul>

            {/* <select className="team__select" defaultValue={'Blue'} onChange={e => setTeam1(e.target.value)}>
              <option disabled>Blue</option>
              {            
              teamArr.map((team, index)=> (
                <option className="option" value={team} key={index}>
                  {team}
                </option>)
              )
              }
            </select> */}
          </div>
          <div className='team1__logo'> 
            {
              selectedTeam1 && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedTeam1}.png`} />            
            }
            {/* <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team1}.png`} /> */}
          </div>
        </label>

        <Col className="match-info">
          <div className="date-wrap">
            <input className='date' type='text' value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="round-wrap">
            <input className='round' type='text' value={round} onChange={e=>setRound(e.target.value)}/>         
          </div>
        </Col>

        <label className="team2">
          <div className='team2__logo'>
            {
              selectedTeam2 && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedTeam2}.png`} />            
            }
            {/* <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team2}.png`} />             */}
          </div>
          {/* <div className='team2__name'>            
            <select className="team__select" defaultValue={'Red'} onChange={e => setTeam2(e.target.value)}>
              <option disabled>Red</option>
              {
              teamArr.map((team, index) =>{
                return ( <option className="option" defaultValue={"KDF"} key={index}> {team}</option>)
              })
              }
            </select>
          </div> */}
        </label>
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


