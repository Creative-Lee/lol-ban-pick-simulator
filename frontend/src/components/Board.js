import React,{ useEffect, useState , useRef} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import {TOP,JGL,MID,BOT,SUP} from '../img/position_icon'
import transparencyImg from '../img/transparencyImg.png'
import tooltipIcon from '../img/tooltip-mark.png'


export default function Board({recentVersion, ascendingChampionDataList , classicSpellList}) {  
  const tooltipText = 
  `[빠른 결과 모드] 는 Ban-Pick 순서와는 상관없이 빠르게 데이터 입력이 가능하고, 기본 스펠이 자동으로 입력됩니다.<br>
  [토너먼트 드래프트 모드] 는 전통 Ban-Pick 룰에 따라 진행됩니다. (현재 개발중입니다^^)`

  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const isMountedRef = useRef(false);
  const blueTeamPickedChampionRef = useRef([]);
  const blueTeamBannedChampionRef = useRef([]);
  const redTeamPickedChampionRef = useRef([]);
  const redTeamBannedChampionRef = useRef([]);

  const [isSimulationInProgress, setIsSimulationInProgress] = useState(true)
  const [board,setBoard] = useState('setting') // setting, banpick
  const [mode,setMode] = useState('rapid') // simulation, rapid
  const [phase, setPhase] = useState('Pick')  // Pick, Ban

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

  class Summoner{
    constructor(pickedChampion , spell1, spell2, bannedChampion){
      this.pickedChampion = pickedChampion
      this.spell1 = spell1
      this.spell2 = spell2
      this.bannedChampion = bannedChampion
    }
    setPickedChampion(pickedChampion){
      return new Summoner(pickedChampion, this.spell1, this.spell2, this.bannedChampion)
    }
    setSpell1(spell1){
      return new Summoner(this.pickedChampion, spell1, this.spell2, this.bannedChampion)
    }
    setSpell2(spell2){
      return new Summoner(this.pickedChampion, this.spell1, spell2, this.bannedChampion)
    }
    setBannedChampion(bannedChampion){
      return new Summoner(this.pickedChampion, this.spell1, this.spell2, bannedChampion)
    }
  }

  const [blueTeamSummoner, setBlueTeamSummoner] = useState([
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','','')
  ])
  const [redTeamSummoner, setRedTeamSummoner] = useState([
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','',''),
    new Summoner('','','','')
  ])
    
  const [targetTeam, setTargetTeam] = useState('blue') // blue, red
  const [targetIndex, setTargetIndex] = useState(0) // 0 ~ 4

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

  const setPickedChampion = (championName) => {
    if(targetTeam === 'blue'){
      const updateArr = [...blueTeamSummoner]
      updateArr[targetIndex] = blueTeamSummoner[targetIndex].setPickedChampion(championName)  

      setBlueTeamSummoner(updateArr)
    }
    else{
      const updateArr = [...redTeamSummoner]
      updateArr[targetIndex] = redTeamSummoner[targetIndex].setPickedChampion(championName)

      setRedTeamSummoner(updateArr)
    }
  }

  const setBannedChampion = (championName) => {
    if(targetTeam === 'blue'){
      const updateArr = [...blueTeamSummoner]
      updateArr[targetIndex] = blueTeamSummoner[targetIndex].setBannedChampion(championName)  

      setBlueTeamSummoner(updateArr)
    }
    else{
      const updateArr = [...redTeamSummoner]
      updateArr[targetIndex] = redTeamSummoner[targetIndex].setBannedChampion(championName)

      setRedTeamSummoner(updateArr)
    }
  }

  const onClickAllTargetController = () => {
    if(isAllPhaseEnd()){
      setIsSimulationInProgress(false)
      return
    }

    if(isCurrentTargetIndexChampionDataEmpty()){
      return
    }

    if(targetIndex < 4){
      setTargetIndex(targetIndex + 1)
      return
    }
      
    if(isPickPhaseEnd()){
      setPhase('Ban')
    }
    
    if(isBanPhaseEnd()){
      setPhase('Pick')
    }

    if(targetTeam === 'blue'){
      setTargetTeam('red')           
    }
    else{
      setTargetTeam('blue')
    }

    setTargetIndex(0) 
  }

  const isCurrentTargetIndexChampionDataEmpty = () => {
    if(phase === 'Pick'){
      if(targetTeam === 'blue'){
        return blueTeamSummoner[targetIndex].pickedChampion === ''
      }      
      return redTeamSummoner[targetIndex].pickedChampion === ''
    }
    else{
      if(targetTeam === 'blue'){
        return blueTeamSummoner[targetIndex].bannedChampion === ''
      }
      return redTeamSummoner[targetIndex].bannedChampion === ''
    }
  }

  const isPickPhaseEnd = () => {
    const isBlueTeamPickPhaseEnd = !blueTeamSummoner.map(summoner => summoner.pickedChampion).includes('')
    const isRedTeamPickPhaseEnd = !redTeamSummoner.map(summoner => summoner.pickedChampion).includes('')
    
    return isBlueTeamPickPhaseEnd && isRedTeamPickPhaseEnd
  }
  
  const isBanPhaseEnd = () => {  
    const isBlueTeamBanPhaseEnd = !blueTeamSummoner.map(summoner => summoner.bannedChampion).includes('')
    const isRedTeamBanPhaseEnd = !redTeamSummoner.map(summoner => summoner.bannedChampion).includes('')
    
    return isBlueTeamBanPhaseEnd && isRedTeamBanPhaseEnd
  }  

  const isAllPhaseEnd = () => {
    return isPickPhaseEnd() && isBanPhaseEnd()
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
    const blueTeamUpdateArr = blueTeamSummoner.map(summoner => summoner.setSpell2('Flash'))
    blueTeamUpdateArr[1].spell1 = 'Smite'

    const redTeamUpdateArr = redTeamSummoner.map(summoner => summoner.setSpell2('Flash'))
    redTeamUpdateArr[1].spell1 = 'Smite' 
        
    setBlueTeamSummoner(blueTeamUpdateArr)
    setRedTeamSummoner(redTeamUpdateArr)
    console.log('스펠 플레이스 홀더 함수 실행')
  }

  useEffect(()=>{ //setPlayerPrefix
    setPlayerPrefix()       
  },[selectedBlueTeam, selectedRedTeam])
  
  useEffect(()=>{ //setSpellPlaceholder
    if(mode === 'rapid' && isMountedRef.current === true){
      setSpellPlaceholder()
      return
    }
    isMountedRef.current = true;
  },[board])   

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
        <div className="next-board">
          <button onClick={()=> setBoard('banpick')}>
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
              setSelectedBlueTeam(team)
              console.log('selected')
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
          blueTeamSummoner.map((summoner, index)=>(
            <div className="summoner" key={index}>
              <img className="champion" id={`${summoner.pickedChampion}`} alt={`blueTeam-${index}-${summoner.pickedChampion}`}  
              data-current-target={targetTeam === 'blue'  && targetIndex === index && phase === 'Pick'}
              ref={element => blueTeamPickedChampionRef.current[index] = element}
              onClick={() =>{
                setTargetIndex(index)
                setTargetTeam('blue')
                setPhase('Pick')
              }}
              src={                  
                summoner.pickedChampion === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion}_0.jpg`
              }/>
              <div className="spell">
                <img alt="spell1" 
                src={
                  summoner.spell1 === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${summoner.spell1}.png`
                }/>
                <img alt="spell2" 
                src={
                  summoner.spell2 === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${summoner.spell2}.png`
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
              <div className="champion__card" key={index} data-champion={championData.id}
              onClick={()=>{
                if(phase === 'Pick'){
                  setPickedChampion(championData.id)
                }
                else{
                  setBannedChampion(championData.id)
                }
              }}>
                <img className="champion__img" alt={championData.id} src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${championData.id}.png`}/>
                <small className="champion__name">{championData.name}</small>
              </div>
            ))
          } 
        </div>
        <input className="champion__select-button" type="button" value={phase}
        onClick={()=>{
          onClickAllTargetController()
        }}/>
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
        redTeamSummoner.map((summoner, index)=>(
          <div className="summoner" key={index}>
            <img className="champion" id={`${summoner.pickedChampion}`} alt={`${summoner.pickedChampion}`}
            data-current-target={targetTeam === 'red' && targetIndex === index && phase === 'Pick'}
            ref={element => redTeamPickedChampionRef.current[index] = element}
            onClick={() =>{
              setTargetIndex(index)
              setTargetTeam('red')
              setPhase('Pick')
            }}  
            src={                  
              summoner.pickedChampion === ''
              ? transparencyImg
              : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion}_0.jpg`
            }/>
            <div className="spell">
              <img alt="spell1" 
              src={
                summoner.spell1 === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${summoner.spell1}.png`
              }/>
              <img alt="spell2" 
              src={
                summoner.spell2 === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/Summoner${summoner.spell2}.png`
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
        blueTeamSummoner.map((summoner, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' alt={`blueTeam-banned-${index}-${summoner.bannedChampion}`}
            data-current-target={targetTeam === 'blue' && targetIndex === index && phase === 'Ban'}
            ref={element => blueTeamBannedChampionRef.current[index] = element}
            onClick={()=>{
              setTargetTeam('blue')
              setTargetIndex(index)
              setPhase('Ban')
            }}
            src={
            summoner.bannedChampion === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${summoner.bannedChampion}.png`}/>
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
        redTeamSummoner.map((summoner, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' alt={`redTeam-banned-${index}-${summoner.bannedChampion}`}
            data-current-target={targetTeam === 'red' && targetIndex === index && phase === 'Ban'}
            ref={element => redTeamBannedChampionRef.current[index] = element}
            onClick={()=>{
              setTargetTeam('red')
              setTargetIndex(index)
              setPhase('Ban')
            }}
            src={
            summoner.bannedChampion === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${summoner.bannedChampion}.png`}/>
          </div>
        ))
      }
      </div>  
    </Row>
    </Container>
  }
  
  return (
    <>  
    {showBoard[board]}    
    </>  
  )
}


