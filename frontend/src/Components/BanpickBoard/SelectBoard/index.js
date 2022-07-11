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

  summonerName,
  onClickSpellSelectButton,
  zoomViewImgSrc,
  currentSelectingSpellNumber,
  setCurrentSelectingSpellNumber,
  currentSelectingTeam,
  currentSelectingIndex,
  isPickedSpell,
  updateSpell,
}) {
  return (
    <>
      {(pickBanPhase === 'Ban' || pickBanPhase === 'Pick') && (
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
      )}
      {pickBanPhase === 'Spell' && (
        <SpellSelectBoard
          classicSpellList={classicSpellList}
          currentSelectingTeam={currentSelectingTeam}
          currentSelectingIndex={currentSelectingIndex}
          currentSelectingSpellNumber={currentSelectingSpellNumber}
          setCurrentSelectingSpellNumber={setCurrentSelectingSpellNumber}
          zoomViewImgSrc={zoomViewImgSrc}
          onClickSpellSelectButton={onClickSpellSelectButton}
          summonerName={summonerName}
          recentVersion={recentVersion}
          isPickedSpell={isPickedSpell}
          updateSpell={updateSpell}
        />
      )}
    </>
  )
}
