import React,{ useEffect, useState , useMemo} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import {TOP,JGL,MID,BOT,SUP} from '../img/position_icon'

export default function Board({recentVersion, ascendingChampionDataList}) {  

  const [isSimulationInProgress, setIsSimulationInProgress] = useState(true)
  const [selectedBlueTeam, setSelectedBlueTeam] = useState('')
  const [selectedRedTeam, setSelectedRedTeam] = useState('')
  
  const [isTeamSelectMenuOpen , setIsTeamSelectMenuOpen] = useState({
    blue : false,
    red : false
  }) 

  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')
  const [player, setPlayer] = useState({
    blue1: 'player', blue2: 'player', blue3: 'player', blue4: 'player', blue5: 'player',
    red1 : 'player', red2 : 'player', red3 : 'player', red4 : 'player', red5 : 'player',    
  })

  const [selectedChampion, setSelectedChampion] = useState([])
  const spell = `http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/SummonerFlash.png`
  const splashImgUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg`

  const toggleIsTeamSelectMenuOpen = teamColor => {
    setIsTeamSelectMenuOpen(prevState=> ({...prevState , [teamColor] : !prevState[teamColor]}))
    console.log('toggle')
  }
  const closeTeamSelectMenu = teamColor => {
    setIsTeamSelectMenuOpen(prevState => ({...prevState , [teamColor] : false}))
    console.log('close')
  }
  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const onChangePlayer = (e, teamNumber) => setPlayer({...player , [teamNumber] : e.target.value})

  return (    
    /*     
    {
      isTeamSelected ? <></> : <></>
      추후에 팀 선택 화면과 기존 밴픽보드 창을 나누어 개발예정
      존재하는 모든 팀을 검색조건하에 선택 후 밴픽 보드로 넘어가게!      
    } 
    */
    <Container className='ban-pick-board'> 
      <Row className='board-top'>
        <label className="blue-team">
          <div className='blue-team__name'>
            <input  type='button' className='name__button'
            onClick={()=>{
              toggleIsTeamSelectMenuOpen('blue')              
            }}           
            onBlur={()=>{
              closeTeamSelectMenu('blue')              
            }}           
            value={ selectedBlueTeam ||  'Blue' } 
            />             
            <ul className="name__select">
            {isTeamSelectMenuOpen.blue && teamArr.map((team, index) => (
              <li className={`name__option`} key={index} 
              onMouseDown={()=> {
                setSelectedBlueTeam(team) ; console.log('selected')
              }}
              > 
                <img className='option__logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`} />
                <span className='option__span'>{team}</span>
              </li>  
              ))}
            </ul>
          </div>
          <div className='blue-team__logo'> 
            {
              selectedBlueTeam && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedBlueTeam}.png`} />            
            }
          </div>
        </label>

        <Col className="match-info">
          <div className="date-wrap">
            <input className='date' type='text' value={date} onChange={e=>setDate(e.target.value)}/>
          </div>
          <div className="round-wrap">
            <input className='round' type='text' value={round} onChange={e=>setRound(e.target.value)}/>         
          </div>
        </Col>

        <label className="red-team" >
          <div className='red-team__logo'>
            {
              selectedRedTeam && <img className='logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedRedTeam}.png`} />            
            }
          </div>
          
          <div className='red-team__name'>  
          <input type='button' className='name__button'
            onClick={()=>{
              toggleIsTeamSelectMenuOpen('red')              
            }}           
            onBlur={()=>{
              closeTeamSelectMenu('red')              
            }}           
            value={ selectedRedTeam ||  'Red' } 
            />                       
            <ul className="name__select" >
            {isTeamSelectMenuOpen.red && teamArr.map((team, index) => (
              <li className={`name__option`} key={index}
              onMouseDown={()=> setSelectedRedTeam(team)}
              > 
                <img className='option__logo' alt='logo' src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`} />
                <span className='option__span'>{team}</span>
              </li>  
              ))}
            </ul>         
          </div>
        </label>
      </Row>

      <Row className='board-middle'>
        <div className="blue-team__summoners">
          <div className="summoner first">
            <img className="champion" id='Ezreal' alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ezreal_0.jpg' />
            <div className="spell">
              <img alt="spell1"  src={spell}/>
              <img alt="spell2"  src={spell}/>
            </div>
            <input className="player" type='text' value={player.blue1} onChange={(e)=>{onChangePlayer(e,'blue1')}}/>
          </div>
          <div className="summoner second">
            <img className="champion"  id='Graves' alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Graves_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.blue2} onChange={(e)=>{onChangePlayer(e,'blue2')}}/>
          </div>
          <div className="summoner third">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.blue3} onChange={(e)=>{onChangePlayer(e,'blue3')}}/>
          </div>
          <div className="summoner forth">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.blue4} onChange={(e)=>{onChangePlayer(e,'blue4')}}/>
          </div>
          <div className="summoner fifth">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.blue5} onChange={(e)=>{onChangePlayer(e,'blue5')}}/>
          </div>
        </div>

        {
        isSimulationInProgress 
        ? 
        <div className="champion-select-board">
          <div className="champion__select-option">
            <div className="main-lane">
              <img id="top" className="lane-icon" alt="main-lane-top-icon" src={TOP}/>
              <img id="jgl" className="lane-icon" alt="main-lane-jgl-icon" src={JGL}/>
              <img id="mid" className="lane-icon" alt="main-lane-mid-icon" src={MID}/>
              <img id="bot" className="lane-icon" alt="main-lane-bot-icon" src={BOT}/>
              <img id="sup" className="lane-icon" alt="main-lane-sup-icon" src={SUP}/>
            </div>
            <div className="search">
              돋보기 아이콘과 인풋 자리
            </div>
          </div>
          <div className="champions"> 
            {
              ascendingChampionDataList.map((championData, index) =>(
                <div className="champion__card" key={index} onClick={()=>{}}>
                  <img className="champion__img" alt={championData.id} src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${championData.id}.png`}/>
                  <small className="champion__name">{championData.name}</small>
                </div>
              ))
            } 
          </div>
          <input className="champion__select-button" type="button" value='BAN'/>
        </div>
        : 
        <div className="todays-goal">
          <h4>
            title
          </h4>
          <div>
            Today's Goal
          </div>         
        </div>
        }
        

        <div className="red-team__summoners">
          <div className="summoner first">
            <img className="champion" alt="champion" id="Aatrox" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <img alt="spell1"  src={spell}/>
              <img alt="spell2"  src={spell}/>
            </div>
            <input className="player" type='text' value={player.red1} onChange={(e)=>{onChangePlayer(e,'red1')}}/>
          </div>
          <div className="summoner second">
            <img className="champion" alt="champion" id='LeeSin' src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/LeeSin_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.red2} onChange={(e)=>{onChangePlayer(e,'red2')}}/>
          </div>
          <div className="summoner third">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.red3} onChange={(e)=>{onChangePlayer(e,'red3')}}/>
          </div>
          <div className="summoner forth">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.red4} onChange={(e)=>{onChangePlayer(e,'red4')}}/>
          </div>
          <div className="summoner fifth">
            <img className="champion" alt="champion" src='http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg' />
            <div className="spell">
              <div>spell1</div>
              <div>spell2</div>              
            </div>
            <input className="player" type='text' value={player.red5} onChange={(e)=>{onChangePlayer(e,'red5')}}/>
          </div>
        </div>
      </Row>

      <Row className='board-bottom'>
        <Col>
          <div>
            blue-team 벤3마리
          </div>
          <div>
            blue-team 벤2마리
          </div>
        </Col>  
        
        <Col>
          <div>
            승리 패배
          </div>          
        </Col>

        <Col>
          <div>
            red-team 벤3마리
          </div>
          <div>
            red-team 벤2마리
          </div>
        </Col>
      </Row>
    </Container>
  )
}


