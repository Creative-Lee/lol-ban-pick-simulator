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
    
    return ascendingChampionDataList
  }
  catch(err){
    console.log(err)
  }
}