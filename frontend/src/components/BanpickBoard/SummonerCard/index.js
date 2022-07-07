import React, { useState } from 'react'
import SummonerChamp from './SummonerChamp'
import SummonerName from './SummonerName'
import SummonerSpell from './SummonerSpell'

export default function SummonerCard({
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
  summonerName,
  setSummonerName,
  currentSelectingSpellNumber,
  setCurrentSelectingSpellNumber,
  recentVersion,
}) {
  return (
    <div
      className='summoner__card'
      data-current-target={
        currentSelectingTeam === teamColor &&
        currentSelectingIndex === index &&
        pickBanPhase === 'Pick'
      }
    >
      <SummonerChamp
        summoner={summoner}
        teamColor={teamColor}
        index={index}
        currentSelectingTeam={currentSelectingTeam}
        setCurrentSelectingTeam={setCurrentSelectingTeam}
        currentSelectingIndex={currentSelectingIndex}
        setCurrentSelectingIndex={setCurrentSelectingIndex}
        pickBanPhase={pickBanPhase}
        setPickBanPhase={setPickBanPhase}
        setGlobalPhase={setGlobalPhase}
      />
      <SummonerName
        teamColor={teamColor}
        index={index}
        summonerName={summonerName}
        setSummonerName={setSummonerName}
      />
      <SummonerSpell
        summoner={summoner}
        teamColor={teamColor}
        index={index}
        currentSelectingTeam={currentSelectingTeam}
        setCurrentSelectingTeam={setCurrentSelectingTeam}
        currentSelectingIndex={currentSelectingIndex}
        setCurrentSelectingIndex={setCurrentSelectingIndex}
        pickBanPhase={pickBanPhase}
        setPickBanPhase={setPickBanPhase}
        setGlobalPhase={setGlobalPhase}
        currentSelectingSpellNumber={currentSelectingSpellNumber}
        setCurrentSelectingSpellNumber={setCurrentSelectingSpellNumber}
        recentVersion={recentVersion}
      />
    </div>
  )
}
