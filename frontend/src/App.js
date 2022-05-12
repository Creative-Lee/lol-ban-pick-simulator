import React, {useState , useEffect, useRef} from 'react';
import {Routes, Route, Link } from 'react-router-dom'

import {Board, Main, Layout} from './components'

import './App.scss'
import axios from 'axios';

export default function App() {

  const [recentVersion, setRecentVersion] = useState('') 
  const [championDataList, setChampionDataList] = useState({});
  const isMounted = useRef(false)

  const getRecentVersion = async () => {
    try{
      const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      const versionList = response.data
      setRecentVersion(versionList[0])
      console.log(versionList[0])
    }
    catch(err){ 
      console.log(err)
    }
  }

  const getChampionData = async () => {
    try{ 
      const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${recentVersion}/data/ko_KR/champion.json`)
      const championData = response.data.data
      setChampionDataList(championData)
      console.log(championData);
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=> {
    getRecentVersion()     
  },[])   

  useEffect(()=>{
    if(isMounted.current){
      getChampionData();
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
