import {lolApi} from "./instance";
import html2canvas from 'html2canvas'


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


export const getDownloadResultPngFile = async (elementId, ...removeElementId) => {
  try{
    const saveAs = (uri, fileName) => {
      const oneTimeUseLink = document.createElement('a') // 1회용 a태그 생성
      const removedElementArr = removeElementId.map(id => document.getElementById(id)) // 인자로 받은 removeElementIdArr를 돌면서 엘리멘트 저장
      const removedElementsParentNodeArr = removedElementArr.map(element => element.parentNode)

      document.body.appendChild(oneTimeUseLink) // body태그 하위에 추가
      oneTimeUseLink.href = uri // 인자로 받은 uri href로 지정
      oneTimeUseLink.download = fileName // 인자로 받은 fileName download로 지정
      removedElementArr.forEach(element => element.remove()) // 엘리먼트 삭제      
      oneTimeUseLink.click() // 다운로드 실행      
      document.body.removeChild(oneTimeUseLink) // 1회용 태그 사용 후 삭제
      removedElementArr.forEach((element, index) => removedElementsParentNodeArr[index].appendChild(element)) // 삭제한 엘리먼트 부활 
    }

    window.scrollTo(0,0); 
    const capturedCanvas = await html2canvas(document.getElementById(elementId))    
    saveAs(capturedCanvas.toDataURL(), 'download.png')
  }

  catch(err){
    console.log(err)
  }
}