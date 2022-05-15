import React, {useState , useEffect, useRef, useLayoutEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom'

import {Board, Main, Layout} from './components'
import {getChampionDataList, getRecentVersion} from './apis/get'

import './App.scss'

export default function App() {

  const [recentVersion, setRecentVersion] = useState('') 
  const [championDataList, setChampionDataList] = useState({});
  const isMounted = useRef(false)

  useEffect(() => {
    getRecentVersion()
    .then(response => setRecentVersion(response))
  },[])   

  useEffect(() => {
    if(isMounted.current){
      getChampionDataList(recentVersion)
      .then(response => setChampionDataList(response)) 
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
            <Board recentVersion={recentVersion} championDataList={championDataList}/>
          }/>
        </Route>
      </Routes>
    </div>   
  )
}
