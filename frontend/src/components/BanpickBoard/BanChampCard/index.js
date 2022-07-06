import React from 'react'

export default function BanChampCard() {
  return (
    <div
      className="banned-champion-wrap"
      // data-current-target={
      //   currentSelectingTeam === 'blue' &&
      //   currentSelectingIndex === index &&
      //   pickBanPhase === 'Ban'
      // }
    >
      <img
        className="banned-champion"
        // alt={`blueTeam-banned-${index}-${summoner.bannedChampion.data}`}
        // data-current-target={
        //   currentSelectingTeam === 'blue' &&
        //   currentSelectingIndex === index &&
        //   pickBanPhase === 'Ban'
        // }
        // onClick={() => {
        //   setCurrentSelectingTeam('blue')
        //   setCurrentSelectingIndex(index)
        //   setPickBanPhase('Ban')
        //   setGlobalPhase('PickBan')
        // }}
        // src={bannedChampionImgSrc(summoner)}
      />
    </div>
  )
}
