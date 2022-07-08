import React from 'react'

export default function BanChampCard({
  summoner,
  index,
  teamColor,
  currentSelectingTeam,
  setCurrentSelectingTeam,
  setCurrentSelectingIndex,
  currentSelectingIndex,
  pickBanPhase,
  setPickBanPhase,
  setGlobalPhase,
  bannedChampionImgSrc,
}) {
  return (
    <div
      className='banned-champion-wrap'
      data-current-target={
        currentSelectingTeam === teamColor &&
        currentSelectingIndex === index &&
        pickBanPhase === 'Ban'
      }
    >
      <img
        className='banned-champion'
        alt={`${teamColor}Team-banned-${index}-${summoner.bannedChampion.data}`}
        data-current-target={
          currentSelectingTeam === teamColor &&
          currentSelectingIndex === index &&
          pickBanPhase === 'Ban'
        }
        onClick={() => {
          setCurrentSelectingTeam(teamColor)
          setCurrentSelectingIndex(index)
          setPickBanPhase('Ban')
          setGlobalPhase('PickBan')
        }}
        src={bannedChampionImgSrc(summoner)}
      />
    </div>
  )
}
