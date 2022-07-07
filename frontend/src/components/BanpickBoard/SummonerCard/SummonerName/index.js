import React from 'react'

export default function SummonerName({
  teamColor,
  index,
  summonerName,
  setSummonerName,
}) {
  const onChangeSummonerName = (e, colorAndIndex) =>
    setSummonerName({ ...summonerName, [colorAndIndex]: e.target.value })

  return (
    <input
      className="summoner__name"
      type="text"
      value={`${summonerName[`${teamColor}${index}`]}`}
      spellCheck="false"
      onChange={(e) => {
        onChangeSummonerName(e, `${teamColor}${index}`)
      }}
    />
  )
}
