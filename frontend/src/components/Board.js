import React,{ useEffect, useState , useRef} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import {fromJS} from 'immutable'
import {TOP,JGL,MID,BOT,SUP} from '../img/position_icon'
import transparencyImg from '../img/transparencyImg.png'
import tooltipIcon from '../img/tooltip-mark.png'


export default function Board({recentVersion, ascendingChampionDataList , classicSpellList}) {  

  const isMounted = useRef(false);

  const [isSimulationInProgress, setIsSimulationInProgress] = useState(true)
  const [phase,setPhase] = useState('setting') // setting, banpick
  const [mode,setMode] = useState('rapid') // simulation, rapid

  const [selectedBlueTeam, setSelectedBlueTeam] = useState('')
  const [selectedRedTeam, setSelectedRedTeam] = useState('')
  const [isTeamSelectMenuOpen , setIsTeamSelectMenuOpen] = useState({
    blue : false,
    red : false
  })  

  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')
  const [matchResult, setMatchResult] = useState('Win or Lose')
  const [player, setPlayer] = useState({
    blue1: '', blue2: '', blue3: '', blue4: '', blue5: '',
    red1 : '', red2 : '', red3 : '', red4 : '', red5 : '',    
  })
  
  const [currentTargetSummonerIndex, setCurrentTargetSummonerIndex] = useState(0) // 0~9

  class Summoner{
    constructor(pickedChampion , spell1, spell2){
      pickedChampion,
      spell1,
      spell2
    }
  }

  const [blueTeamSummoner, setBlueTeamSummoner] = useState([
    
  ])
  const [redTeamSummoner, setRedTeamSummoner] = useState([

  ])

  const [summonerData, setSummonerData] = useState({
    summoner0 : new Summoner('blue', ['',''], ''),
    summoner1 : new Summoner('blue', ['',''], ''),
    summoner2 : new Summoner('blue', ['',''], ''),
    summoner3 : new Summoner('blue', ['',''], ''),
    summoner4 : new Summoner('blue', ['',''], ''),
    summoner5 : new Summoner('red', ['',''], ''),
    summoner6 : new Summoner('red', ['',''], ''),
    summoner7 : new Summoner('red', ['',''], ''),
    summoner8 : new Summoner('red', ['',''], ''),
    summoner9 : new Summoner('red', ['',''], '')    
  })
  const [bannedChampionList, setBannedChampionList] = useState({
    blue : ['','','','',''],
    red : ['','','','',''],
  })
  
  const setPickedChampion = (championName) => {
    const newSummonerData = new Summoner(
      summonerData[`summoner${currentTargetSummonerIndex}`].teamColor,
      summonerData[`summoner${currentTargetSummonerIndex}`].spell,
      championName)

    setSummonerData({...summonerData , [`summoner${currentTargetSummonerIndex}`] : newSummonerData})
  }

  const setSpell = (spellArr)=> {
    const newSummonerData = new Summoner(
      summonerData[`summoner${currentTargetSummonerIndex}`].teamColor,
      spellArr,
      summonerData[`summoner${currentTargetSummonerIndex}`].championName
    )

    setSummonerData({...summonerData , [`summoner${currentTargetSummonerIndex}`] : newSummonerData})
  }

  const getTargetTeamPickedChampionList = (teamColor) => {
    const summonerDataList = Object.values(summonerData)
    const targetTeamSummonersData = summonerDataList.filter(summonerData => summonerData.teamColor === teamColor)
    const targetTeamPickedChampionList = targetTeamSummonersData.map(summonerData => summonerData.pickedChampion)
    
    return targetTeamPickedChampionList
  }

  

  const tooltipText = 
  `[빠른 결과 모드] 는 Ban-Pick 순서와는 상관없이 빠르게 데이터 입력이 가능하고, 기본 스펠이 자동으로 입력됩니다.<br>
  [토너먼트 드래프트 모드] 는 전통 Ban-Pick 룰에 따라 진행됩니다. (현재 개발중입니다^^)`

  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const onChangePlayer = (e, teamNumber) => setPlayer({...player , [teamNumber] : e.target.value})
  const onChangeMode = e => setMode(e.target.value) 

  const toggleIsTeamSelectMenuOpen = teamColor => {
    setIsTeamSelectMenuOpen(prevState=> ({...prevState , [teamColor] : !prevState[teamColor]}))
    console.log('toggle')
  }
  const closeTeamSelectMenu = teamColor => {
    setIsTeamSelectMenuOpen(prevState => ({...prevState , [teamColor] : false}))
    console.log('close')
  }

  const setPlayerPrefix = () => {
    setPlayer(prev => ({...prev,  
      blue1: `${selectedBlueTeam} TOP`, 
      blue2: `${selectedBlueTeam} JGL`, 
      blue3: `${selectedBlueTeam} MID`,
      blue4: `${selectedBlueTeam} BOT`,
      blue5: `${selectedBlueTeam} SUP`,
      red1 : `${selectedRedTeam} TOP`, 
      red2 : `${selectedRedTeam} JGL`,
      red3 : `${selectedRedTeam} MID`, 
      red4 : `${selectedRedTeam} BOT`,
      red5 : `${selectedRedTeam} SUP`
    }))
  }

  const setSpellPlaceholder = () => { 
    const spellPlaceholderData =
    setEachTeamSummonersData(spellPlaceholderData)
  }

  // const setEachTeamPickedChampion = (teamColor) => {
  //   const pickedChampionData = eachTeamSummonersData
  //   .setIn(['blue','pickedChampion'])
    
  //   setEachTeamSummonersData(pickedChampionData)
  // }
  


  useEffect(()=>{    
    setPlayerPrefix()       
  },[selectedBlueTeam, selectedRedTeam])
  
  useEffect(()=>{
    if(mode === 'rapid' && isMounted.current === true){
      setSpellPlaceholder()  
      return
    }
    isMounted.current = true;
  },[phase])


  const showBoard = {
    setting :
    <Container id='setting-container' className="setting-container">
      <div className="setting-board">
        <div className='board__title'>
          <p>LOL Ban-Pick simulator</p>
        </div>
        <div className="radio-box">
          <div className="radio-box__title">
            <p>
              모드 선택 
              <img className='tooltip-icon' alt='tooltip-mark' src={tooltipIcon} data-for='mode-tooltip' data-tip={tooltipText} data-class='tooltip-text'/>
            </p>
            <ReactTooltip id='mode-tooltip' multiline={true} delayShow={300}/>            
          </div>
          <div className="radio-button-wrap">

            <div className="radio-button">
              <input id="rapid" type='radio' name='mode' value='rapid' onChange={onChangeMode} defaultChecked/> 
              <label htmlFor='rapid'>빠른 결과</label>              
            </div>

            <div className="radio-button">
              <input id='simulation' type='radio' name='mode' value='simulation' onChange={onChangeMode} disabled={true}/> 
              <label htmlFor='simulation'>토너먼트 드래프트</label>
            </div>
          </div>
        </div>
        <div className="next-phase">
          <button onClick={()=> setPhase('banpick')}>
            밴픽하러가기
          </button>
        </div>
      </div>
    </Container>,

    banpick : 
    <Container id="ban-pick-board" className='ban-pick-board'> 
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
        {
          getTargetTeamPickedChampionList('blue').map((champion, index)=>(
            <div className="summoner" key={index}>
              <img className="champion" id={`${champion}`} alt={`${champion}`}  
              src={                  
                champion === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${champion}_0.jpg`
              }/>
              <div className="spell">
                <img alt="spell1" 
                src={
                  eachTeamSummonersData.getIn(['blue','spell1']).get(index) === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${eachTeamSummonersData.getIn(['blue','spell1']).get(index)}.png`
                }/>
                <img alt="spell2" 
                src={
                  eachTeamSummonersData.getIn(['blue','spell2']).get(index) === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${eachTeamSummonersData.getIn(['blue','spell2']).get(index)}.png`
                }/>
              </div>
              <input className="player" type='text' value={player[`blue${index + 1}`]} onChange={(e)=>{onChangePlayer(e,`blue${index + 1}`)}}/>
            </div>
          ))           
        }        
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
              <div className="champion__card" key={index} data-champion={championData.id} onClick={()=>{setPickedChampion(championData.id)}}>
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
        {
        getTargetTeamPickedChampionList('red').map((champion, index)=>(
          <div className="summoner" key={index}>
            <img className="champion" id={`${champion}`} alt={`${champion}`} 
            src={
              champion === ''
              ? transparencyImg
              : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${champion}_0.jpg`
            }
          />
            <div className="spell">
              <img alt="spell1" 
              src={
                eachTeamSummonersData.getIn(['red','spell1']).get(index) === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${eachTeamSummonersData.getIn(['red','spell1']).get(index)}.png`
              }/>
              <img alt="spell2" 
              src={
                eachTeamSummonersData.getIn(['red','spell2']).get(index) === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${eachTeamSummonersData.getIn(['red','spell2']).get(index)}.png`
              }/>
            </div>
            <input className="player" type='text' value={player[`red${index + 1}`]} onChange={(e)=>{onChangePlayer(e,`red${index + 1}`)}}/>
          </div>
        ))           
        }        
      </div>
    </Row>

    <Row className='board-bottom'>
      <div className="blue-team__ban">
      {
        eachTeamSummonersData.getIn(['blue','bannedChampion']).map((bannedChampion, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' 
            src={
            bannedChampion === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${eachTeamSummonersData.getIn(['blue','bannedChampion']).get(index)}.png`}/>
          </div>
        ))
      }
      </div>    

      <div className='match-result-wrap'>
        <input type='text' className='match-result' value={matchResult}
        onChange={e=> setMatchResult(e.target.value)}/>     
      </div>

      <div className="red-team__ban">
      {
        eachTeamSummonersData.getIn(['red','bannedChampion']).map((bannedChampion, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' 
            src={
            bannedChampion === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${eachTeamSummonersData.getIn(['red','bannedChampion']).get(index)}.png`}/>
          </div>
        ))
      }
      </div>  
    </Row>
    </Container>
  }
  
  return (
    <>  
    {
      phase === 'setting'
      ? showBoard.setting
      : showBoard.banpick
    }    
    </>  
  )
}


