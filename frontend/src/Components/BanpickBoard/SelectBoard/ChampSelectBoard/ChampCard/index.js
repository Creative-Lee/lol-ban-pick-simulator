import React, { useContext } from 'react'
import { selectBoardContext } from '../../../index'

export default function ChampCard({ champData }) {
  const {
    updateSummonerData,
    isPickedChampion,
    isBannedChampion,
    recentVersion,
    pickBanPhase,
  } = useContext(selectBoardContext)
  return (
    <div
      className='champion__card'
      data-champion={champData.id}
      data-picked={isPickedChampion(champData.id)}
      data-banned={isBannedChampion(champData.id)}
      onClick={() => {
        updateSummonerData({
          type: pickBanPhase === 'Pick' ? 'pickedChampion' : 'bannedChampion',
          data: champData.id,
          isConfirmed: false,
        })
      }}
    >
      <img
        className='champion__img'
        alt={champData.id}
        src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${champData.id}.png`}
      />
      <small className='champion__name'>{champData.name}</small>
    </div>
  )
}
