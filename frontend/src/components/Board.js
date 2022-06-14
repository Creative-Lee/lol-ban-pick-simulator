import React,{ useEffect, useState , useRef, useCallback} from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import Hangul from 'hangul-js';

import {Editor, Viewer} from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import {searchIcon, tooltipIcon, transparencyImg} from '../img/import_img'

import {getDownloadResultPngFile} from '../apis/get'


export default function Board({recentVersion, ascendingChampionDataList , classicSpellList}) {  
  const modeToolTip = 
  `[빠른 결과 모드] 는 Ban-Pick 순서와는 상관없이 빠르게 데이터 입력이 가능하고, 기본 스펠이 자동으로 입력됩니다.<br>
  [토너먼트 드래프트 모드] 는 전통 Ban-Pick 룰에 따라 진행됩니다. (현재 개발중입니다^^)`
  const resultDownToolTip1 =
  `밴픽 결과를 이미지 파일로 변환하여 자동 다운로드 합니다.<br>
  주의하세요💩 : 소환사 챔피언 이미지와 일부 텍스트 사이즈가 조정되어 보이는 화면과 차이가 있습니다.<br>
  (추후 사이즈 조정 없이 저장 가능하도록 업데이트 예정입니다^^)`
  const resultDownToolTip2 =
  `결과 캡쳐를 위해 버튼 탭이 사라지고, 전체화면으로 전환되며, 스크롤이 조정됩니다.<br>  
  (업데이트와 함께 사라질 기능입니다^^)`
  const searchToolTip =
  `기본, 초성 검색이 가능합니다🧐<br>
  띄어쓰기도 걱정하지 마세요! ex)리 신, 탐 켄치 
  `


  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const isMountedRef = useRef(false);
  const editorRef = useRef();

  const [board,setBoard] = useState('setting') // setting, banpick
  const [mode,setMode] = useState('rapid') // simulation, rapid
  const [globalPhase, setGlobalPhase] = useState('PickBan') // PickBan, GoalEdit, End
  const [pickBanPhase, setPickBanPhase] = useState('Pick')  // Pick, Ban, Spell, End
  const [goalEditPhase, setGoalEditPhase] = useState('Editing') // Editing, EditDone, End
  const [currentSelectingTeam, setCurrentSelectingTeam] = useState('blue') // blue, red
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(0) // 0 ~ 4 
  const [currentSelectingSpellNumber, setCurrentSelectingSpellNumber] = useState(1) // 1, 2

  const [champDataList, setChampDataList] = useState([])
  const [selectedBlueTeam, setSelectedBlueTeam] = useState('Blue')
  const [selectedRedTeam, setSelectedRedTeam] = useState('Red')
  const [isTeamSelectMenuOpen , setIsTeamSelectMenuOpen] = useState({
    blue : false,
    red : false
  }) 

  const [searchInput, setSearchInput] = useState('')
  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')
  const [matchResult, setMatchResult] = useState('Win or Lose')
  const [goalTitle, setGoalTitle] = useState('오늘의 타이틀')
  const [viewerInput, setViewerInput] = useState('')

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
    switchingSpell(){
      return new Summoner(this.pickedChampion, this.spell2, this.spell1 , this.bannedChampion)
    }
    isEmpty(data){
      return this[data] === ''
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
    


  const onChangeSearchInput = e => setSearchInput(e.target.value)
  const onChangePlayer = (e, teamNumber) => setPlayer({...player , [teamNumber] : e.target.value})
  const onChangeMode = e => setMode(e.target.value) 
  const onChangeGoalTitle = e => setGoalTitle(e.target.value) 
  const onChangeEditor = () => {
    const editorInputHtml = editorRef.current.getInstance().getHTML();
    setViewerInput(editorInputHtml)
  }

  const updateMatchChampDataList = useCallback(() => {    
    const championNameList = ascendingChampionDataList.map(data => data.name)
    let searcher = new Hangul.Searcher(searchInput);
    
    const letterMatchedChampNameList = championNameList.filter(championName => searcher.search(championName) >= 0)
    const letterMatchedChampNameListWithoutSpace = championNameList.filter(championName => searcher.search(championName.replace(/ /gi,"")) >= 0)
    const chosungMatchedChampNameList = championNameList.filter(championName => {   
      const champChosungStrArr = 
      Hangul.d(championName,true)
      .map(disEachLetterList => disEachLetterList[0]) // ['ㄱ', 'ㄹ'] and ['ㄱ', 'ㄹ', 'ㅇ'] ...something
      .join('')// ['ㄱㄹ'] and ['ㄱㄹㅇ'] ...something
      .replace(/ /gi,"") // 띄어쓰기 제거
      
      const searchInputChosungStrArr = Hangul.d(searchInput).join('') // ['ㄱ','ㄹ'] -> ['ㄱㄹ']      
      return champChosungStrArr.includes(searchInputChosungStrArr)
    })

    const mergedChampNameList = letterMatchedChampNameList.concat(letterMatchedChampNameListWithoutSpace,chosungMatchedChampNameList)
    const duplicatesRemovedChampNameList = mergedChampNameList.filter((name, index) => mergedChampNameList.indexOf(name) === index) 

    const matchedChampDataList = ascendingChampionDataList.filter(data => duplicatesRemovedChampNameList.includes(data.name))
    
    setChampDataList(matchedChampDataList)    
  },[ascendingChampionDataList, searchInput] )

  const toggleIsTeamSelectMenuOpen = teamColor => {
    setIsTeamSelectMenuOpen(prevState=> ({...prevState , [teamColor] : !prevState[teamColor]}))
  }
  const closeTeamSelectMenu = teamColor => {
    setIsTeamSelectMenuOpen(prevState => ({...prevState , [teamColor] : false}))
  }

  const setPickedChampion = (championName) => {
    if(currentSelectingTeam === 'blue'){
      const updatedArr = [...blueTeamSummoner]
      updatedArr[currentSelectingIndex] = blueTeamSummoner[currentSelectingIndex].setPickedChampion(championName)  

      setBlueTeamSummoner(updatedArr)
    }
    else{
      const updatedArr = [...redTeamSummoner]
      updatedArr[currentSelectingIndex] = redTeamSummoner[currentSelectingIndex].setPickedChampion(championName)

      setRedTeamSummoner(updatedArr)
    }
  }

  const setBannedChampion = (championName) => {
    if(currentSelectingTeam === 'blue'){
      const updatedArr = [...blueTeamSummoner]
      updatedArr[currentSelectingIndex] = blueTeamSummoner[currentSelectingIndex].setBannedChampion(championName)  

      setBlueTeamSummoner(updatedArr)
    }
    else{
      const updatedArr = [...redTeamSummoner]
      updatedArr[currentSelectingIndex] = redTeamSummoner[currentSelectingIndex].setBannedChampion(championName)

      setRedTeamSummoner(updatedArr)
    }
  }

  const setSpell = (spellName) => {
    let currentSpell1 
    let currentSpell2
    let updatedArr
    
    if(currentSelectingTeam === 'blue'){      
      currentSpell1 = blueTeamSummoner[currentSelectingIndex].spell1
      currentSpell2 = blueTeamSummoner[currentSelectingIndex].spell2      
      updatedArr = [...blueTeamSummoner]

      if((currentSelectingSpellNumber === 1 && spellName === currentSpell2) ||
        (currentSelectingSpellNumber === 2 && spellName === currentSpell1)){
        updatedArr[currentSelectingIndex] = updatedArr[currentSelectingIndex].switchingSpell()
        setBlueTeamSummoner(updatedArr)
        return
      }      

      updatedArr[currentSelectingIndex] = updatedArr[currentSelectingIndex][`setSpell${currentSelectingSpellNumber}`](spellName)  
      setBlueTeamSummoner(updatedArr)
    }    
    else{
      currentSpell1 = redTeamSummoner[currentSelectingIndex].spell1
      currentSpell2 = redTeamSummoner[currentSelectingIndex].spell2      
      updatedArr = [...redTeamSummoner]

      if((currentSelectingSpellNumber === 1 && spellName === currentSpell2) ||
      (currentSelectingSpellNumber === 2 && spellName === currentSpell1)){
        updatedArr[currentSelectingIndex] = updatedArr[currentSelectingIndex].switchingSpell()
        setRedTeamSummoner(updatedArr)
        return
      }      

      updatedArr[currentSelectingIndex] = updatedArr[currentSelectingIndex][`setSpell${currentSelectingSpellNumber}`](spellName)  
      setRedTeamSummoner(updatedArr)
    }
  }

  const onClickChampionPickButton = () => {
    if(isGlobalPickBanPhaseEnd()){      
      setGlobalPhase('GoalEdit')
      setPickBanPhase('End')
      return
    }

    if(isPickPhaseEnd()){
      setPickBanPhase('Ban')
      setCurrentSelectingIndex(0)
      setCurrentSelectingTeam('blue')
      return
    }   

    if(isCurrentSelectingDataEmpty('pickedChampion')){
      return
    }

    if(currentSelectingIndex < 4){
      setCurrentSelectingIndex(currentSelectingIndex + 1)
      return
    }    
    
    if(currentSelectingTeam === 'blue'){
      setCurrentSelectingTeam('red')
    } else{
      setCurrentSelectingTeam('blue')
    }
    
    setCurrentSelectingIndex(0)
  }
  
  const onClickChampionBanButton = () => {
    if(isGlobalPickBanPhaseEnd()){      
      setGlobalPhase('GoalEdit')
      setPickBanPhase('End')
      return
    }

    if(isBanPhaseEnd()){
      setPickBanPhase('Spell')
      setCurrentSelectingIndex(0)
      setCurrentSelectingTeam('blue')
      return
    }

    if(isCurrentSelectingDataEmpty('bannedChampion')){
      return
    }

    if(currentSelectingIndex < 4){
      setCurrentSelectingIndex(currentSelectingIndex + 1)
      return
    }    
    
    if(currentSelectingTeam === 'blue'){
      setCurrentSelectingTeam('red')
    } else{
      setCurrentSelectingTeam('blue')
    }

    setCurrentSelectingIndex(0)
  }  

  const onClickSpellSelectButton = () =>{
    if(isGlobalPickBanPhaseEnd()){      
      setPickBanPhase('End')
      setGlobalPhase('GoalEdit')
      return
    }

    if(isSpellPhaseEnd()){
      setPickBanPhase('Pick')
      setCurrentSelectingIndex(0)
      setCurrentSelectingTeam('blue')
      setCurrentSelectingSpellNumber(1)
      return
    }

    if(isCurrentSelectingDataEmpty(`spell${currentSelectingSpellNumber}`)){
      return
    }

    if(currentSelectingIndex < 4){
      setCurrentSelectingIndex(currentSelectingIndex + 1)
      setCurrentSelectingSpellNumber(1)
      return
    }    

    if(currentSelectingTeam === 'blue'){
      setCurrentSelectingTeam('red')
    } else{
      setCurrentSelectingTeam('blue')
    }

    setCurrentSelectingIndex(0)
  }

  const onClickCurrentSelectingSpellNumberHandler = () => {
    if(currentSelectingSpellNumber === 1){
      setCurrentSelectingSpellNumber(2)
      return
    }
    setCurrentSelectingSpellNumber(1)
  }

  const isCurrentSelectingDataEmpty = (data) => {    
    if(currentSelectingTeam === 'blue'){
      return blueTeamSummoner[currentSelectingIndex].isEmpty(data)
    }
    return redTeamSummoner[currentSelectingIndex].isEmpty(data)
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
  
  const isSpellPhaseEnd = () => {
    const isBlueTeamSpellPhaseEnd = !blueTeamSummoner.map(summoner => summoner.spell1)
    .concat(blueTeamSummoner.map(summoner => summoner.spell2))
    .includes('')

    const isRedTeamSpellPhaseEnd = !redTeamSummoner.map(summoner => summoner.spell1)
    .concat(redTeamSummoner.map(summoner => summoner.spell2))
    .includes('')
    
    return isBlueTeamSpellPhaseEnd && isRedTeamSpellPhaseEnd
  }

  

  const isGlobalPickBanPhaseEnd = () => {
    return isPickPhaseEnd() && isBanPhaseEnd() && isSpellPhaseEnd()
  }
  
  const activatePlayerPrefix = useCallback(() => {
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
  },[selectedBlueTeam, selectedRedTeam])

  const activateSpellPlaceholder = useCallback(() => {
    const blueTeamUpdateArr = blueTeamSummoner.map(summoner => summoner.setSpell2('SummonerFlash'))
    blueTeamUpdateArr[0].spell1 = 'SummonerTeleport'
    blueTeamUpdateArr[1].spell1 = 'SummonerSmite'
    blueTeamUpdateArr[2].spell1 = 'SummonerTeleport'
    blueTeamUpdateArr[3].spell1 = 'SummonerHeal'
    blueTeamUpdateArr[4].spell1 = 'SummonerExhaust'

    const redTeamUpdateArr = redTeamSummoner.map(summoner => summoner.setSpell2('SummonerFlash'))
    redTeamUpdateArr[0].spell1 = 'SummonerTeleport'
    redTeamUpdateArr[1].spell1 = 'SummonerSmite'
    redTeamUpdateArr[2].spell1 = 'SummonerTeleport'
    redTeamUpdateArr[3].spell1 = 'SummonerHeal'
    redTeamUpdateArr[4].spell1 = 'SummonerExhaust' 

    setBlueTeamSummoner(blueTeamUpdateArr)
    setRedTeamSummoner(redTeamUpdateArr)
  },[blueTeamSummoner, redTeamSummoner])

  const isPickedChampion = (championName) => {
    const blueTeamPicked = blueTeamSummoner.map(summoner=>summoner.pickedChampion)
    const redTeamPicked = redTeamSummoner.map(summoner=>summoner.pickedChampion)    
    const allTeamPickedList = [...blueTeamPicked, ...redTeamPicked]

    return allTeamPickedList.includes(championName)
  }
  const isBannedChampion = (championName) => {
    const blueTeamBanned = blueTeamSummoner.map(summoner=>summoner.bannedChampion)
    const redTeamBanned = redTeamSummoner.map(summoner=>summoner.bannedChampion)    
    const allTeamBannedList = [...blueTeamBanned, ...redTeamBanned]

    return allTeamBannedList.includes(championName)
  }
  const isPickedSpell = (spellName) => {
    if(currentSelectingTeam === 'blue'){
      const isMatchedSummonerSpell1 = blueTeamSummoner[currentSelectingIndex].spell1 === spellName
      const isMatchedSummonerSpell2 = blueTeamSummoner[currentSelectingIndex].spell2 === spellName

      return isMatchedSummonerSpell1 || isMatchedSummonerSpell2
    }

  const isMatchedSummonerSpell1 = redTeamSummoner[currentSelectingIndex].spell1 === spellName
  const isMatchedSummonerSpell2 = redTeamSummoner[currentSelectingIndex].spell2 === spellName

  return isMatchedSummonerSpell1 || isMatchedSummonerSpell2   
  }
  
  const zoomViewImgSrc = (spellNumber) => {
    if(currentSelectingTeam === 'blue'){ 
      return(     
      blueTeamSummoner[currentSelectingIndex][`spell${spellNumber}`] === ''
      ? transparencyImg
      : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${blueTeamSummoner[currentSelectingIndex][`spell${spellNumber}`]}.png`
      )}
    else { 
      return(     
      redTeamSummoner[currentSelectingIndex][`spell${spellNumber}`] === ''
      ? transparencyImg
      : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${redTeamSummoner[currentSelectingIndex][`spell${spellNumber}`]}.png`
      )}                  
  }
  
  useEffect(()=>{ //activatePlayerPrefix
    activatePlayerPrefix()       
    console.log('activate PlayerPrefix')
  },[activatePlayerPrefix])
  
  useEffect(()=>{ //activateSpellPlaceholder
    if(mode === 'rapid' && isMountedRef.current === true){
      activateSpellPlaceholder()
      console.log('activate Spell Placeholder')
      return
    }
    isMountedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[board])   

  useEffect(()=>{ // updateMatchChampDataList
    updateMatchChampDataList()
    console.log('matchedChampDataList update compleat')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchInput, board])

  useEffect(()=>{
    setGoalEditPhase('Editing')
  },[globalPhase])
  

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
              <img className='mode-tooltip-icon' alt='tooltip-mark' src={tooltipIcon} data-for='mode-tooltip' data-tip={modeToolTip} data-class='mode-tooltip-text'/>
            </p>
            <ReactTooltip id='mode-tooltip' multiline={true} delayShow={100}/>            
          </div>
          <div className="radio-button-wrap">

            <div className="radio-button">
              <input id="rapid" type='radio' name='mode' value='rapid' onChange={onChangeMode} defaultChecked/> 
              <label htmlFor='rapid'>빠른 결과</label>              
            </div>

            <div className="radio-button">
              <input id='simulation' type='radio' name='mode' value='simulation' onChange={onChangeMode} disabled/> 
              <label htmlFor='simulation'>토너먼트 드래프트</label>
            </div>
          </div>
        </div>
        <div className="go-banpick-button-wrap">
          <button onClick={()=> setBoard('banpick')}>
            밴픽하러가기
          </button>
        </div>
      </div>
    </Container>,

    banpick : 
    <Container id="ban-pick-board" className='ban-pick-board'> 
    <Row id='board-top' className='board-top'>
      <label className="blue-team">
        <div className='blue-team__name'>
          <input  type='button' id='blue-name-input' className='name__button'
          onClick={()=>{
            toggleIsTeamSelectMenuOpen('blue')              
          }}           
          onBlur={()=>{
            closeTeamSelectMenu('blue')              
          }}           
          value={selectedBlueTeam} 
          />             
          <ul className="name__select" data-html2canvas-ignore>
          {isTeamSelectMenuOpen.blue && teamArr.map((team, index) => (
            <li className={`name__option`} key={index} 
            onMouseDown={()=> {
              setSelectedBlueTeam(team)
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
            selectedBlueTeam === 'Blue'
            ? <img className='logo' alt={`blue-team-logo-${selectedBlueTeam}`} src={transparencyImg}/>
            : <img className='logo' alt={`blue-team-logo-${selectedBlueTeam}`} src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedBlueTeam}.png`} />            
          }
        </div>
      </label>

      <Col className="match-info">
        <div className="date-wrap">
          <input className='date' type='text' value={date} spellCheck='false'
          onChange={e=>setDate(e.target.value)}
          />
        </div>
        <div className="round-wrap">
          <input className='round' type='text' value={round} spellCheck='false'
          onChange={e=>setRound(e.target.value)}
          />         
        </div>
      </Col>

      <label className="red-team" >
        <div className='red-team__logo'>
          {
            selectedRedTeam === 'Red'
            ? <img className='logo' alt={`red-team-logo-${selectedBlueTeam}`} src={transparencyImg}/>
            : <img className='logo' alt={`red-team-logo-${selectedBlueTeam}`} src={`${process.env.PUBLIC_URL}/assets/team_logo/${selectedRedTeam}.png`} />            
          }
        </div>
        
        <div className='red-team__name'>  
        <input type='button' id='red-name-input' className='name__button'
          onClick={()=>{
            toggleIsTeamSelectMenuOpen('red')              
          }}           
          onBlur={()=>{
            closeTeamSelectMenu('red')              
          }}           
          value={selectedRedTeam} 
          />                       
          <ul className="name__select" data-html2canvas-ignore>
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
              data-current-target={currentSelectingTeam === 'blue'  && currentSelectingIndex === index && pickBanPhase === 'Pick'}
              onClick={() =>{
                setCurrentSelectingIndex(index)
                setCurrentSelectingTeam('blue')
                setPickBanPhase('Pick')
                setGlobalPhase('PickBan')
              }}
              src={                  
                summoner.pickedChampion === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion}_0.jpg`
              }/>
              <div className="spell">
                <img alt={`spell1-${summoner.spell1}`} 
                onClick={() => {
                  setCurrentSelectingSpellNumber(1)
                  setCurrentSelectingIndex(index)
                  setCurrentSelectingTeam('blue')
                  setPickBanPhase('Spell')
                  setGlobalPhase('PickBan')
                }}
                data-current-target={currentSelectingTeam === 'blue' && currentSelectingIndex === index && pickBanPhase === 'Spell' && currentSelectingSpellNumber === 1}
                src={
                  summoner.spell1 === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell1}.png`
                }/>
                <img alt={`spell2-${summoner.spell2}`} 
                onClick={() => {
                  setCurrentSelectingSpellNumber(2)
                  setCurrentSelectingIndex(index)
                  setCurrentSelectingTeam('blue')
                  setPickBanPhase('Spell')
                  setGlobalPhase('PickBan')
                }}
                data-current-target={currentSelectingTeam === 'blue' && currentSelectingIndex === index && pickBanPhase === 'Spell' && currentSelectingSpellNumber === 2}
                src={ 
                  summoner.spell2 === ''
                  ? transparencyImg
                  : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell2}.png`
                }/>
              </div>
              <input className="player" type='text' value={player[`blue${index + 1}`]} spellCheck='false'
              onChange={(e)=>{onChangePlayer(e,`blue${index + 1}`)}}
              />
            </div>
          ))           
        }        
      </div>  

      {
      globalPhase === 'PickBan' && 
      <>
        {
        (pickBanPhase === 'Pick' || pickBanPhase === 'Ban') &&     
        <div className="champion-select-board">
          <div className="champion__select-option">          
            <div className="search">
              <label className="search-input-label" htmlFor="search">
                <img className='search-icon' src={searchIcon} alt="search-icon" data-for='search-tooltip' data-tip={searchToolTip}/>
                <ReactTooltip id='search-tooltip' multiline={true} delayShow={100}/>           
              </label>
              <input id='search' className="search-input" type='text' placeholder='챔피언 이름 검색' spellCheck="false"
              onChange={e=>onChangeSearchInput(e)}/>
            </div>  
          </div>
          <div className="champions"> 
            {
              champDataList.map((championData, index) =>(
                <div className="champion__card" key={index} 
                data-champion={championData.id}
                data-picked={isPickedChampion(championData.id)} 
                data-banned={isBannedChampion(championData.id)}
                onClick={()=>{
                  if(pickBanPhase === 'Pick'){
                    setPickedChampion(championData.id)                 
                  }
                  else{
                    setBannedChampion(championData.id)
                  };            
                }}
                >
                  <img className="champion__img" alt={championData.id} src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${championData.id}.png`}/>
                  <small className="champion__name">{championData.name}</small>
                </div>
              ))
            } 
          </div>
          {
          pickBanPhase === 'Pick' &&
          <input className="champion__select-button" type="button" value={pickBanPhase}
          onClick={()=>{
            onClickChampionPickButton()
          }}/>
          }

          {
          pickBanPhase === 'Ban' &&
          <input className="champion__select-button" type="button" value={pickBanPhase}
          onClick={()=>{
            onClickChampionBanButton()
          }}/>
          }
        
        </div>    
        }

        {
        pickBanPhase === 'Spell' && 
        <div className="spell-select-board" 
        data-helper-text-color={`${currentSelectingTeam}`}
        > 
          <div className="spell__select-helper">
            <div className="select-helper__text">
              <p>                
                {
                currentSelectingTeam === 'blue'
                ? `${player[`blue${currentSelectingIndex + 1}`]}`
                : `${player[`red${currentSelectingIndex + 1}`]}`
                } 스펠 선택중입니다.
              </p>
            </div>            
            <div className="select-helper__zoom-view">
              <img alt={`zoom-view-spell1`}
              data-current-target={currentSelectingSpellNumber === 1}
              onClick={()=>{setCurrentSelectingSpellNumber(1)}} 
              src={zoomViewImgSrc(1)}/>
              <img alt={`zoom-view-spell2`} 
              data-current-target={currentSelectingSpellNumber === 2}
              onClick={()=>{setCurrentSelectingSpellNumber(2)}}
              src={zoomViewImgSrc(2)}/>
            </div>
          </div> 
          <div className="spells">            
          {
            classicSpellList.map((spell, index) => (
              <div className="spell__card" key={index}
              data-picked-spell={isPickedSpell(spell.id)}
              onClick={()=>{
                setSpell(spell.id)
                onClickCurrentSelectingSpellNumberHandler()
              }}>                  
                <img className="spell__img" alt={`spell-img-${spell.id}`} src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${spell.id}.png`}/>
              </div>
            ))
          }
          </div>
          <div className="spell__select-button-wrap">
            <input className="spell__select-button" type="button" value={pickBanPhase}
            onClick={()=>{onClickSpellSelectButton()}}/>
          </div>
        </div>
        }
      </>
      } 

      {
      globalPhase === 'GoalEdit' &&
      <div id='todays-goal' className="todays-goal">
        <div className="goal__title-wrap">
          <input id='goal__title' className="goal__title" type="text" value={goalTitle} 
          onChange={e => onChangeGoalTitle(e)}
          />
        </div>
        {
        goalEditPhase === 'Editing' &&
        <>
        <div className='goal__editor-wrap' onClick={() => setGoalEditPhase('Editing')}>
          <Editor
            initialValue={viewerInput}
            previewStyle ='tap'
            hideModeSwitch = {true}
            viewer={false}
            height='100%'
            minHeight='300px'
            initialEditType = 'wysiwyg'
            useCommandShortcut = {false}
            language = 'ko-KR'
            ref={editorRef}
            onChange={()=>{
              onChangeEditor()
            }}
            usageStatistics={false}
            plugins={[colorSyntax]}
            toolbarItems={[
              // 툴바 옵션 설정
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
            ]}
          />          
        </div>
        <div id='goal__button-wrap' className='goal__button-wrap' data-html2canvas-ignore>
          <button onClick={() => setGoalEditPhase('EditDone')}>작성 완료</button>     
        </div>
        </>
        }

        {
        goalEditPhase === 'EditDone' &&
        <>
        <div className='goal__editor-wrap' onClick={()=>setGoalEditPhase('Editing')}> 
          <Viewer initialValue={viewerInput}/>
        </div>       
        <div id='goal__button-wrap' className='goal__button-wrap' data-html2canvas-ignore>
          <button data-for='button-tooltip1' data-tip={resultDownToolTip1} data-class='result-down-tooltip'
          onClick={()=> getDownloadResultPngFile('ban-pick-board')}
          >결과 다운로드</button>
          <ReactTooltip id='button-tooltip1' multiline={true} delayShow={100}/> 
            
          <button data-for='button-tooltip2' data-tip={resultDownToolTip2} data-class='result-down-tooltip'
          onClick={()=>{
            setGoalEditPhase('End')            
            document.documentElement.requestFullscreen()
            .then(() => document.documentElement.scroll(0,document.documentElement.clientHeight * 0.013))
            
          }}>직접 캡쳐</button>
          <ReactTooltip id='button-tooltip2' multiline={true} delayShow={100}/>           
        </div>
        </>       
        }

        {
        goalEditPhase === 'End' &&
        <div className='goal__editor-wrap' onClick={() => setGoalEditPhase('Editing')}> 
          <Viewer initialValue={viewerInput}/>
        </div>
        }
      </div>
      }      

      <div className="red-team__summoners">
      {
        redTeamSummoner.map((summoner, index)=>(
          <div className="summoner" key={index}>
            <img className="champion" id={`${summoner.pickedChampion}`} alt={`${summoner.pickedChampion}`}
            data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && pickBanPhase === 'Pick'}
            onClick={() =>{
              setCurrentSelectingIndex(index)
              setCurrentSelectingTeam('red')
              setPickBanPhase('Pick')
              setGlobalPhase('PickBan')
            }}  
            src={                  
              summoner.pickedChampion === ''
              ? transparencyImg
              : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion}_0.jpg`
            }/>
            <div className="spell">
              <img alt="spell1"
              onClick={() => {
                setCurrentSelectingSpellNumber(1)
                setCurrentSelectingIndex(index)
                setCurrentSelectingTeam('red')
                setPickBanPhase('Spell')
              }}
              data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && pickBanPhase === 'Spell' && currentSelectingSpellNumber === 1}
              src={
                summoner.spell1 === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell1}.png`
              }/>
              <img alt="spell2" 
              onClick={() => {
                setCurrentSelectingSpellNumber(2)
                setCurrentSelectingIndex(index)
                setCurrentSelectingTeam('red')
                setPickBanPhase('Spell')
              }}
              data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && pickBanPhase === 'Spell' && currentSelectingSpellNumber === 2}
              src={                  
                summoner.spell2 === ''
                ? transparencyImg
                : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell2}.png`
              }/>
            </div>
            <input className="player" type='text' value={player[`red${index + 1}`]} spellCheck='false'
            onChange={(e)=>{onChangePlayer(e,`red${index + 1}`)}}
            />
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
            data-current-target={currentSelectingTeam === 'blue' && currentSelectingIndex === index && pickBanPhase === 'Ban'}
            onClick={()=>{
              setCurrentSelectingTeam('blue')
              setCurrentSelectingIndex(index)
              setPickBanPhase('Ban')
              setGlobalPhase('PickBan')
            }}
            src={
            summoner.bannedChampion === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${summoner.bannedChampion}.png`}/>
          </div>
        ))
      }
      </div>    

      <div id='match-result-wrap' className='match-result-wrap'>
        <input type='text' id='match-result' className='match-result' value={matchResult} spellCheck='false'
        onChange={e=> setMatchResult(e.target.value)}/>     
      </div>

      <div className="red-team__ban">
      {
        redTeamSummoner.map((summoner, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' alt={`redTeam-banned-${index}-${summoner.bannedChampion}`}
            data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && pickBanPhase === 'Ban'}
            onClick={()=>{
              setCurrentSelectingTeam('red')
              setCurrentSelectingIndex(index)
              setPickBanPhase('Ban')
              setGlobalPhase('PickBan')
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


