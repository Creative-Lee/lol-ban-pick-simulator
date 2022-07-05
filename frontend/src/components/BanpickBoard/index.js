import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactTooltip from 'react-tooltip'
import Hangul from 'hangul-js'
import { Container, Row, Col } from 'react-bootstrap'
import { Editor, Viewer } from '@toast-ui/react-editor'
import { getDownloadResultPngFile } from '../../apis/get'

import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor/dist/i18n/ko-kr'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import {
  searchIcon,
  transparencyImg,
  noBanIcon,
} from '../../Assets/img/import_img'

import MatchInfo from './MatchInfo'
import SummonerCard from './SummonerCard'
import TeamSelectMenu from './TeamSelectMenu'

export default function BanpickBoard({
  boardPhase,
  mode,
  recentVersion,
  ascendingChampionDataList,
  classicSpellList,
}) {
  const resultDownToolTip1 = `밴픽 결과를 이미지 파일로 변환하여 자동 다운로드 합니다.<br>
  주의하세요💩 : 소환사 챔피언 이미지와 일부 텍스트 사이즈가 조정되어 보이는 화면과 차이가 있습니다.<br>
  (추후 사이즈 조정 없이 저장 가능하도록 업데이트 예정입니다^^)`
  const resultDownToolTip2 = `결과 캡쳐를 위해 버튼 탭이 사라지고, 전체화면으로 전환되며, 스크롤이 조정됩니다.<br>  
  (업데이트와 함께 사라질 기능입니다^^)`
  const searchToolTip = `기본, 초성 검색이 가능합니다🧐<br>
  띄어쓰기도 걱정하지 마세요! ex)리 신, 탐 켄치 
  `

  const teamArr = [
    'KDF',
    'T1',
    'DK',
    'BRO',
    'DRX',
    'GEN',
    'HLE',
    'KT',
    'LSB',
    'NS',
  ]

  const isMountedRef = useRef(false)
  const editorRef = useRef()

  const [globalPhase, setGlobalPhase] = useState('PickBan') // PickBan, GoalEdit, End
  const [pickBanPhase, setPickBanPhase] = useState('Pick') // Pick, Ban, Spell, End
  const [goalEditPhase, setGoalEditPhase] = useState('Editing') // Editing, EditDone, End
  const [currentSelectingTeam, setCurrentSelectingTeam] = useState('blue') // blue, red
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(0) // 0 ~ 4
  const [currentSelectingSpellNumber, setCurrentSelectingSpellNumber] =
    useState(1) // 1, 2

  const [champDataList, setChampDataList] = useState([])
  const [selectedBlueTeam, setSelectedBlueTeam] = useState('Blue')
  const [selectedRedTeam, setSelectedRedTeam] = useState('Red')
  const [isTeamSelectMenuOpen, setIsTeamSelectMenuOpen] = useState({
    blue: false,
    red: false,
  })

  const [searchInput, setSearchInput] = useState('')

  const [matchResult, setMatchResult] = useState('Win or Lose')
  const [goalPatchVersion, setGoalPatchVersion] = useState('Patch version : ')
  const [viewerInput, setViewerInput] = useState('')

  const [player, setPlayer] = useState({
    blue1: '',
    blue2: '',
    blue3: '',
    blue4: '',
    blue5: '',
    red1: '',
    red2: '',
    red3: '',
    red4: '',
    red5: '',
  })

  class Summoner {
    constructor({
      pickedChampion = { data: '', isConfirmed: false },
      bannedChampion = { data: '', isConfirmed: false },
      spell1 = { data: '', isConfirmed: false },
      spell2 = { data: '', isConfirmed: false },
    }) {
      this.pickedChampion = pickedChampion
      this.bannedChampion = bannedChampion
      this.spell1 = spell1
      this.spell2 = spell2
    }

    updateSummoner({
      type,
      data = this[type].data,
      isConfirmed = this[type].isConfirmed,
    }) {
      return new Summoner({
        pickedChampion: this.pickedChampion,
        bannedChampion: this.bannedChampion,
        spell1: this.spell1,
        spell2: this.spell2,
        [type]: {
          data: data,
          isConfirmed: isConfirmed,
        },
      })
    }

    isEmpty(type) {
      return this[type].data === ''
    }

    switchingSpells() {
      return new Summoner({
        pickedChampion: this.pickedChampion,
        bannedChampion: this.bannedChampion,
        spell1: { data: this.spell2.data, isConfirmed: false },
        spell2: { data: this.spell1.data, isConfirmed: false },
      })
    }

    confirmSpells() {
      return new Summoner({
        pickedChampion: this.pickedChampion,
        bannedChampion: this.bannedChampion,
        spell1: { data: this.spell1.data, isConfirmed: true },
        spell2: { data: this.spell2.data, isConfirmed: true },
      })
    }
  }

  const [blueTeamSummoner, setBlueTeamSummoner] = useState([
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
  ])
  const [redTeamSummoner, setRedTeamSummoner] = useState([
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
  ])

  const onChangeSearchInput = (e) => setSearchInput(e.target.value)
  const onChangePlayer = (e, teamNumber) =>
    setPlayer({ ...player, [teamNumber]: e.target.value })
  const onChangeGoalPatchVersion = (e) => setGoalPatchVersion(e.target.value)
  const onChangeEditor = () => {
    const editorInputHtml = editorRef.current.getInstance().getHTML()
    setViewerInput(editorInputHtml)
  }

  const updateMatchChampDataList = useCallback(() => {
    const championNameList = ascendingChampionDataList.map((data) => data.name)
    let searcher = new Hangul.Searcher(searchInput)

    const letterMatchedChampNameList = championNameList.filter(
      (championName) => searcher.search(championName) >= 0
    )
    const letterMatchedChampNameListWithoutSpace = championNameList.filter(
      (championName) => searcher.search(championName.replace(/ /gi, '')) >= 0
    )
    const chosungMatchedChampNameList = championNameList.filter(
      (championName) => {
        const champChosungStrArr = Hangul.d(championName, true)
          .map((disEachLetterList) => disEachLetterList[0]) // ['ㄱ', 'ㄹ'] and ['ㄱ', 'ㄹ', 'ㅇ'] ...something
          .join('') // ['ㄱㄹ'] and ['ㄱㄹㅇ'] ...something
          .replace(/ /gi, '') // 띄어쓰기 제거

        const searchInputChosungStrArr = Hangul.d(searchInput).join('') // ['ㄱ','ㄹ'] -> ['ㄱㄹ']
        return champChosungStrArr.includes(searchInputChosungStrArr)
      }
    )

    const mergedChampNameList = letterMatchedChampNameList.concat(
      letterMatchedChampNameListWithoutSpace,
      chosungMatchedChampNameList
    )
    const duplicatesRemovedChampNameList = mergedChampNameList.filter(
      (name, index) => mergedChampNameList.indexOf(name) === index
    )

    const matchedChampDataList = ascendingChampionDataList.filter((data) =>
      duplicatesRemovedChampNameList.includes(data.name)
    )

    setChampDataList(matchedChampDataList)
  }, [ascendingChampionDataList, searchInput])

  const toggleIsTeamSelectMenuOpen = (teamColor) => {
    setIsTeamSelectMenuOpen((prevState) => ({
      ...prevState,
      [teamColor]: !prevState[teamColor],
    }))
  }
  const closeTeamSelectMenu = (teamColor) => {
    setIsTeamSelectMenuOpen((prevState) => ({
      ...prevState,
      [teamColor]: false,
    }))
  }

  const updateSummonerData = ({ type, data, isConfirmed }) => {
    let [team, setTeam] =
      currentSelectingTeam === 'blue'
        ? [blueTeamSummoner, setBlueTeamSummoner]
        : [redTeamSummoner, setRedTeamSummoner]
    let updatedArr = [...team]

    updatedArr[currentSelectingIndex] = team[
      currentSelectingIndex
    ].updateSummoner({ type: type, data: data, isConfirmed: isConfirmed })

    setTeam(updatedArr)
  }

  const updateSpell = (spellName) => {
    let [team, setTeam] =
      currentSelectingTeam === 'blue'
        ? [blueTeamSummoner, setBlueTeamSummoner]
        : [redTeamSummoner, setRedTeamSummoner]
    let updatedArr = [...team]
    let currentSpell1 = team[currentSelectingIndex].spell1.data
    let currentSpell2 = team[currentSelectingIndex].spell2.data

    if (
      (currentSelectingSpellNumber === 1 && currentSpell2 === spellName) ||
      (currentSelectingSpellNumber === 2 && currentSpell1 === spellName)
    ) {
      updatedArr[currentSelectingIndex] =
        team[currentSelectingIndex].switchingSpells()
      setTeam(updatedArr)
      return
    }
    updatedArr[currentSelectingIndex] = team[
      currentSelectingIndex
    ].updateSummoner({
      type: `spell${currentSelectingSpellNumber}`,
      data: spellName,
      isConfirmed: false,
    })
    setTeam(updatedArr)
  }

  const isCurrentSelectingDataEmpty = (type) => {
    let team =
      currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner
    return team[currentSelectingIndex].isEmpty(type)
  }

  const onClickChampionPickButton = () => {
    if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
      updateSummonerData({ type: 'pickedChampion', isConfirmed: true })
    }
  }

  const onClickChampionBanButton = () => {
    if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
      updateSummonerData({ type: 'bannedChampion', isConfirmed: true })
    }
  }

  const onClickSpellSelectButton = () => {
    if (
      !isCurrentSelectingDataEmpty('spell1') &&
      !isCurrentSelectingDataEmpty('spell2')
    ) {
      let [team, setTeam] =
        currentSelectingTeam === 'blue'
          ? [blueTeamSummoner, setBlueTeamSummoner]
          : [redTeamSummoner, setRedTeamSummoner]
      let updatedArr = [...team]

      updatedArr[currentSelectingIndex] =
        team[currentSelectingIndex].confirmSpells()
      setTeam(updatedArr)
    }
  }

  const activatePlayerPrefix = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      blue1: `${selectedBlueTeam} TOP`,
      blue2: `${selectedBlueTeam} JGL`,
      blue3: `${selectedBlueTeam} MID`,
      blue4: `${selectedBlueTeam} BOT`,
      blue5: `${selectedBlueTeam} SUP`,
      red1: `${selectedRedTeam} TOP`,
      red2: `${selectedRedTeam} JGL`,
      red3: `${selectedRedTeam} MID`,
      red4: `${selectedRedTeam} BOT`,
      red5: `${selectedRedTeam} SUP`,
    }))
  }, [selectedBlueTeam, selectedRedTeam])

  const activateSpellPlaceholder = useCallback(() => {
    const blueTeamUpdateArr = blueTeamSummoner.map((summoner) =>
      summoner.updateSummoner({
        type: 'spell2',
        data: 'SummonerFlash',
        isConfirmed: true,
      })
    )
    blueTeamUpdateArr[0].spell1.data = 'SummonerTeleport'
    blueTeamUpdateArr[0].spell1.isConfirmed = true
    blueTeamUpdateArr[1].spell1.data = 'SummonerSmite'
    blueTeamUpdateArr[1].spell1.isConfirmed = true
    blueTeamUpdateArr[2].spell1.data = 'SummonerTeleport'
    blueTeamUpdateArr[2].spell1.isConfirmed = true
    blueTeamUpdateArr[3].spell1.data = 'SummonerHeal'
    blueTeamUpdateArr[3].spell1.isConfirmed = true
    blueTeamUpdateArr[4].spell1.data = 'SummonerExhaust'
    blueTeamUpdateArr[4].spell1.isConfirmed = true

    const redTeamUpdateArr = redTeamSummoner.map((summoner) =>
      summoner.updateSummoner({
        type: 'spell2',
        data: 'SummonerFlash',
        isConfirmed: true,
      })
    )
    redTeamUpdateArr[0].spell1.data = 'SummonerTeleport'
    redTeamUpdateArr[0].spell1.isConfirmed = true
    redTeamUpdateArr[1].spell1.data = 'SummonerSmite'
    redTeamUpdateArr[1].spell1.isConfirmed = true
    redTeamUpdateArr[2].spell1.data = 'SummonerTeleport'
    redTeamUpdateArr[2].spell1.isConfirmed = true
    redTeamUpdateArr[3].spell1.data = 'SummonerHeal'
    redTeamUpdateArr[3].spell1.isConfirmed = true
    redTeamUpdateArr[4].spell1.data = 'SummonerExhaust'
    redTeamUpdateArr[4].spell1.isConfirmed = true

    setBlueTeamSummoner(blueTeamUpdateArr)
    setRedTeamSummoner(redTeamUpdateArr)
  }, [blueTeamSummoner, redTeamSummoner])

  const isPickedChampion = (championName) => {
    const blueTeamPicked = blueTeamSummoner.map(
      (summoner) => summoner.pickedChampion.data
    )
    const redTeamPicked = redTeamSummoner.map(
      (summoner) => summoner.pickedChampion.data
    )
    const allTeamPickedList = [...blueTeamPicked, ...redTeamPicked]

    return allTeamPickedList.includes(championName)
  }

  const isBannedChampion = (championName) => {
    const blueTeamBanned = blueTeamSummoner.map(
      (summoner) => summoner.bannedChampion.data
    )
    const redTeamBanned = redTeamSummoner.map(
      (summoner) => summoner.bannedChampion.data
    )
    const allTeamBannedList = [...blueTeamBanned, ...redTeamBanned]

    return allTeamBannedList.includes(championName)
  }

  const isPickedSpell = (spellName) => {
    let team =
      currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner

    const isMatchedSummonerSpell1 =
      team[currentSelectingIndex].spell1.data === spellName
    const isMatchedSummonerSpell2 =
      team[currentSelectingIndex].spell2.data === spellName

    return isMatchedSummonerSpell1 || isMatchedSummonerSpell2
  }

  const bannedChampionImgSrc = (summoner) => {
    switch (summoner.bannedChampion.data) {
      case '':
        return transparencyImg
      case 'noBan':
        return noBanIcon
      default:
        return `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${summoner.bannedChampion.data}.png`
    }
  }
  const zoomViewImgSrc = (spellNumber) => {
    let team =
      currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner

    return team[currentSelectingIndex][`spell${spellNumber}`] === ''
      ? transparencyImg
      : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${
          team[currentSelectingIndex][`spell${spellNumber}`].data
        }.png`
  }

  const currentSelectingType = () => {
    let type

    switch (pickBanPhase) {
      case 'Pick':
        type = 'pickedChampion'
        break
      case 'Ban':
        type = 'bannedChampion'
        break
      case 'Spell':
        type = `spell${currentSelectingSpellNumber}`
        break
      default:
        break
    }

    return type
  }

  const isPickPhaseEnd = () => {
    let blueTeamPickPhaseEnd = !blueTeamSummoner
      .map((summoner) => summoner.pickedChampion.isConfirmed)
      .includes(false)
    let redTeamPickPhaseEnd = !redTeamSummoner
      .map((summoner) => summoner.pickedChampion.isConfirmed)
      .includes(false)

    return blueTeamPickPhaseEnd && redTeamPickPhaseEnd
  }

  const isBanPhaseEnd = () => {
    let blueTeamPickPhaseEnd = !blueTeamSummoner
      .map((summoner) => summoner.bannedChampion.isConfirmed)
      .includes(false)
    let redTeamPickPhaseEnd = !redTeamSummoner
      .map((summoner) => summoner.bannedChampion.isConfirmed)
      .includes(false)

    return blueTeamPickPhaseEnd && redTeamPickPhaseEnd
  }

  const isSpellPhaseEnd = () => {
    let blueTeamSpell1Confirmed = !blueTeamSummoner
      .map((summoner) => summoner.spell1.isConfirmed)
      .includes(false)
    let blueTeamSpell2Confirmed = !blueTeamSummoner
      .map((summoner) => summoner.spell2.isConfirmed)
      .includes(false)
    let redTeamSpell1Confirmed = !redTeamSummoner
      .map((summoner) => summoner.spell1.isConfirmed)
      .includes(false)
    let redTeamSpell2Confirmed = !redTeamSummoner
      .map((summoner) => summoner.spell2.isConfirmed)
      .includes(false)

    let blueTeamSpellPhaseEnd =
      blueTeamSpell1Confirmed && blueTeamSpell2Confirmed
    let redTeamSpellPhaseEnd = redTeamSpell1Confirmed && redTeamSpell2Confirmed

    return blueTeamSpellPhaseEnd && redTeamSpellPhaseEnd
  }

  const isAllPickBanPhaseEnd = () => {
    return isPickPhaseEnd() && isBanPhaseEnd() && isSpellPhaseEnd()
  }

  const currentSelectingIndexController = () => {
    const notConfirmedIndexChecker = () => {
      let notConfirmedIndex
      let team =
        currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner

      notConfirmedIndex = team
        .map((summoner) => summoner[currentSelectingType()].isConfirmed)
        .findIndex((isConfirmed) => isConfirmed === false)

      if (notConfirmedIndex >= 0) {
        setCurrentSelectingIndex(notConfirmedIndex)
        return
      }
    }

    if (currentSelectingIndex < 4) {
      setCurrentSelectingIndex((before) => before + 1)
      return
    }
    notConfirmedIndexChecker()
  }

  const currentSelectingTeamController = () => {
    setCurrentSelectingIndex(0)

    if (currentSelectingTeam === 'blue') {
      setCurrentSelectingTeam('red')
    } else {
      setCurrentSelectingTeam('blue')
    }
  }
  const currentPhaseController = () => {
    setCurrentSelectingTeam('blue')

    if (isAllPickBanPhaseEnd()) {
      setGlobalPhase('GoalEdit')
      setPickBanPhase('End')
      return
    }

    if (pickBanPhase === 'Pick') {
      if (isBanPhaseEnd()) {
        setPickBanPhase('Spell')
        return
      }
      setPickBanPhase('Ban')
      return
    }
    if (pickBanPhase === 'Ban') {
      if (!isPickPhaseEnd()) {
        setPickBanPhase('Pick')
        return
      }
      setPickBanPhase('Spell')
      return
    }
    if (pickBanPhase === 'Spell') {
      if (!isPickPhaseEnd()) {
        setPickBanPhase('Pick')
        return
      }
      setPickBanPhase('Ban')
      return
    }
  }
  const currentSelectingSpellNumberController = () => {
    const isCurrentIndexSpellAllConfirmed = () => {
      let team =
        currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner
      let spell1Confirmed = team[currentSelectingIndex].spell1.isConfirmed
      let spell2Confirmed = team[currentSelectingIndex].spell2.isConfirmed

      return spell1Confirmed && spell2Confirmed
    }

    if (isCurrentIndexSpellAllConfirmed()) {
      setCurrentSelectingSpellNumber(1)
      return
    }

    if (currentSelectingSpellNumber === 1) {
      setCurrentSelectingSpellNumber(2)
      return
    }
    setCurrentSelectingSpellNumber(1)
  }

  const isCurrentSelectingIndexDataConfirmed = () => {
    let team =
      currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner
    return team[currentSelectingIndex][currentSelectingType()].isConfirmed
  }

  const isCurrentSelectingTeamDataConfirmed = () => {
    let team =
      currentSelectingTeam === 'blue' ? blueTeamSummoner : redTeamSummoner

    return !team
      .map((summoner) => summoner[currentSelectingType()].isConfirmed)
      .includes(false)
  }

  const isCurrentSelectingBothTeamDataConfirmed = () => {
    let blueTeamDataConfirmed = !blueTeamSummoner
      .map((summoner) => summoner[currentSelectingType()].isConfirmed)
      .includes(false)
    let redTeamDataConfirmed = !redTeamSummoner
      .map((summoner) => summoner[currentSelectingType()].isConfirmed)
      .includes(false)
    return blueTeamDataConfirmed && redTeamDataConfirmed
  }

  useEffect(() => {
    if (isCurrentSelectingIndexDataConfirmed()) {
      currentSelectingIndexController()
      console.log('index 0 ~ 4 순서 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeamSummoner, redTeamSummoner])

  useEffect(() => {
    if (isCurrentSelectingTeamDataConfirmed()) {
      currentSelectingTeamController()
      console.log('team ~ team 순서 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeamSummoner, redTeamSummoner])

  useEffect(() => {
    if (isCurrentSelectingBothTeamDataConfirmed()) {
      currentPhaseController()
      console.log('phase ~ phase 순서 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeamSummoner, redTeamSummoner])

  useEffect(() => {
    setGoalEditPhase('Editing')
  }, [globalPhase])

  useEffect(() => {
    if (pickBanPhase === 'Spell') {
      currentSelectingSpellNumberController()
      console.log('spellNumber 변경 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeamSummoner, redTeamSummoner])

  useEffect(() => {
    //activatePlayerPrefix
    activatePlayerPrefix()
    console.log('activate PlayerPrefix')
  }, [activatePlayerPrefix])

  useEffect(() => {
    //activateSpellPlaceholder
    if (mode === 'rapid' && isMountedRef.current === true) {
      activateSpellPlaceholder()
      console.log('activate Spell Placeholder')
      return
    }
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardPhase])

  useEffect(() => {
    // updateMatchChampDataList
    updateMatchChampDataList()
    console.log('matchedChampDataList update compleat')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, boardPhase])

  useEffect(() => {
    setSearchInput('')
    console.log('Initialize search input')
  }, [currentSelectingIndex])

  return (
    <Container id="ban-pick-board" className="ban-pick-board">
      <Row id="board-top" className="board-top">
        <TeamSelectMenu />
        <MatchInfo />
        <TeamSelectMenu />
      </Row>

      <Row className="board-middle">
        <div className="blue-team__summoners">
          {blueTeamSummoner.map((summoner, index) => (
            <SummonerCard />
          ))}
        </div>

        {globalPhase === 'PickBan' && (
          <>
            {pickBanPhase === 'Pick' && (
              <div className="champion-select-board">
                <div className="champion__select-option">
                  <div className="search">
                    <label className="search-input-label" htmlFor="search">
                      <img
                        className="search-icon"
                        src={searchIcon}
                        alt="search-icon"
                        data-for="search-tooltip"
                        data-tip={searchToolTip}
                      />
                      <ReactTooltip
                        id="search-tooltip"
                        multiline={true}
                        delayShow={100}
                      />
                    </label>
                    <input
                      id="search"
                      className="search-input"
                      type="text"
                      placeholder="챔피언 이름 검색"
                      spellCheck="false"
                      value={searchInput}
                      onChange={(e) => onChangeSearchInput(e)}
                    />
                  </div>
                </div>
                <div className="champions">
                  {champDataList.map((championData, index) => (
                    <div
                      className="champion__card"
                      key={index}
                      data-champion={championData.id}
                      data-picked={isPickedChampion(championData.id)}
                      data-banned={isBannedChampion(championData.id)}
                      onClick={() => {
                        updateSummonerData({
                          type: 'pickedChampion',
                          data: championData.id,
                          isConfirmed: false,
                        })
                      }}
                    >
                      <img
                        className="champion__img"
                        alt={championData.id}
                        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${championData.id}.png`}
                      />
                      <small className="champion__name">
                        {championData.name}
                      </small>
                    </div>
                  ))}
                </div>
                <input
                  className="champion__select-button"
                  type="button"
                  value={pickBanPhase}
                  onClick={() => {
                    onClickChampionPickButton()
                  }}
                />
              </div>
            )}

            {pickBanPhase === 'Ban' && (
              <div className="champion-select-board">
                <div className="champion__select-option">
                  <div className="search">
                    <label className="search-input-label" htmlFor="search">
                      <img
                        className="search-icon"
                        src={searchIcon}
                        alt="search-icon"
                        data-for="search-tooltip"
                        data-tip={searchToolTip}
                      />
                      <ReactTooltip
                        id="search-tooltip"
                        multiline={true}
                        delayShow={100}
                      />
                    </label>
                    <input
                      id="search"
                      className="search-input"
                      type="text"
                      placeholder="챔피언 이름 검색"
                      spellCheck="false"
                      value={searchInput}
                      onChange={(e) => onChangeSearchInput(e)}
                    />
                  </div>
                </div>
                <div className="champions">
                  <div
                    className="champion__card"
                    onClick={() => {
                      updateSummonerData({
                        type: 'bannedChampion',
                        data: 'noBan',
                        isConfirmed: false,
                      })
                    }}
                  >
                    <img
                      className="champion__img"
                      alt="no-ban-icon"
                      src={noBanIcon}
                    />
                    <small className="champion__name">없음</small>
                  </div>
                  {champDataList.map((championData, index) => (
                    <div
                      className="champion__card"
                      key={index}
                      data-champion={championData.id}
                      data-picked={isPickedChampion(championData.id)}
                      data-banned={isBannedChampion(championData.id)}
                      onClick={() => {
                        updateSummonerData({
                          type: 'bannedChampion',
                          data: championData.id,
                          isConfirmed: false,
                        })
                      }}
                    >
                      <img
                        className="champion__img"
                        alt={championData.id}
                        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${championData.id}.png`}
                      />
                      <small className="champion__name">
                        {championData.name}
                      </small>
                    </div>
                  ))}
                </div>
                <input
                  className="champion__select-button"
                  type="button"
                  value={pickBanPhase}
                  onClick={() => {
                    onClickChampionBanButton()
                  }}
                />
              </div>
            )}

            {pickBanPhase === 'Spell' && (
              <div
                className="spell-select-board"
                data-helper-text-color={`${currentSelectingTeam}`}
              >
                <div className="spell__select-helper">
                  <div className="select-helper__text">
                    <p>
                      {currentSelectingTeam === 'blue'
                        ? `${player[`blue${currentSelectingIndex + 1}`]}`
                        : `${player[`red${currentSelectingIndex + 1}`]}`}{' '}
                      스펠 선택중입니다.
                    </p>
                  </div>
                  <div className="select-helper__zoom-view">
                    <img
                      alt={`zoom-view-spell1`}
                      data-current-target={currentSelectingSpellNumber === 1}
                      onClick={() => {
                        setCurrentSelectingSpellNumber(1)
                      }}
                      src={zoomViewImgSrc(1)}
                    />
                    <img
                      alt={`zoom-view-spell2`}
                      data-current-target={currentSelectingSpellNumber === 2}
                      onClick={() => {
                        setCurrentSelectingSpellNumber(2)
                      }}
                      src={zoomViewImgSrc(2)}
                    />
                  </div>
                </div>
                <div className="spells">
                  {classicSpellList.map((spell, index) => (
                    <div
                      className="spell__card"
                      key={index}
                      data-picked-spell={isPickedSpell(spell.id)}
                      onClick={() => {
                        updateSpell(spell.id)
                      }}
                    >
                      <img
                        className="spell__img"
                        alt={`spell-img-${spell.id}`}
                        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${spell.id}.png`}
                      />
                    </div>
                  ))}
                </div>
                <div className="spell__select-button-wrap">
                  <input
                    className="spell__select-button"
                    type="button"
                    value={pickBanPhase}
                    onClick={() => {
                      onClickSpellSelectButton()
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {globalPhase === 'GoalEdit' && (
          <div id="todays-goal" className="todays-goal">
            <div className="goal__patch-version-wrap">
              <input
                id="goal__patch-version"
                className="goal__patch-version"
                type="text"
                value={goalPatchVersion}
                onChange={(e) => onChangeGoalPatchVersion(e)}
              />
            </div>
            {goalEditPhase === 'Editing' && (
              <>
                <div
                  className="goal__editor-wrap"
                  onClick={() => setGoalEditPhase('Editing')}
                >
                  <Editor
                    initialValue={viewerInput}
                    previewStyle="tap"
                    hideModeSwitch={true}
                    viewer={false}
                    height="100%"
                    minHeight="300px"
                    initialEditType="wysiwyg"
                    useCommandShortcut={false}
                    language="ko-KR"
                    ref={editorRef}
                    onChange={() => {
                      onChangeEditor()
                    }}
                    usageStatistics={false}
                    plugins={[colorSyntax]}
                    toolbarItems={[
                      // 툴바 옵션 설정
                      ['heading', 'bold', 'italic', 'strike'],
                      ['hr', 'quote'],
                      ['ul', 'ol'],
                    ]}
                  />
                </div>
                <div
                  id="goal__button-wrap"
                  className="goal__button-wrap"
                  data-html2canvas-ignore
                >
                  <button onClick={() => setGoalEditPhase('EditDone')}>
                    작성 완료
                  </button>
                </div>
              </>
            )}

            {goalEditPhase === 'EditDone' && (
              <>
                <div
                  className="goal__editor-wrap"
                  onClick={() => setGoalEditPhase('Editing')}
                >
                  <Viewer initialValue={viewerInput} />
                </div>
                <div
                  id="goal__button-wrap"
                  className="goal__button-wrap"
                  data-html2canvas-ignore
                >
                  <button
                    data-for="button-tooltip1"
                    data-tip={resultDownToolTip1}
                    data-class="result-down-tooltip"
                    onClick={() => getDownloadResultPngFile('ban-pick-board')}
                  >
                    결과 다운로드
                  </button>
                  <ReactTooltip
                    id="button-tooltip1"
                    multiline={true}
                    delayShow={100}
                  />

                  <button
                    data-for="button-tooltip2"
                    data-tip={resultDownToolTip2}
                    data-class="result-down-tooltip"
                    onClick={() => {
                      setGoalEditPhase('End')
                      document.documentElement
                        .requestFullscreen()
                        .then(() =>
                          document.documentElement.scroll(
                            0,
                            document.documentElement.clientHeight * 0.013
                          )
                        )
                    }}
                  >
                    직접 캡쳐
                  </button>
                  <ReactTooltip
                    id="button-tooltip2"
                    multiline={true}
                    delayShow={100}
                  />
                </div>
              </>
            )}

            {goalEditPhase === 'End' && (
              <div
                className="goal__editor-wrap"
                onClick={() => setGoalEditPhase('Editing')}
              >
                <Viewer initialValue={viewerInput} />
              </div>
            )}
          </div>
        )}

        <div className="red-team__summoners">
          {redTeamSummoner.map((summoner, index) => (
            <SummonerCard />
          ))}
        </div>
      </Row>

      <Row className="board-bottom">
        <div className="blue-team__ban">
          {blueTeamSummoner.map((summoner, index) => (
            <div
              className="banned-champion-wrap"
              key={index}
              data-current-target={
                currentSelectingTeam === 'blue' &&
                currentSelectingIndex === index &&
                pickBanPhase === 'Ban'
              }
            >
              <img
                className="banned-champion"
                alt={`blueTeam-banned-${index}-${summoner.bannedChampion.data}`}
                data-current-target={
                  currentSelectingTeam === 'blue' &&
                  currentSelectingIndex === index &&
                  pickBanPhase === 'Ban'
                }
                onClick={() => {
                  setCurrentSelectingTeam('blue')
                  setCurrentSelectingIndex(index)
                  setPickBanPhase('Ban')
                  setGlobalPhase('PickBan')
                }}
                src={bannedChampionImgSrc(summoner)}
              />
            </div>
          ))}
        </div>

        <div id="match-result-wrap" className="match-result-wrap">
          <input
            type="text"
            id="match-result"
            className="match-result"
            value={matchResult}
            spellCheck="false"
            onChange={(e) => setMatchResult(e.target.value)}
          />
        </div>

        <div className="red-team__ban">
          {redTeamSummoner.map((summoner, index) => (
            <div
              className="banned-champion-wrap"
              key={index}
              data-current-target={
                currentSelectingTeam === 'red' &&
                currentSelectingIndex === index &&
                pickBanPhase === 'Ban'
              }
            >
              <img
                className="banned-champion"
                alt={`redTeam-banned-${index}-${summoner.bannedChampion.data}`}
                data-current-target={
                  currentSelectingTeam === 'red' &&
                  currentSelectingIndex === index &&
                  pickBanPhase === 'Ban'
                }
                onClick={() => {
                  setCurrentSelectingTeam('red')
                  setCurrentSelectingIndex(index)
                  setPickBanPhase('Ban')
                  setGlobalPhase('PickBan')
                }}
                src={bannedChampionImgSrc(summoner)}
              />
            </div>
          ))}
        </div>
      </Row>
    </Container>
  )
}
