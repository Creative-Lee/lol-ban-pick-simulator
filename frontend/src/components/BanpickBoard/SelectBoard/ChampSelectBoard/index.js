import React, { useState } from 'react'
import ChampCard from './ChampCard'
import { searchIcon } from '../../../../Assets/img/import_img'
import ReactTooltip from 'react-tooltip'

export default function ChampSelectBoard() {
  const [champDataList, setChampDataList] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const onChangeSearchInput = (e) => setSearchInput(e.target.value)

  // const updateMatchChampDataList = useCallback(() => {
  //   const championNameList = ascendingChampionDataList.map((data) => data.name)
  //   let searcher = new Hangul.Searcher(searchInput)

  //   const letterMatchedChampNameList = championNameList.filter(
  //     (championName) => searcher.search(championName) >= 0
  //   )
  //   const letterMatchedChampNameListWithoutSpace = championNameList.filter(
  //     (championName) => searcher.search(championName.replace(/ /gi, '')) >= 0
  //   )
  //   const chosungMatchedChampNameList = championNameList.filter(
  //     (championName) => {
  //       const champChosungStrArr = Hangul.d(championName, true)
  //         .map((disEachLetterList) => disEachLetterList[0]) // ['ㄱ', 'ㄹ'] and ['ㄱ', 'ㄹ', 'ㅇ'] ...something
  //         .join('') // ['ㄱㄹ'] and ['ㄱㄹㅇ'] ...something
  //         .replace(/ /gi, '') // 띄어쓰기 제거

  //       const searchInputChosungStrArr = Hangul.d(searchInput).join('') // ['ㄱ','ㄹ'] -> ['ㄱㄹ']
  //       return champChosungStrArr.includes(searchInputChosungStrArr)
  //     }
  //   )

  //   const mergedChampNameList = letterMatchedChampNameList.concat(
  //     letterMatchedChampNameListWithoutSpace,
  //     chosungMatchedChampNameList
  //   )
  //   const duplicatesRemovedChampNameList = mergedChampNameList.filter(
  //     (name, index) => mergedChampNameList.indexOf(name) === index
  //   )

  //   const matchedChampDataList = ascendingChampionDataList.filter((data) =>
  //     duplicatesRemovedChampNameList.includes(data.name)
  //   )

  //   setChampDataList(matchedChampDataList)
  // }, [ascendingChampionDataList, searchInput])

  // useEffect(() => {
  //   // updateMatchChampDataList
  //   updateMatchChampDataList()
  //   console.log('matchedChampDataList update compleat')
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchInput, boardPhase])

  const searchToolTip = `기본, 초성 검색이 가능합니다🧐<br>
  띄어쓰기도 걱정하지 마세요! ex)리 신, 탐 켄치 
  `

  return (
    <div className="champion-select-board">
      <div className="champion__select-option">
        <div className="search">
          <label className="search-input-label" htmlFor="search">
            <img
              className="search-icon"
              src={searchIcon}
              alt="search-icon"
              data-for="search-tooltip"
              data-tip={searchToolTip}
            />
            <ReactTooltip
              id="search-tooltip"
              multiline={true}
              delayShow={100}
            />
          </label>
          <input
            id="search"
            className="search-input"
            type="text"
            placeholder="챔피언 이름 검색"
            spellCheck="false"
            value={searchInput}
            onChange={(e) => onChangeSearchInput(e)}
          />
        </div>
      </div>

      <div className="champions">
        {/* {pickBanPhase === 'Ban' && ( 
          <div
            className="champion__card"
            onClick={() => {
              updateSummonerData({
                type: 'bannedChampion',
                data: 'noBan',
                isConfirmed: false,
              })
            }}
          >
            <img className="champion__img" alt="no-ban-icon" src={noBanIcon} />
            <small className="champion__name">없음</small>
          </div>
        )} */}
        {champDataList.map((champData, index) => (
          <ChampCard champData={champData} key={index} />
        ))}
      </div>

      <input
        className="champion__select-button"
        type="button"
        // value={pickBanPhase}
        // onClick={() => {
        //   onClickChampionBanButton()
        // }}
      />
    </div>
  )
}
