import React from 'react'

export default function SummonerName() {
  // useEffect(() => {
  //   //activatePlayerPrefix
  //   activatePlayerPrefix()
  //   console.log('activate PlayerPrefix')
  // }, [activatePlayerPrefix])

  // const [player, setPlayer] = useState({
  //   blue1: '',
  //   blue2: '',
  //   blue3: '',
  //   blue4: '',
  //   blue5: '',
  //   red1: '',
  //   red2: '',
  //   red3: '',
  //   red4: '',
  //   red5: '',
  // })

  // const onChangePlayer = (e, teamNumber) =>
  //   setPlayer({ ...player, [teamNumber]: e.target.value })
  //   const activatePlayerPrefix = useCallback(() => {
  //   setPlayer((prev) => ({
  //     ...prev,
  //     blue1: `${selectedBlueTeam} TOP`,
  //     blue2: `${selectedBlueTeam} JGL`,
  //     blue3: `${selectedBlueTeam} MID`,
  //     blue4: `${selectedBlueTeam} BOT`,
  //     blue5: `${selectedBlueTeam} SUP`,
  //     red1: `${selectedRedTeam} TOP`,
  //     red2: `${selectedRedTeam} JGL`,
  //     red3: `${selectedRedTeam} MID`,
  //     red4: `${selectedRedTeam} BOT`,
  //     red5: `${selectedRedTeam} SUP`,
  //   }))
  // }, [selectedBlueTeam, selectedRedTeam])

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
