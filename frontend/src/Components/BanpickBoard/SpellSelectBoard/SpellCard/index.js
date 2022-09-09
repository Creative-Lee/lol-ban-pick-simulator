import React, { useContext } from 'react'
import {
  SpellSelectBoardContext,
  RedTeamDispatchContext,
  BlueTeamDispatchContext,
} from '../../index'

export default function SpellCard({ spell }) {
  const { isPickedSpell, recentVersion, currentSelectingTeam } = useContext(
    SpellSelectBoardContext
  )
  const { updateBlueTeamSpell } = useContext(BlueTeamDispatchContext)
  const { updateRedTeamSpell } = useContext(RedTeamDispatchContext)

  const spellController = (spell) => {
    if (currentSelectingTeam === 'blue') {
      updateBlueTeamSpell(spell, false)
    } else {
      updateRedTeamSpell(spell, false)
    }
  }
  return (
    <div
      className='spell__card'
      data-picked-spell={isPickedSpell(spell.id)}
      onClick={() => spellController(spell.id)}
    >
      <img
        className='spell__img'
        alt={`spell-img-${spell.id}`}
        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${spell.id}.png`}
      />
    </div>
  )
}
