import React, { useState } from 'react'
import { BanpickBoard, SettingBoard } from '../Components'

export default function Board({
  recentVersion,
  ascendingChampionDataList,
  classicSpellList,
}) {
  const [boardPhase, setBoardPhase] = useState('setting') // setting, banPick
  const [mode, setMode] = useState('rapid') // simulation, rapid

  const board = {
    banpick: (
      <BanpickBoard
        boardPhase={boardPhase}
        mode={mode}
        recentVersion={recentVersion}
        ascendingChampionDataList={ascendingChampionDataList}
        classicSpellList={classicSpellList}
      />
    ),
    setting: <SettingBoard setBoardPhase={setBoardPhase} setMode={setMode} />,
  }

  return board[boardPhase]
}
