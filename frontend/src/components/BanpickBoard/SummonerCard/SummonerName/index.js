import React from 'react'

export default function SummonerName() {
  return (
    <input
      className="summoner__name"
      type="text"
      // value={player[`blue${index + 1}`]}
      spellCheck="false"
      // onChange={(e) => {
      //   onChangePlayer(e, `blue${index + 1}`)
      // }}
    />
  )
}
