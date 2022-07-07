import React from 'react'
import { transparencyImg } from '../../../../Assets/img/import_img'

export default function SummonerChamp({
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
}) {
  return (
    <img
      className='summoner__champ'
      id={`${summoner.pickedChampion.data}`}
      alt={`${teamColor}Team-${index}-picked-${summoner.pickedChampion.data}`}
      data-current-target={
        currentSelectingTeam === teamColor &&
        currentSelectingIndex === index &&
        pickBanPhase === 'Pick'
      }
      onClick={() => {
        setCurrentSelectingIndex(index)
        setCurrentSelectingTeam(teamColor)
        setPickBanPhase('Pick')
        setGlobalPhase('PickBan')
      }}
      src={
        summoner.pickedChampion.data === ''
          ? transparencyImg
          : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion.data}_0.jpg`
      }
    />
  )
}
