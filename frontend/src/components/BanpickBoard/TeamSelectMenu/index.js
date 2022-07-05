import React from 'react'

export default function TeamSelectMenu() {
  return (
    <label className="team__select-menu">
      <div className="team__name">
        <input
          className="name__button"
          type="button"
          id="blue-name-input"
          onClick={() => {
            toggleIsTeamSelectMenuOpen('blue')
          }}
          onBlur={() => {
            closeTeamSelectMenu('blue')
          }}
          value={selectedBlueTeam}
        />
        <ul className="name__select" data-html2canvas-ignore>
          {isTeamSelectMenuOpen.blue &&
            teamArr.map((team, index) => (
              <li
                className="name__option"
                key={index}
                onMouseDown={() => {
                  setSelectedBlueTeam(team)
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
          // alt={`blue-team-logo-${selectedBlueTeam}`}
          // src={
          //   selectedBlueTeam === ''
          //     ? transparencyImg
          //     : `${process.env.PUBLIC_URL}/assets/team_logo/${selectedBlueTeam}.png`
          // }
        />
      </div>
    </label>
  )
}
