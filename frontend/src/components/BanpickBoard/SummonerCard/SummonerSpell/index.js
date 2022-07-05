import React from 'react'

export default function SummonerSpell() {
  return (
      <img className="summoner__spell"
        // alt={`spell1-${summoner.spell1.data}`}
        // onClick={() => {
        //   setCurrentSelectingSpellNumber(1)
        //   setCurrentSelectingIndex(index)
        //   setCurrentSelectingTeam('blue')
        //   setPickBanPhase('Spell')
        //   setGlobalPhase('PickBan')
        // }}
        // data-current-target={
        //   currentSelectingTeam === 'blue' &&
        //   currentSelectingIndex === index &&
        //   pickBanPhase === 'Spell' &&
        //   currentSelectingSpellNumber === 1
        // }
        // src={
        //   summoner.spell1.data === ''
        //     ? transparencyImg
        //     : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell1.data}.png`
        // }
      />
      {/* <img
        alt={`spell2-${summoner.spell2.data}`}
        onClick={() => {
          setCurrentSelectingSpellNumber(2)
          setCurrentSelectingIndex(index)
          setCurrentSelectingTeam('blue')
          setPickBanPhase('Spell')
          setGlobalPhase('PickBan')
        }}
        data-current-target={
          currentSelectingTeam === 'blue' &&
          currentSelectingIndex === index &&
          pickBanPhase === 'Spell' &&
          currentSelectingSpellNumber === 2
        }
        src={
          summoner.spell2.data === ''
            ? transparencyImg
            : `${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${summoner.spell2.data}.png`
        }
      /> */}
  )
}
