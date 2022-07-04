import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './Layout'
import { Main, Board } from './pages'
import {
  getAscendingChampionDataList,
  getRecentVersion,
  getClassicSpell,
} from './apis/get'

import './App.scss'

export default function App() {
  const [recentVersion, setRecentVersion] = useState('')
  const [ascendingChampionDataList, setAscendingChampionDataList] = useState([])
  const [classicSpellList, setClassicSpellList] = useState([])
  const isMounted = useRef(false)

  useEffect(() => {
    getRecentVersion().then((response) => setRecentVersion(response))
  }, [])

  useEffect(() => {
    if (isMounted.current) {
      getAscendingChampionDataList(recentVersion).then((response) =>
        setAscendingChampionDataList(response)
      )

      getClassicSpell(recentVersion).then((response) =>
        setClassicSpellList(response)
      )
    } else {
      isMounted.current = true
    }
  }, [recentVersion])

  return (
    <div id="App" className="App">
      <Routes>
        <Route path="/" element={<Layout recentVersion={recentVersion} />}>
          <Route index element={<Main />} />
          <Route
            path="board"
            element={
              <Board
                recentVersion={recentVersion}
                ascendingChampionDataList={ascendingChampionDataList}
                classicSpellList={classicSpellList}
              />
            }
          />
          <Route path="analysis" element={<div></div>} />
        </Route>
      </Routes>
    </div>
  )
}
