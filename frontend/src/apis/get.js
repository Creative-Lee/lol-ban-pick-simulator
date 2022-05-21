import {lolApi} from "./instance";

export const getRecentVersion = async () => {
  try{
    const response = await lolApi.get('api/versions.json')
    const versionList = response.data

    return versionList[0] 
  }
  catch(err){ 
    console.log(err)
  }
}

export const getAscendingChampionDataList = async (recentVersion) => {
  try{ 
    const response = await lolApi.get(`cdn/${recentVersion}/data/ko_KR/champion.json`)
    const championMetaData = response.data.data
    const championDataList = Object.values(championMetaData)
    const ascendingChampionDataList = championDataList.sort((a,b) => {
      if(a.name < b.name) return -1
      else if(a.name > b.name) return 1
      else return 0
      // a.name < b.name ? -1 
      // : a.name > b.name 
      //   ? 1 
      //   : 0
    })
    console.log(ascendingChampionDataList)
    return ascendingChampionDataList
  }
  catch(err){
    console.log(err)
  }
}
const spell = `cdn/12.9.1/img/spell/SummonerFlash.png`

export const getClassicSpell = async (recentVersion) => {
  try{ 
    const response = await lolApi.get(`cdn/${recentVersion}/data/en_US/summoner.json`)
    const spellData = response.data.data
    const spellsPropertyList = Object.values(spellData)
    const classicSpellList = spellsPropertyList.filter(property => property.modes.includes('CLASSIC'))

    console.log(classicSpellList)
    return classicSpellList
  }
  catch(err){
    console.log(err)
  }
}