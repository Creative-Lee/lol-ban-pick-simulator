import React from 'react'
import ChampCard from './ChampCard'
import { searchIcon, noBanIcon } from '../../../../Assets/img/import_img'
import ReactTooltip from 'react-tooltip'

export default function ChampSelectBoard({
  searchInput,
  setSearchInput,
  pickBanPhase,
  updateSummonerData,
  champDataList,
  onClickChampionPickButton,
  onClickChampionBanButton,
  isPickedChampion,
  isBannedChampion,
  recentVersion,
}) {
  const onChangeSearchInput = (e) => setSearchInput(e.target.value)

  const searchToolTip = `기본, 초성 검색이 가능합니다🧐<br>
  띄어쓰기도 걱정하지 마세요! ex)리 신, 탐 켄치 
  `

  return (
    <div className='champion-select-board'>
      <div className='champion__select-option'>
        <div className='search'>
          <label className='search-input-label' htmlFor='search'>
            <img
              className='search-icon'
              src={searchIcon}
              alt='search-icon'
              data-for='search-tooltip'
              data-tip={searchToolTip}
            />
            <ReactTooltip
              id='search-tooltip'
              multiline={true}
              delayShow={100}
            />
          </label>
          <input
            id='search'
            className='search-input'
            type='text'
            placeholder='챔피언 이름 검색'
            spellCheck='false'
            value={searchInput}
            onChange={(e) => onChangeSearchInput(e)}
          />
        </div>
      </div>

      <div className='champions'>
        {pickBanPhase === 'Ban' && (
          <div
            className='champion__card'
            onClick={() => {
              updateSummonerData({
                type: 'bannedChampion',
                data: 'noBan',
                isConfirmed: false,
              })
            }}
          >
            <img className='champion__img' alt='no-ban-icon' src={noBanIcon} />
            <small className='champion__name'>없음</small>
          </div>
        )}
        {champDataList.map((champData, index) => (
          <ChampCard
            champData={champData}
            key={index}
            updateSummonerData={updateSummonerData}
            isPickedChampion={isPickedChampion}
            isBannedChampion={isBannedChampion}
            recentVersion={recentVersion}
            pickBanPhase={pickBanPhase}
          />
        ))}
      </div>

      <input
        className='champion__select-button'
        type='button'
        value={pickBanPhase}
        onClick={() => {
          pickBanPhase === 'Pick'
            ? onClickChampionPickButton()
            : onClickChampionBanButton()
        }}
      />
    </div>
  )
}
