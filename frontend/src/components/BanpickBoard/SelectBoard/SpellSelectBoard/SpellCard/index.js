import React from 'react'

export default function SpellCard({
  spell,
  isPickedSpell,
  updateSpell,
  recentVersion,
}) {
  return (
    <div
      className='spell__card'
      data-picked-spell={isPickedSpell(spell.id)}
      onClick={() => {
        updateSpell(spell.id)
      }}
    >
      <img
        className='spell__img'
        alt={`spell-img-${spell.id}`}
        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/spell/${spell.id}.png`}
      />
    </div>
  )
}
