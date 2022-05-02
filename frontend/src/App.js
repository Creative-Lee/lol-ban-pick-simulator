/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState , useEffect} from 'react';
import {Routes, Route, Link} from 'react-router-dom'

import { Main } from './components'

import './scss/App.scss'
import axios from 'axios';

export default function App() {

  const [recentVersion , setRecentVersion] = useState('')
  const [championDataList, setChampionDataList] = useState({});
  const [isMount, setIsMount] = useState(false);

  const getRecentVersion = () => {
    axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(result => {
      const versionList = result.data 
      console.log(versionList) 
      setRecentVersion(versionList[0])  
    })
    .catch(e=> console.log(e))
  }

  const getChampionData = () => {
    axios.get(`http://ddragon.leagueoflegends.com/cdn/${recentVersion}/data/ko_KR/champion.json`)
    .then(result => {
      let championData = result.data.data
      console.log(championData)
      setChampionDataList(championData)      
    })
    .catch(e=> console.log(e))
  }


  // const imgUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championNameList[0]}_0.jpg`

  useEffect(()=> {
    getRecentVersion()    
    setIsMount(true);
  },[])
  
  useEffect(()=>{
    if(isMount){
      getChampionData()
    }    
  },[recentVersion])

  return (
  <>
    <Main recentVersion={recentVersion} championDataList={championDataList} />
  </>
  );
}
