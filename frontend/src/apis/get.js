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

export const getChampionDataList = async (recentVersion) => {
  try{ 
    const response = await lolApi.get(`cdn/${recentVersion}/data/ko_KR/champion.json`)
    const championMetaData = response.data

    return championMetaData.data
  }
  catch(err){
    console.log(err)
  }
}