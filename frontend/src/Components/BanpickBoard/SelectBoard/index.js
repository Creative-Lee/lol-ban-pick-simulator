import React, { useContext } from 'react'
import ChampSelectBoard from './ChampSelectBoard'
import SpellSelectBoard from './SpellSelectBoard'

import { selectBoardContext } from '../index'

export default function SelectBoard({}) {
  const { pickBanPhase } = useContext(selectBoardContext)

  return (
    <>
      {(pickBanPhase === 'Ban' || pickBanPhase === 'Pick') && (
        <ChampSelectBoard />
      )}
      {pickBanPhase === 'Spell' && <SpellSelectBoard />}
    </>
  )
}
