import React, { useEffect, useState, useCallback, createContext, useReducer } from 'react'
import { Container, Row } from 'react-bootstrap'

import { transparencyImg, noBanIcon } from '../../Assets/img/import_img'

import MatchInfo from './MatchInfo'
import SummonerCard from './SummonerCard'
import TeamSelectMenu from './TeamSelectMenu'
import GoalBoard from './GoalBoard'
import BanChampCard from './BanChampCard'
import MatchResult from './MatchResult'

import ChampSelectBoard from './ChampSelectBoard'
import SpellSelectBoard from './SpellSelectBoard'

export const SummonerCardContext = createContext({})
export const ChampSelectBoardContext = createContext({})
export const SpellSelectBoardContext = createContext({})
export const GoalBoardContext = createContext({})
export const BlueTeamDispatchContext = createContext({})
export const RedTeamDispatchContext = createContext({})

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
  const [currentSelectingSpellNumber, setCurrentSelectingSpellNumber] = useState(1) // 1, 2

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

  const blueTeamReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_PICKCHAMP': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: 'pickedChampion',
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }

      case 'UPDATE_BANCHAMP': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: 'bannedChampion',
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }

      case 'UPDATE_SPELL': {
        let spellNumber = action.payload.spellNumber
          ? action.payload.spellNumber
          : currentSelectingSpellNumber
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: `spell${spellNumber}`,
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }
      case 'CONFRIRM_SPELL': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].confirmSpells()

        return updatedArr
      }
      case 'UPDATE_TEAMSTATE': {
        return action.payload.teamState
      }

      default:
        return state
    }
  }

  const redTeamReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_PICKCHAMP': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: 'pickedChampion',
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }

      case 'UPDATE_BANCHAMP': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: 'bannedChampion',
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }

      case 'UPDATE_SPELL': {
        let spellNumber = action.payload.spellNumber
          ? action.payload.spellNumber
          : currentSelectingSpellNumber
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].updateSummoner({
          type: `spell${spellNumber}`,
          data: action.payload.data,
          isConfirmed: action.payload.isConfirmed,
        })

        return updatedArr
      }
      case 'CONFRIRM_SPELL': {
        let updatedArr = [...state]
        updatedArr[currentSelectingIndex] = state[currentSelectingIndex].confirmSpells()

        return updatedArr
      }
      case 'UPDATE_TEAMSTATE': {
        return action.payload.teamState
      }

      default:
        return state
    }
  }
  const [blueTeam, dispatchBlue] = useReducer(blueTeamReducer, [
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
  ])

  const [redTeam, dispatchRed] = useReducer(redTeamReducer, [
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
    new Summoner({}),
  ])

  const updateBlueTeamPick = (data = undefined, isConfirmed = undefined) => {
    dispatchBlue({
      type: 'UPDATE_PICKCHAMP',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
      },
    })
  }
  const updateBlueTeamBan = (data = undefined, isConfirmed = undefined) => {
    dispatchBlue({
      type: 'UPDATE_BANCHAMP',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
      },
    })
  }
  const updateBlueTeamSpell = (
    data = undefined,
    isConfirmed = undefined,
    spellNumber = undefined
  ) => {
    dispatchBlue({
      type: 'UPDATE_SPELL',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
        spellNumber: spellNumber,
      },
    })
  }
  const confirmBlueTeamSpell = () => {
    dispatchBlue({ type: 'CONFRIRM_SPELL' })
  }
  const updateBlueTeamState = (teamState) => {
    dispatchBlue({ type: 'UPDATE_TEAMSTATE', payload: { teamState: teamState } })
  }
  const updateRedTeamPick = (data = undefined, isConfirmed = undefined) => {
    dispatchRed({
      type: 'UPDATE_PICKCHAMP',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
      },
    })
  }
  const updateRedTeamBan = (data = undefined, isConfirmed = undefined) => {
    dispatchRed({
      type: 'UPDATE_BANCHAMP',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
      },
    })
  }
  const updateRedTeamSpell = (
    data = undefined,
    isConfirmed = undefined,
    spellNumber = undefined
  ) => {
    dispatchRed({
      type: 'UPDATE_SPELL',
      payload: {
        data: data,
        isConfirmed: isConfirmed,
        spellNumber: spellNumber,
      },
    })
  }
  const confirmRedTeamSpell = () => {
    dispatchRed({ type: 'CONFRIRM_SPELL' })
  }
  const updateRedTeamState = (teamState) => {
    dispatchRed({ type: 'UPDATE_TEAMSTATE', payload: { teamState: teamState } })
  }

  const isCurrentSelectingDataEmpty = (type) => {
    let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam
    return team[currentSelectingIndex].isEmpty(type)
  }

  const onClickChampionPickButton = () => {
    if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
      if (currentSelectingTeam === 'blue') {
        updateBlueTeamPick(undefined, true)
        return
      }
      updateRedTeamPick(undefined, true)
    }
  }

  const onClickChampionBanButton = () => {
    if (!isCurrentSelectingDataEmpty(currentSelectingType())) {
      if (currentSelectingTeam === 'blue') {
        updateBlueTeamBan(undefined, true)
        return
      }
      updateRedTeamBan(undefined, true)
    }
  }

  const onClickSpellSelectButton = () => {
    if (
      !isCurrentSelectingDataEmpty('spell1') &&
      !isCurrentSelectingDataEmpty('spell2')
    ) {
      if (currentSelectingTeam === 'blue') {
        confirmBlueTeamSpell()
        return
      }
      confirmRedTeamSpell()
    }
  }

  const isPickedChampion = (championName) => {
    const blueTeamPicked = blueTeam.map((summoner) => summoner.pickedChampion.data)
    const redTeamPicked = redTeam.map((summoner) => summoner.pickedChampion.data)
    const allTeamPickedList = [...blueTeamPicked, ...redTeamPicked]

    return allTeamPickedList.includes(championName)
  }

  const isBannedChampion = (championName) => {
    const blueTeamBanned = blueTeam.map((summoner) => summoner.bannedChampion.data)
    const redTeamBanned = redTeam.map((summoner) => summoner.bannedChampion.data)
    const allTeamBannedList = [...blueTeamBanned, ...redTeamBanned]

    return allTeamBannedList.includes(championName)
  }

  const isPickedSpell = (spellName) => {
    let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam

    const isMatchedSummonerSpell1 = team[currentSelectingIndex].spell1.data === spellName
    const isMatchedSummonerSpell2 = team[currentSelectingIndex].spell2.data === spellName

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
    let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam
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
    let blueTeamPickPhaseEnd = !blueTeam
      .map((summoner) => summoner.pickedChampion.isConfirmed)
      .includes(false)
    let redTeamPickPhaseEnd = !redTeam
      .map((summoner) => summoner.pickedChampion.isConfirmed)
      .includes(false)

    return blueTeamPickPhaseEnd && redTeamPickPhaseEnd
  }

  const isBanPhaseEnd = () => {
    let blueTeamPickPhaseEnd = !blueTeam
      .map((summoner) => summoner.bannedChampion.isConfirmed)
      .includes(false)
    let redTeamPickPhaseEnd = !redTeam
      .map((summoner) => summoner.bannedChampion.isConfirmed)
      .includes(false)

    return blueTeamPickPhaseEnd && redTeamPickPhaseEnd
  }

  const isSpellPhaseEnd = () => {
    let blueTeamSpell1Confirmed = !blueTeam
      .map((summoner) => summoner.spell1.isConfirmed)
      .includes(false)
    let blueTeamSpell2Confirmed = !blueTeam
      .map((summoner) => summoner.spell2.isConfirmed)
      .includes(false)
    let redTeamSpell1Confirmed = !redTeam
      .map((summoner) => summoner.spell1.isConfirmed)
      .includes(false)
    let redTeamSpell2Confirmed = !redTeam
      .map((summoner) => summoner.spell2.isConfirmed)
      .includes(false)

    let blueTeamSpellPhaseEnd = blueTeamSpell1Confirmed && blueTeamSpell2Confirmed
    let redTeamSpellPhaseEnd = redTeamSpell1Confirmed && redTeamSpell2Confirmed

    return blueTeamSpellPhaseEnd && redTeamSpellPhaseEnd
  }

  const isAllPickBanPhaseEnd = () => {
    return isPickPhaseEnd() && isBanPhaseEnd() && isSpellPhaseEnd()
  }

  const currentSelectingIndexController = () => {
    const notConfirmedIndexChecker = () => {
      let notConfirmedIndex
      let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam

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
      let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam
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
    let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam
    return team[currentSelectingIndex][currentSelectingType()].isConfirmed
  }

  const isCurrentSelectingTeamDataConfirmed = () => {
    let team = currentSelectingTeam === 'blue' ? blueTeam : redTeam

    return !team
      .map((summoner) => summoner[currentSelectingType()].isConfirmed)
      .includes(false)
  }

  const isCurrentSelectingBothTeamDataConfirmed = () => {
    let blueTeamDataConfirmed = !blueTeam
      .map((summoner) => summoner[currentSelectingType()].isConfirmed)
      .includes(false)
    let redTeamDataConfirmed = !redTeam
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
  }, [blueTeam, redTeam])

  useEffect(() => {
    if (isCurrentSelectingTeamDataConfirmed()) {
      currentSelectingTeamController()
      console.log('team ~ team 순서 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeam, redTeam])

  useEffect(() => {
    if (isCurrentSelectingBothTeamDataConfirmed()) {
      currentPhaseController()
      console.log('phase ~ phase 순서 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeam, redTeam])

  useEffect(() => {
    setGoalEditPhase('Editing')
  }, [globalPhase])

  useEffect(() => {
    if (pickBanPhase === 'Spell') {
      currentSelectingSpellNumberController()
      console.log('spellNumber 변경 이펙트')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blueTeam, redTeam])

  const activateSpellPlaceholder = useCallback(() => {
    const redTeamUpdateArr = redTeam.map((summoner) =>
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

    const blueTeamUpdateArr = blueTeam.map((summoner) =>
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

    updateRedTeamState(redTeamUpdateArr)
    updateBlueTeamState(blueTeamUpdateArr)
  }, [blueTeam, redTeam])

  useEffect(() => {
    //activateSpellPlaceholder
    if (mode === 'rapid') {
      activateSpellPlaceholder()
      console.log('activate Spell Placeholder')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardPhase])

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

  useEffect(() => {
    activateSummonerNamePrefix()
    console.log('activate SummonerNamePrefix')
  }, [activateSummonerNamePrefix])

  const summonerCardContextValue = {
    currentSelectingTeam,
    setCurrentSelectingTeam,
    currentSelectingIndex,
    setCurrentSelectingIndex,
    pickBanPhase,
    setPickBanPhase,
    setGlobalPhase,
    summonerName,
    setSummonerName,
    currentSelectingSpellNumber,
    setCurrentSelectingSpellNumber,
    recentVersion,
  }
  const champSelectBoardContextValue = {
    isPickedChampion,
    isBannedChampion,
    currentSelectingIndex,
    currentSelectingTeam,
    pickBanPhase,
    ascendingChampionDataList,
    onClickChampionPickButton,
    onClickChampionBanButton,
    recentVersion,
    boardPhase,
  }
  const spellSelectBoardContextValue = {
    isPickedSpell,
    classicSpellList,
    currentSelectingTeam,
    currentSelectingIndex,
    currentSelectingSpellNumber,
    setCurrentSelectingSpellNumber,
    zoomViewImgSrc,
    onClickSpellSelectButton,
    summonerName,
    recentVersion,
  }
  const goalBoardContextValue = {
    globalPhase,
    goalEditPhase,
    setGoalEditPhase,
  }
  const blueTeamDispatchContextValue = {
    updateBlueTeamPick,
    updateBlueTeamBan,
    updateBlueTeamSpell,
    updateBlueTeamState,
  }
  const redTeamDispatchContextValue = {
    updateRedTeamPick,
    updateRedTeamBan,
    updateRedTeamSpell,
    updateRedTeamState,
  }

  return (
    <Container id='ban-pick-board' className='ban-pick-board'>
      <Row id='board-top' className='board-top'>
        <TeamSelectMenu
          teamColor={'blue'}
          teamName={blueTeamName}
          setTeamName={setBlueTeamName}
        />

        <MatchInfo />

        <TeamSelectMenu
          teamColor={'red'}
          teamName={redTeamName}
          setTeamName={setRedTeamName}
        />
      </Row>

      <Row className='board-middle'>
        <SummonerCardContext.Provider value={summonerCardContextValue}>
          <div className='blue-team__summoners'>
            {blueTeam.map((summoner, index) => (
              <SummonerCard
                teamColor={'blue'}
                summoner={summoner}
                index={index}
                key={index}
              />
            ))}
          </div>
        </SummonerCardContext.Provider>

        {globalPhase === 'PickBan' && (
          <>
            <BlueTeamDispatchContext.Provider value={blueTeamDispatchContextValue}>
              <RedTeamDispatchContext.Provider value={redTeamDispatchContextValue}>
                {(pickBanPhase === 'Ban' || pickBanPhase === 'Pick') && (
                  <ChampSelectBoardContext.Provider value={champSelectBoardContextValue}>
                    <ChampSelectBoard />
                  </ChampSelectBoardContext.Provider>
                )}

                {pickBanPhase === 'Spell' && (
                  <SpellSelectBoardContext.Provider value={spellSelectBoardContextValue}>
                    <SpellSelectBoard />
                  </SpellSelectBoardContext.Provider>
                )}
              </RedTeamDispatchContext.Provider>
            </BlueTeamDispatchContext.Provider>
          </>
        )}

        {globalPhase === 'GoalEdit' && (
          <GoalBoardContext.Provider value={goalBoardContextValue}>
            <GoalBoard />
          </GoalBoardContext.Provider>
        )}

        <SummonerCardContext.Provider value={summonerCardContextValue}>
          <div className='red-team__summoners'>
            {redTeam.map((summoner, index) => (
              <SummonerCard
                teamColor={'red'}
                summoner={summoner}
                index={index}
                key={index}
              />
            ))}
          </div>
        </SummonerCardContext.Provider>
      </Row>

      <Row className='board-bottom'>
        <div className='blue-team__ban'>
          {blueTeam.map((summoner, index) => (
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
          {redTeam.map((summoner, index) => (
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
