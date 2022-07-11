import React, { useEffect, useState, useCallback } from 'react'
import { Container, Row } from 'react-bootstrap'
import Hangul from 'hangul-js'

import { transparencyImg, noBanIcon } from '../../Assets/img/import_img'

import MatchInfo from './MatchInfo'
import SummonerCard from './SummonerCard'
import TeamSelectMenu from './TeamSelectMenu'
import SelectBoard from './SelectBoard'
import GoalBoard from './GoalBoard'
import BanChampCard from './BanChampCard'
import MatchResult from './MatchResult'

export default function BanpickBoard({
  boardPhase,
  mode,
  recentVersion,
  ascendingChampionDataList,
  classicSpellList,
}) {
  const [globalPhase, setGlobalPhase] = useState('PickBan') // PickBan, GoalEdit, End
  const [pickBanPhase, setPickBanPhase] = useState('Pick') // Pick, Ban, Spell, End
  const [goalEditPhase, setGoalEditPhase] = useState('Editing') // Editing, EditDone, End
  const [currentSelectingTeam, setCurrentSelectingTeam] = useState('blue') // blue, red
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(0) // 0 ~ 4

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
    return team[currentSelectingIndex][`spell${spellNumber}`].data === ''
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

  useEffect(() => {
    //activateSpellPlaceholder
    if (mode === 'rapid') {
      activateSpellPlaceholder()
      console.log('activate Spell Placeholder')
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardPhase])

  useEffect(() => {
    setSearchInput('')
    console.log('Initialize search input')
  }, [currentSelectingIndex])

  //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ//

  const [summonerName, setSummonerName] = useState({
    blue0: '',
    blue1: '',
    blue2: '',
    blue3: '',
    blue4: '',
    red0: '',
    red1: '',
    red2: '',
    red3: '',
    red4: '',
  })
  const [blueTeamName, setBlueTeamName] = useState('Blue')
  const [redTeamName, setRedTeamName] = useState('Red')
  const [currentSelectingSpellNumber, setCurrentSelectingSpellNumber] =
    useState(1) // 1, 2
  const [champDataList, setChampDataList] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [viewerInput, setViewerInput] = useState('')

  const redTeamInlineStyle = {
    teamSelectMenu: { flexDirection: 'row-reverse' },
    nameSelect: { right: 0, left: `${20}%` },
  }

  const activateSummonerNamePrefix = useCallback(() => {
    setSummonerName((prev) => ({
      ...prev,
      blue0: `${blueTeamName} TOP`,
      blue1: `${blueTeamName} JGL`,
      blue2: `${blueTeamName} MID`,
      blue3: `${blueTeamName} BOT`,
      blue4: `${blueTeamName} SUP`,
      red0: `${redTeamName} TOP`,
      red1: `${redTeamName} JGL`,
      red2: `${redTeamName} MID`,
      red3: `${redTeamName} BOT`,
      red4: `${redTeamName} SUP`,
    }))
  }, [blueTeamName, redTeamName])

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

  useEffect(() => {
    // updateMatchChampDataList
    updateMatchChampDataList()
    console.log('matchedChampDataList update compleat')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, boardPhase])

  useEffect(() => {
    //activateSummonerNamePrefix
    activateSummonerNamePrefix()
    console.log('activate SummonerNamePrefix')
  }, [activateSummonerNamePrefix])

  return (
    <Container id='ban-pick-board' className='ban-pick-board'>
      <Row id='board-top' className='board-top'>
        <TeamSelectMenu
          teamColor={'blue'}
          teamName={blueTeamName}
          setTeamName={setBlueTeamName}
          inlineStyle={{}}
        />

        <MatchInfo />

        <TeamSelectMenu
          teamColor={'red'}
          teamName={redTeamName}
          setTeamName={setRedTeamName}
          inlineStyle={redTeamInlineStyle}
        />
      </Row>

      <Row className='board-middle'>
        <div className='blue-team__summoners'>
          {blueTeamSummoner.map((summoner, index) => (
            <SummonerCard
              summoner={summoner}
              teamColor={'blue'}
              key={index}
              index={index}
              currentSelectingTeam={currentSelectingTeam}
              setCurrentSelectingTeam={setCurrentSelectingTeam}
              currentSelectingIndex={currentSelectingIndex}
              setCurrentSelectingIndex={setCurrentSelectingIndex}
              pickBanPhase={pickBanPhase}
              setPickBanPhase={setPickBanPhase}
              setGlobalPhase={setGlobalPhase}
              summonerName={summonerName}
              setSummonerName={setSummonerName}
              currentSelectingSpellNumber={currentSelectingSpellNumber}
              setCurrentSelectingSpellNumber={setCurrentSelectingSpellNumber}
              recentVersion={recentVersion}
            />
          ))}
        </div>

        {globalPhase === 'PickBan' && (
          <SelectBoard
            classicSpellList={classicSpellList}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            pickBanPhase={pickBanPhase}
            updateSummonerData={updateSummonerData}
            champDataList={champDataList}
            onClickChampionBanButton={onClickChampionBanButton}
            onClickChampionPickButton={onClickChampionPickButton}
            isPickedChampion={isPickedChampion}
            isBannedChampion={isBannedChampion}
            recentVersion={recentVersion}
            currentSelectingTeam={currentSelectingTeam}
            currentSelectingIndex={currentSelectingIndex}
            currentSelectingSpellNumber={currentSelectingSpellNumber}
            setCurrentSelectingSpellNumber={setCurrentSelectingSpellNumber}
            zoomViewImgSrc={zoomViewImgSrc}
            onClickSpellSelectButton={onClickSpellSelectButton}
            summonerName={summonerName}
            isPickedSpell={isPickedSpell}
            updateSpell={updateSpell}
          />
        )}
        {globalPhase === 'GoalEdit' && (
          <GoalBoard
            viewerInput={viewerInput}
            setViewerInput={setViewerInput}
            goalEditPhase={goalEditPhase}
            setGoalEditPhase={setGoalEditPhase}
          />
        )}

        <div className='red-team__summoners'>
          {redTeamSummoner.map((summoner, index) => (
            <SummonerCard
              summoner={summoner}
              teamColor={'red'}
              key={index}
              index={index}
              currentSelectingTeam={currentSelectingTeam}
              setCurrentSelectingTeam={setCurrentSelectingTeam}
              currentSelectingIndex={currentSelectingIndex}
              setCurrentSelectingIndex={setCurrentSelectingIndex}
              pickBanPhase={pickBanPhase}
              setPickBanPhase={setPickBanPhase}
              setGlobalPhase={setGlobalPhase}
              summonerName={summonerName}
              setSummonerName={setSummonerName}
              currentSelectingSpellNumber={currentSelectingSpellNumber}
              setCurrentSelectingSpellNumber={setCurrentSelectingSpellNumber}
              recentVersion={recentVersion}
            />
          ))}
        </div>
      </Row>

      <Row className='board-bottom'>
        <div className='blue-team__ban'>
          {blueTeamSummoner.map((summoner, index) => (
            <BanChampCard
              summoner={summoner}
              key={index}
              index={index}
              teamColor={'blue'}
              currentSelectingTeam={currentSelectingTeam}
              setCurrentSelectingTeam={setCurrentSelectingTeam}
              setCurrentSelectingIndex={setCurrentSelectingIndex}
              currentSelectingIndex={currentSelectingIndex}
              pickBanPhase={pickBanPhase}
              setPickBanPhase={setPickBanPhase}
              setGlobalPhase={setGlobalPhase}
              bannedChampionImgSrc={bannedChampionImgSrc}
            />
          ))}
        </div>

        <MatchResult />

        <div className='red-team__ban'>
          {redTeamSummoner.map((summoner, index) => (
            <BanChampCard
              summoner={summoner}
              key={index}
              index={index}
              teamColor={'red'}
              currentSelectingTeam={currentSelectingTeam}
              setCurrentSelectingTeam={setCurrentSelectingTeam}
              setCurrentSelectingIndex={setCurrentSelectingIndex}
              currentSelectingIndex={currentSelectingIndex}
              pickBanPhase={pickBanPhase}
              setPickBanPhase={setPickBanPhase}
              setGlobalPhase={setGlobalPhase}
              bannedChampionImgSrc={bannedChampionImgSrc}
            />
          ))}
        </div>
      </Row>
    </Container>
  )
}
