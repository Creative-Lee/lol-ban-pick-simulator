import React from 'react'
import ChampSelectBoard from './ChampSelectBoard'
import SpellSelectBoard from './SpellSelectBoard'

export default function SelectBoard({ classicSpellList }) {
  return (
    <>
      <ChampSelectBoard />
      {/* {(pickBanPhase === 'Ban' || pickBanPhase === 'Pick') && (
        <ChampSelectBoard />
      )} */}
      {/* {pickBanPhase === 'Spell' && <SpellSelectBoard classicSpellList={classicSpellList}/>} */}
    </>
  )
}
