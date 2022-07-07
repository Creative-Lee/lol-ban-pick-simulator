import React from 'react'
import ChampSelectBoard from './ChampSelectBoard'
import SpellSelectBoard from './SpellSelectBoard'

export default function SelectBoard({
  classicSpellList,
  recentVersion,
  searchInput,
  setSearchInput,
  pickBanPhase,
  updateSummonerData,
  champDataList,
  onClickChampionPickButton,
  onClickChampionBanButton,
  isPickedChampion,
  isBannedChampion,
}) {
  return (
    <>
      <ChampSelectBoard
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onClickChampionBanButton={onClickChampionBanButton}
        onClickChampionPickButton={onClickChampionPickButton}
        champDataList={champDataList}
        updateSummonerData={updateSummonerData}
        pickBanPhase={pickBanPhase}
        isPickedChampion={isPickedChampion}
        isBannedChampion={isBannedChampion}
        recentVersion={recentVersion}
      />
      {/* {(pickBanPhase === 'Ban' || pickBanPhase === 'Pick') && (
        <ChampSelectBoard />
      )}
      {pickBanPhase === 'Spell' && <SpellSelectBoard classicSpellList={classicSpellList}/>} */}
    </>
  )
}
