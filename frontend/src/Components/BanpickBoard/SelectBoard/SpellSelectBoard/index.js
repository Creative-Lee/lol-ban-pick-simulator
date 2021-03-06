import React from 'react'
import SpellCard from './SpellCard'

export default function SpellSelectBoard({
  classicSpellList,
  currentSelectingTeam,
  currentSelectingIndex,
  currentSelectingSpellNumber,
  setCurrentSelectingSpellNumber,
  zoomViewImgSrc,
  onClickSpellSelectButton,
  summonerName,
  recentVersion,
  isPickedSpell,
  updateSpell,
}) {
  return (
    <div
      className='spell-select-board'
      data-helper-text-color={`${currentSelectingTeam}`}
    >
      <div className='spell__select-helper'>
        <div className='select-helper__text'>
          <p>
            {currentSelectingTeam === 'blue'
              ? `${summonerName[`blue${currentSelectingIndex}`]}`
              : `${summonerName[`red${currentSelectingIndex}`]}`}{' '}
            스펠 선택중입니다.
          </p>
        </div>
        <div className='select-helper__zoom-view'>
          <img
            alt={`zoom-view-spell1`}
            data-current-target={currentSelectingSpellNumber === 1}
            onClick={() => {
              setCurrentSelectingSpellNumber(1)
            }}
            src={zoomViewImgSrc(1)}
          />
          <img
            alt={`zoom-view-spell2`}
            data-current-target={currentSelectingSpellNumber === 2}
            onClick={() => {
              setCurrentSelectingSpellNumber(2)
            }}
            src={zoomViewImgSrc(2)}
          />
        </div>
      </div>
      <div className='spells'>
        {classicSpellList.map((spell, index) => (
          <SpellCard
            spell={spell}
            key={index}
            recentVersion={recentVersion}
            isPickedSpell={isPickedSpell}
            updateSpell={updateSpell}
          />
        ))}
      </div>
      <div className='spell__select-button-wrap'>
        <input
          className='spell__select-button'
          type='button'
          value={'Spell'}
          onClick={() => {
            onClickSpellSelectButton()
          }}
        />
      </div>
    </div>
  )
}
