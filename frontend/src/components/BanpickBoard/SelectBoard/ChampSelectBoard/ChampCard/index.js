import React from 'react'

export default function ChampCard({ champData }) {
  return (
    <div
      className="champion__card"
      // key={index}
      // data-champion={champData.id}
      // data-picked={isPickedChampion(champData.id)}
      // data-banned={isBannedChampion(champData.id)}
      // onClick={() => {
      //   updateSummonerData({
      //     type: 'bannedChampion',
      //     data: champData.id,
      //     isConfirmed: false,
      //   })
      // }}
    >
      <img
        className="champion__img"
        // alt={champData.id}
        // src={`${process.env.REACT_APP_API_BASE_URL}/cdn/${recentVersion}/img/champion/${champData.id}.png`}
      />
      <small className="champion__name">{champData.name}</small>
    </div>
  )
}
