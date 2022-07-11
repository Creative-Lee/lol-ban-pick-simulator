import React from 'react'
import { transparencyImg } from '../../../../Assets/img/import_img'

export default function SummonerSpell({
  summoner,
  teamColor,
  index,
  currentSelectingTeam,
  setCurrentSelectingTeam,
  currentSelectingIndex,
  setCurrentSelectingIndex,
  pickBanPhase,
  setPickBanPhase,
  setGlobalPhase,
  currentSelectingSpellNumber,
  setCurrentSelectingSpellNumber,
  recentVersion,
}) {
  return (
    <div className='summoner__spell-wrap'>
      <img
        className='summoner__spell'
        alt={`spell1-${summoner.spell1.data}`}
        onClick={() => {
          setCurrentSelectingSpellNumber(1)
          setCurrentSelectingIndex(index)
          setCurrentSelectingTeam(teamColor)
          setPickBanPhase('Spell')
          setGlobalPhase('PickBan')
        }}
        data-current-target={
          currentSelectingTeam === teamColor &&
          currentSelectingIndex === index &&
          pickBanPhase === 'Spell' &&
          currentSelectingSpellNumber === 1
        }
        src={
          summoner.spell1.data === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell1.data}.png`
        }
      />
      <img
        className='summoner__spell'
        alt={`spell2-${summoner.spell2.data}`}
        onClick={() => {
          setCurrentSelectingSpellNumber(2)
          setCurrentSelectingIndex(index)
          setCurrentSelectingTeam(teamColor)
          setPickBanPhase('Spell')
          setGlobalPhase('PickBan')
        }}
        data-current-target={
          currentSelectingTeam === teamColor &&
          currentSelectingIndex === index &&
          pickBanPhase === 'Spell' &&
          currentSelectingSpellNumber === 2
        }
        src={
          summoner.spell2.data === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell2.data}.png`
        }
      />
    </div>
  )
}
