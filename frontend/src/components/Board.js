import React,{ useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

export default function Board({recentVersion, championDataList}) {

  const [selectedTeam1, setSelectedTeam1] = useState('')
  const [selectedTeam2, setSelectedTeam2] = useState('')
  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')
  const [isTeamSelectMenuOpen , setIsTeamSelectMenuOpen] = useState({
    blue : false,
    red : false
  }) 

  const toggleIsTeamSelectMenuOpen = teamColor => {
    setIsTeamSelectMenuOpen(prevState=> ({...prevState , [teamColor] : !prevState[teamColor]}))
    console.log('toggle')
  }
  const closeTeamSelectMenu = teamColor => {
    setIsTeamSelectMenuOpen(prevState => ({...prevState , [teamColor] : false}))
    console.log('close')
  }
  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  // const teamSelectMenuController = (teamColor) => {
  //   if(isTeamSelectMenuOpen[teamColor]){
  //     setIsTeamSelectMenuOpen({...isTeamSelectMenuOpen, [teamColor] : false});
  //     console.log(isTeamSelectMenuOpen[teamColor])
  //     return
  //   }
  //   setIsTeamSelectMenuOpen({...isTeamSelectMenuOpen, [teamColor] : true});
  //   console.log(isTeamSelectMenuOpen[teamColor])
  // }

  return (
    <Container className='ban-pick-board'> 
      <Row className='board-top'>
        <label  className="team1">
          <div className='team1__name'>
            <input  type='button' className='name__button'
            onClick={()=>{
              toggleIsTeamSelectMenuOpen('blue')              
            }}           
            onBlur={()=>{
              closeTeamSelectMenu('blue')              
            }}           
            value={ selectedTeam1 ||  'Blue' } 
            />             
            <ul className="name__select">
            {isTeamSelectMenuOpen.blue && teamArr.map((team, index) => (
              <li className={`name__option`} key={index} 
              onMouseDown={()=> {
                setSelectedTeam1(team) ; console.log('selected')
              }}
              > 
                <img className='option__logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`} />
                <span className='option__span'>{team}</span>
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

        <label className="team2" >
          <div className='team2__logo'>
            {
              selectedTeam2 && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedTeam2}.png`} />            
            }
            {/* <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team2}.png`} />             */}
          </div>
          
          <div className='team2__name'>  
          <input type='button' className='name__button'
            onClick={()=>{
              toggleIsTeamSelectMenuOpen('red')              
            }}           
            onBlur={()=>{
              closeTeamSelectMenu('red')              
            }}           
            value={ selectedTeam2 ||  'Red' } 
            />                       
            <ul className="name__select" >
            {isTeamSelectMenuOpen.red && teamArr.map((team, index) => (
              <li className={`name__option`} key={index}
              onMouseDown={()=> setSelectedTeam2(team)}
              > 
                <img className='option__logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`} />
                <span className='option__span'>{team}</span>
              </li>  
              ))}
            </ul>         
            {/* <select className="team__select" defaultValue={'Red'} onChange={e => setTeam2(e.target.value)}>
              <option disabled>Red</option>
              {
              teamArr.map((team, index) =>{
                return ( <option className="option" defaultValue={"KDF"} key={index}> {team}</option>)
              })
              }
            </select> */}
          </div>
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


