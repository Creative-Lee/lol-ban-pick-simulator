import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactTooltip from 'react-tooltip'
import Hangul from 'hangul-js'
import { Container, Row, Col } from 'react-bootstrap'

import {
  searchIcon,
  transparencyImg,
  noBanIcon,
} from '../../Assets/img/import_img'

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
  const isMountedRef = useRef(false)

  const [globalPhase, setGlobalPhase] = useState('PickBan') // PickBan, GoalEdit, End
  const [pickBanPhase, setPickBanPhase] = useState('Pick') // Pick, Ban, Spell, End
  const [goalEditPhase, setGoalEditPhase] = useState('Editing') // Editing, EditDone, End
  const [currentSelectingTeam, setCurrentSelectingTeam] = useState('blue') // blue, red
  const [currentSelectingIndex, setCurrentSelectingIndex] = useState(0) // 0 ~ 4
  const [currentSelectingSpellNumber, setCurrentSelectingSpellNumber] =
    useState(1) // 1, 2

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

  // const onClickChampionPickButton = () => {
  //   if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
  //     updateSummonerData({ type: 'pickedChampion', isConfirmed: true })
  //   }
  // }

  // const onClickChampionBanButton = () => {
  //   if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
  //     updateSummonerData({ type: 'bannedChampion', isConfirmed: true })
  //   }
  // }

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
    //activateSpellPlaceholder
    if (mode === 'rapid' && isMountedRef.current === true) {
      activateSpellPlaceholder()
      console.log('activate Spell Placeholder')
      return
    }
    isMountedRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardPhase])

  // useEffect(() => {
  //   setSearchInput('')
  //   console.log('Initialize search input')
  // }, [currentSelectingIndex])

  const [blueTeamName, setBlueTeamName] = useState('Blue')
  const [redTeamName, setRedTeamName] = useState('Red')

  const redTeamInlineStyle = {
    teamSelectMenu: { flexDirection: 'row-reverse' },
    nameSelect: { right: 0, left: `${20}%` },
  }

  return (
    <Container id="ban-pick-board" className="ban-pick-board">
      <Row id="board-top" className="board-top">
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

      <Row className="board-middle">
        <div className="blue-team__summoners">
          {blueTeamSummoner.map((summoner, index) => (
            <SummonerCard key={index} />
          ))}
        </div>

        {globalPhase === 'PickBan' && (
          <SelectBoard classicSpellList={classicSpellList} />
        )}
        {globalPhase === 'GoalEdit' && <GoalBoard />}

        <div className="red-team__summoners">
          {redTeamSummoner.map((summoner, index) => (
            <SummonerCard key={index} />
          ))}
        </div>
      </Row>

      <Row className="board-bottom">
        <div className="blue-team__ban">
          {blueTeamSummoner.map((summoner, index) => (
            <BanChampCard />
          ))}
        </div>

        <MatchResult />

        <div className="red-team__ban">
          {redTeamSummoner.map((summoner, index) => (
            <BanChampCard />
          ))}
        </div>
      </Row>
    </Container>
  )
}
