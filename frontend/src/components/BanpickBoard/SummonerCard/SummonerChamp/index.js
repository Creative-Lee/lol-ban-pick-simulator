import React from 'react'

export default function SummonerChamp() {
  return (
    <img
      className="summoner__champ"
      // id={`${summoner.pickedChampion.data}`}
      // alt={`blueTeam-${index}-${summoner.pickedChampion.data}`}
      // data-current-target={
      //   currentSelectingTeam === 'blue' &&
      //   currentSelectingIndex === index &&
      //   pickBanPhase === 'Pick'
      // }
      // onClick={() => {
      //   setCurrentSelectingIndex(index)
      //   setCurrentSelectingTeam('blue')
      //   setPickBanPhase('Pick')
      //   setGlobalPhase('PickBan')
      // }}
      // src={
      //   summoner.pickedChampion.data === ''
      //     ? transparencyImg
      //     : `${process.env.REACT_APP_API_BASE_URL}/cdn/img/champion/splash/${summoner.pickedChampion.data}_0.jpg`
      // }
    />
  )
}
