import React, { useState } from 'react'
import { transparencyImg } from '../../../Assets/img/import_img/index'

export default function TeamSelectMenu({
  teamColor,
  teamName,
  setTeamName,
  inlineStyle,
}) {
  const [isTeamSelectMenuOpen, setIsTeamSelectMenuOpen] = useState({
    blue: false,
    red: false,
  })

  const teamArr = [
    'KDF',
    'T1',
    'DK',
    'BRO',
    'DRX',
    'GEN',
    'HLE',
    'KT',
    'LSB',
    'NS',
  ]

  const toggleIsTeamSelectMenuOpen = (teamColor) => {
    setIsTeamSelectMenuOpen((prevState) => ({
      ...prevState,
      [teamColor]: !prevState[teamColor],
    }))
  }
  const closeTeamSelectMenu = (teamColor) => {
    setIsTeamSelectMenuOpen((prevState) => ({
      ...prevState,
      [teamColor]: false,
    }))
  }

  return (
    <label className="team__select-menu" style={inlineStyle.teamSelectMenu}>
      <div className="team__name">
        <input
          className="name__button"
          type="button"
          id="name-input"
          onClick={() => {
            toggleIsTeamSelectMenuOpen(teamColor)
          }}
          onBlur={() => {
            closeTeamSelectMenu(teamColor)
          }}
          value={teamName}
        />
        <ul
          className="name__select"
          style={inlineStyle.nameSelect}
          data-html2canvas-ignore
        >
          {isTeamSelectMenuOpen[teamColor] &&
            teamArr.map((team, index) => (
              <li
                className="name__option"
                key={index}
                onMouseDown={() => {
                  setTeamName(team)
                }}
              >
                <img
                  className="option__logo"
                  alt="logo"
                  src={`${process.env.PUBLIC_URL}/assets/team_logo/${team}.png`}
                />
                <span className="option__span">{team}</span>
              </li>
            ))}
        </ul>
      </div>
      <div className="team__logo">
        <img
          className="logo"
          alt={`${teamColor}-team-logo-${teamName}`}
          src={
            teamName === 'Blue' || teamName === 'Red'
              ? transparencyImg
              : `${process.env.PUBLIC_URL}/assets/team_logo/${teamName}.png`
          }
        />
      </div>
    </label>
  )
}
