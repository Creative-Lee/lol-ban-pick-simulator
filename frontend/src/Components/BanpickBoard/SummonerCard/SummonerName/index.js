import React, { useContext } from 'react'
import { summonerCardContext } from '../../index'

export default function SummonerName({ teamColor, index }) {
  const { summonerName, setSummonerName } = useContext(summonerCardContext)
  const onChangeSummonerName = (e, colorAndIndex) =>
    setSummonerName({ ...summonerName, [colorAndIndex]: e.target.value })

  return (
    <input
      className='summoner__name'
      type='text'
      value={`${summonerName[`${teamColor}${index}`]}`}
      spellCheck='false'
      onChange={(e) => {
        onChangeSummonerName(e, `${teamColor}${index}`)
      }}
    />
  )
}
