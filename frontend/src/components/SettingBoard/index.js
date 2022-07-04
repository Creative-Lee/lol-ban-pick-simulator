import React from 'react'
import { Container } from 'react-bootstrap'
import RadioBox from './RadioBox'

export default function SettingBoard({ setBoardPhase, setMode }) {
  return (
    <Container id="setting-container" className="setting-container">
      <div className="setting-board">
        <div className="board__title">
          <p>LOL Ban-Pick simulator</p>
        </div>
        <RadioBox setMode={setMode} />
        <div className="go-banpick-button-wrap">
          <button onClick={() => setBoardPhase('banpick')}>밴픽하러가기</button>
        </div>
      </div>
    </Container>
  )
}
