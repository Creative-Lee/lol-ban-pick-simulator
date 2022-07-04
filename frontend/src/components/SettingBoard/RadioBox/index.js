import React from 'react'
import ReactTooltip from 'react-tooltip'
import { tooltipIcon } from '../../../Assets/img/import_img'
const modeToolTip = `[빠른 결과 모드] 는 Ban-Pick 순서와는 상관없이 빠르게 데이터 입력이 가능하고, 기본 스펠이 자동으로 입력됩니다.<br>
[토너먼트 드래프트 모드] 는 전통 Ban-Pick 룰에 따라 진행됩니다. (현재 개발중입니다^^)`

export default function RadioBox({ setMode }) {
  const onChangeMode = (e) => setMode(e.target.value)

  return (
    <div className="radio-box">
      <div className="radio-box__title">
        <p>
          모드 선택
          <img
            className="mode-tooltip-icon"
            alt="tooltip-mark"
            src={tooltipIcon}
            data-for="mode-tooltip"
            data-tip={modeToolTip}
            data-class="mode-tooltip-text"
          />
        </p>
        <ReactTooltip id="mode-tooltip" multiline={true} delayShow={100} />
      </div>
      <div className="radio-button-wrap">
        <div className="radio-button">
          <input
            id="rapid"
            type="radio"
            name="mode"
            value="rapid"
            onChange={onChangeMode}
            defaultChecked
          />
          <label htmlFor="rapid">빠른 결과</label>
        </div>

        <div className="radio-button">
          <input
            id="simulation"
            type="radio"
            name="mode"
            value="simulation"
            onChange={onChangeMode}
            disabled
          />
          <label htmlFor="simulation">토너먼트 드래프트</label>
        </div>
      </div>
    </div>
  )
}
