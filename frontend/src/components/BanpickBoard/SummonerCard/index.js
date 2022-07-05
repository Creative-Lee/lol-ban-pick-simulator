import React from 'react'
import SummonerChamp from './SummonerChamp'
import SummonerName from './SummonerName'
import SummonerSpell from './SummonerSpell'

export default function SummonerCard() {
  return (
    <div
      className="summoner__card"
      // key={index}
      // data-current-target={
      //   currentSelectingTeam === 'blue' &&
      //   currentSelectingIndex === index &&
      //   pickBanPhase === 'Pick'
      // }
    >
      <SummonerChamp />
      <SummonerName />
      <div className="summoner__spell-wrap">
        <SummonerSpell />
        <SummonerSpell />
      </div>
    </div>
  )
}
