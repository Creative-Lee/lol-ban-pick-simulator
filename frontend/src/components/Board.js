import React,{ useEffect, useState , useRef} from 'react'
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
  const tooltipText = 
  `[빠른 결과 모드] 는 Ban-Pick 순서와는 상관없이 빠르게 데이터 입력이 가능하고, 기본 스펠이 자동으로 입력됩니다.<br>
  [토너먼트 드래프트 모드] 는 전통 Ban-Pick 룰에 따라 진행됩니다. (현재 개발중입니다^^)`

  const teamArr = ['KDF', 'T1', 'DK' ,'BRO' , 'DRX', 'GEN', 'HLE', 'KT', 'LSB', 'NS']

  const isMountedRef = useRef(false);
  const editorRef = useRef();

  const [board,setBoard] = useState('setting') // setting, banpick
  const [mode,setMode] = useState('rapid') // simulation, rapid
  const [phase, setPhase] = useState('Pick')  // Pick, Ban, End
  const [globalPhase, setGlobalPhase] = useState('GoalEdit') // PickBan, GoalEdit,
  const [currentSelectingTeam, setCurrentSelectingTeam] = useState('blue') // blue, red
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(0) // 0 ~ 4 
  const [isGoalEditDone, setIsGoalEditDone] = useState(false)

  const [champDataList, setChampDataList] = useState([])
  const [selectedBlueTeam, setSelectedBlueTeam] = useState('')
  const [selectedRedTeam, setSelectedRedTeam] = useState('')
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
    console.log(editorInputHtml)
    setViewerInput(editorInputHtml)
  }

  const updateMatchChampDataList = () => {    
    const championNameList = ascendingChampionDataList.map(data => data.name)
    let searcher = new Hangul.Searcher(searchInput);
    
    const letterMatchedChampNameList = championNameList.filter(championName => searcher.search(championName) >= 0)        
    const chosungMatchedChampNameList = championNameList.filter(championName => {   
      const champChosungStrArr = Hangul.d(championName,true)
      .map(disEachLetterList => disEachLetterList[0]) // ['ㄱ', 'ㄹ'] or ['ㄱ', 'ㄹ', 'ㅇ']
      .join('')// ['ㄱㄹ'] or ['ㄱㄹㅇ']
      .replace(/ /gi,"") //띄어쓰기 제거
      
      const searchInputChosungStrArr = Hangul.d(searchInput).join('') // ['ㄱㄹ']      
      return champChosungStrArr.includes(searchInputChosungStrArr)
    })
    const mergedChampNameList = letterMatchedChampNameList.concat(chosungMatchedChampNameList)
    const duplicatesRemovedChampNameList = mergedChampNameList.filter((name, index) => mergedChampNameList.indexOf(name) === index) 

    const matchedChampDataList = ascendingChampionDataList.filter(data => duplicatesRemovedChampNameList.includes(data.name))
    
    setChampDataList(matchedChampDataList)
    
    console.log('매치챔프 업데이트 실행')
  } 

  const toggleIsTeamSelectMenuOpen = teamColor => {
    setIsTeamSelectMenuOpen(prevState=> ({...prevState , [teamColor] : !prevState[teamColor]}))
    console.log('toggle')
  }
  const closeTeamSelectMenu = teamColor => {
    setIsTeamSelectMenuOpen(prevState => ({...prevState , [teamColor] : false}))
    console.log('close')
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

  const onClickAllTargetController = () => {
    if(isPickBanPhaseEnd()){
      setPhase('End')
      setGlobalPhase('GoalEdit')
      return
    }

    if(isCurrentSelectingIndexChampionDataEmpty()){
      return
    }

    if(currentSelectingIndex < 4){
      setCurrentSelectingIndex(currentSelectingIndex + 1)
      return
    }
      
    if(isPickPhaseEnd()){
      setPhase('Ban')
    }
    
    if(isBanPhaseEnd()){
      setPhase('Pick')
    }

    if(currentSelectingTeam === 'blue'){
      setCurrentSelectingTeam('red')           
    }
    else{
      setCurrentSelectingTeam('blue')
    }

    setCurrentSelectingIndex(0) 
  }

  const isCurrentSelectingIndexChampionDataEmpty = () => {
    if(phase === 'Pick'){
      if(currentSelectingTeam === 'blue'){
        return blueTeamSummoner[currentSelectingIndex].pickedChampion === ''
      }      
      return redTeamSummoner[currentSelectingIndex].pickedChampion === ''
    }
    else{
      if(currentSelectingTeam === 'blue'){
        return blueTeamSummoner[currentSelectingIndex].bannedChampion === ''
      }
      return redTeamSummoner[currentSelectingIndex].bannedChampion === ''
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

  const isPickBanPhaseEnd = () => {
    return isPickPhaseEnd() && isBanPhaseEnd()
  }
  
  const activatePlayerPrefix = () => {
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

  const activateSpellPlaceholder = () => {
    const blueTeamUpdateArr = blueTeamSummoner.map(summoner => summoner.setSpell2('Flash'))
    blueTeamUpdateArr[1].spell1 = 'Smite'

    const redTeamUpdateArr = redTeamSummoner.map(summoner => summoner.setSpell2('Flash'))
    redTeamUpdateArr[1].spell1 = 'Smite' 
        
    setBlueTeamSummoner(blueTeamUpdateArr)
    setRedTeamSummoner(redTeamUpdateArr)
    console.log('스펠 플레이스 홀더 함수 실행')
  }

  const isPicked = (championName) => {
    const blueTeamPicked = blueTeamSummoner.map(summoner=>summoner.pickedChampion)
    const redTeamPicked = redTeamSummoner.map(summoner=>summoner.pickedChampion)    
    const allTeamPickedList = [...blueTeamPicked, ...redTeamPicked]

    return allTeamPickedList.includes(championName)
  }
  const isBanned = (championName) => {
    const blueTeamBanned = blueTeamSummoner.map(summoner=>summoner.bannedChampion)
    const redTeamBanned = redTeamSummoner.map(summoner=>summoner.bannedChampion)    
    const allTeamBannedList = [...blueTeamBanned, ...redTeamBanned]

    return allTeamBannedList.includes(championName)
  }

  
  
  useEffect(()=>{ //activatePlayerPrefix
    activatePlayerPrefix()       
  },[selectedBlueTeam, selectedRedTeam])
  
  useEffect(()=>{ //activateSpellPlaceholder
    if(mode === 'rapid' && isMountedRef.current === true){
      activateSpellPlaceholder()
      return
    }
    isMountedRef.current = true;
  },[board])   

  useEffect(()=>{ // updateMatchChampDataList
    updateMatchChampDataList()
  },[searchInput, board])

  

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
              data-current-target={currentSelectingTeam === 'blue'  && currentSelectingIndex === index && phase === 'Pick'}
              onClick={() =>{
                setCurrentSelectingIndex(index)
                setCurrentSelectingTeam('blue')
                setPhase('Pick')
                setGlobalPhase('PickBan')
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
      globalPhase === 'PickBan' && 
      <div className="champion-select-board">
        <div className="champion__select-option">          
          <div className="search">
            <label className="search-input-label" htmlFor="search">
              <img className='search-icon' src={searchIcon} alt="search-icon"/>
            </label>
            <input id='search' className="search-input" type='text' placeholder='챔피언 이름 검색'
            onChange={e=>onChangeSearchInput(e)}/>
          </div>
        </div>
        <div className="champions"> 
          {
            champDataList.map((championData, index) =>(
              <div className="champion__card" key={index} 
              data-champion={championData.id}
              data-picked={isPicked(championData.id)} 
              data-banned={isBanned(championData.id)}
              onClick={(e)=>{
                if(phase === 'Pick'){
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
        <input className="champion__select-button" type="button" value={phase}
        onClick={()=>{
          onClickAllTargetController()
        }}/>
      </div>
      }      
      {
      globalPhase === 'GoalEdit' &&
      <div className="todays-goal">
        <div className="goal__title-wrap">
          <input className="goal__title" type="text" value={goalTitle} 
          onChange={e => onChangeGoalTitle(e)}
          />
        </div>
        <div className='goal__editor-wrap'>
        {
          isGoalEditDone === false ?
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
              onChange={onChangeEditor}
              usageStatistics={false}
              plugins={[colorSyntax]}
              toolbarItems={[
                // 툴바 옵션 설정
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
            ]}
          />
          : 
          <Viewer initialValue={viewerInput}/>       
        }              
        </div>
        <div id='goal__button-wrap' className='goal__button-wrap'>
          <button onClick={()=> setIsGoalEditDone(!isGoalEditDone)}>{isGoalEditDone === false ? '작성 완료' : '메모 수정'}</button>
          <button onClick={()=> getDownloadResultPngFile('ban-pick-board', 'goal__button-wrap')}>Finish</button>
        </div>
        </div>
      }        

      <div className="red-team__summoners">
      {
        redTeamSummoner.map((summoner, index)=>(
          <div className="summoner" key={index}>
            <img className="champion" id={`${summoner.pickedChampion}`} alt={`${summoner.pickedChampion}`}
            data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && phase === 'Pick'}
            onClick={() =>{
              setCurrentSelectingIndex(index)
              setCurrentSelectingTeam('red')
              setPhase('Pick')
              setGlobalPhase('PickBan')
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
            data-current-target={currentSelectingTeam === 'blue' && currentSelectingIndex === index && phase === 'Ban'}
            onClick={()=>{
              setCurrentSelectingTeam('blue')
              setCurrentSelectingIndex(index)
              setPhase('Ban')
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

      <div className='match-result-wrap'>
        <input type='text' className='match-result' value={matchResult}
        onChange={e=> setMatchResult(e.target.value)}/>     
      </div>

      <div className="red-team__ban">
      {
        redTeamSummoner.map((summoner, index) => (
          <div className='banned-champion-wrap' key={index}>
            <img className='banned-champion' alt={`redTeam-banned-${index}-${summoner.bannedChampion}`}
            data-current-target={currentSelectingTeam === 'red' && currentSelectingIndex === index && phase === 'Ban'}
            onClick={()=>{
              setCurrentSelectingTeam('red')
              setCurrentSelectingIndex(index)
              setPhase('Ban')
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


