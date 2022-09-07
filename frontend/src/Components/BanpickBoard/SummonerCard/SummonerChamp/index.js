import React, { useContext } from 'react'
import { transparencyImg } from '../../../../Assets/img/import_img'
import { SummonerCardContext } from '../../index'

export default function SummonerChamp({ teamColor, summoner, index }) {
  const {
    setCurrentSelectingTeam,
    currentSelectingIndex,
    setCurrentSelectingIndex,
    pickBanPhase,
    setPickBanPhase,
    setGlobalPhase,
    currentSelectingTeam,
  } = useContext(SummonerCardContext)
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
