import React, {useState , useEffect, useRef, useLayoutEffect} from 'react';
import {Routes, Route} from 'react-router-dom'

import {Board, Main, Layout} from './components'
import {getAscendingChampionDataList, getRecentVersion, getClassicSpell} from './apis/get'

import './App.scss'

export default function App() {

  const [recentVersion, setRecentVersion] = useState('') 
  const [ascendingChampionDataList, setAscendingChampionDataList] = useState([]);
  const [classicSpellList, setClassicSpellList] = useState('')
  const isMounted = useRef(false)

  useEffect(() => {
    getRecentVersion()
    .then(response => setRecentVersion(response))
  },[])

  useEffect(() => {
    if(isMounted.current){
      getAscendingChampionDataList(recentVersion)
      .then(response => setAscendingChampionDataList(response));

      getClassicSpell(recentVersion)
      .then(response => setClassicSpellList(response));
    }
    else{
      isMounted.current = true 
    }
  },[recentVersion])




  return (  
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Main />
          }/>
          <Route path="board" element={
            <Board 
            recentVersion={recentVersion} 
            ascendingChampionDataList={ascendingChampionDataList}
            classicSpellList={classicSpellList}/>
          }/>
        </Route>
      </Routes>
    </div>   
  )
}
