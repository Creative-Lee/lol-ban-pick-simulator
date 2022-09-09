import React, { useContext } from 'react'
import {
  ChampSelectBoardContext,
  BlueTeamDispatchContext,
  RedTeamDispatchContext,
} from '../../index'

const ChampCard = ({ champData }) => {
  const {
    isPickedChampion,
    isBannedChampion,
    recentVersion,
    pickBanPhase,
    currentSelectingTeam,
  } = useContext(ChampSelectBoardContext)
  const { updateBlueTeamBan, updateBlueTeamPick } = useContext(BlueTeamDispatchContext)
  const { updateRedTeamBan, updateRedTeamPick } = useContext(RedTeamDispatchContext)

  const pickBanController = (data) => {
    if (pickBanPhase === 'Pick') {
      if (currentSelectingTeam === 'blue') {
        updateBlueTeamPick(data, false)
      } else {
        updateRedTeamPick(data, false)
      }
    } else {
      if (currentSelectingTeam === 'blue') {
        updateBlueTeamBan(data, false)
      } else {
        updateRedTeamBan(data, false)
      }
    }
  }
  return (
    <div
      className='champion__card'
      data-champion={champData.id}
      data-picked={isPickedChampion(champData.id)}
      data-banned={isBannedChampion(champData.id)}
      onClick={() => {
        pickBanController(champData.id)
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

export default React.memo(ChampCard)
