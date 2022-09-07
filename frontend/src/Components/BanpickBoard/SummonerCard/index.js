import React, { useContext } from 'react'

import SummonerChamp from './SummonerChamp'
import SummonerName from './SummonerName'
import SummonerSpell from './SummonerSpell'
import { summonerCardContext } from '../index'

export default function SummonerCard({ teamColor, index, summoner }) {
  const { currentSelectingTeam, currentSelectingIndex, pickBanPhase } =
    useContext(summonerCardContext)
  return (
    <div
      className='summoner__card'
      data-current-target={
        currentSelectingTeam === teamColor &&
        currentSelectingIndex === index &&
        pickBanPhase === 'Pick'
      }
    >
      <SummonerChamp teamColor={teamColor} summoner={summoner} index={index} />
      <SummonerName teamColor={teamColor} summoner={summoner} index={index} />
      <SummonerSpell teamColor={teamColor} summoner={summoner} index={index} />
    </div>
  )
}
