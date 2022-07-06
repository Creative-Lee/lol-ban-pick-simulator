import React, { useRef, useState } from 'react'
import GoalEditor from './GoalEditor'
import GoalViewer from './GoalViewer'
import { getDownloadResultPngFile } from '../../../apis/get'

const resultDownToolTip1 = `밴픽 결과를 이미지 파일로 변환하여 자동 다운로드 합니다.<br>
주의하세요💩 : 소환사 챔피언 이미지와 일부 텍스트 사이즈가 조정되어 보이는 화면과 차이가 있습니다.<br>
(추후 사이즈 조정 없이 저장 가능하도록 업데이트 예정입니다^^)`
const resultDownToolTip2 = `결과 캡쳐를 위해 버튼 탭이 사라지고, 전체화면으로 전환되며, 스크롤이 조정됩니다.<br>  
(업데이트와 함께 사라질 기능입니다^^)`

export default function GoalBoard() {
  const editorRef = useRef()
  const [goalPatchVersion, setGoalPatchVersion] = useState('Patch version : ')
  const [viewerInput, setViewerInput] = useState('')
  const onChangeGoalPatchVersion = (e) => setGoalPatchVersion(e.target.value)
  const onChangeEditor = () => {
    const editorInputHtml = editorRef.current.getInstance().getHTML()
    setViewerInput(editorInputHtml)
  }

  return (
    <div id="todays-goal" className="todays-goal">
      <div className="goal__patch-version-wrap">
        <input
          id="goal__patch-version"
          className="goal__patch-version"
          type="text"
          // value={goalPatchVersion}
          // onChange={(e) => onChangeGoalPatchVersion(e)}
        />
      </div>

      <div
        className="goal__editor-wrap"
        // onClick={() => setGoalEditPhase('Editing')}
      >
        <GoalEditor />
        {/* {goalEditPhase === 'Editing' && <GoalEditor />}
        {goalEditPhase === 'EditDone' && <GoalViewer />} */}
      </div>

      <div
        id="goal__button-wrap"
        className="goal__button-wrap"
        data-html2canvas-ignore
      >
        {/* {goalEditPhase === 'Editing' && (
          <button onClick={() => setGoalEditPhase('EditDone')}>
            작성 완료
          </button>
        )}
        {goalEditPhase === 'EditDone' && (
          <>
            <button
              data-for="button-tooltip1"
              data-tip={resultDownToolTip1}
              data-class="result-down-tooltip"
              onClick={() => getDownloadResultPngFile('ban-pick-board')}
            >
              결과 다운로드
            </button>
            <ReactTooltip
              id="button-tooltip1"
              multiline={true}
              delayShow={100}
            />

            <button
              data-for="button-tooltip2"
              data-tip={resultDownToolTip2}
              data-class="result-down-tooltip"
              onClick={() => {
                setGoalEditPhase('End')
                document.documentElement
                  .requestFullscreen()
                  .then(() =>
                    document.documentElement.scroll(
                      0,
                      document.documentElement.clientHeight * 0.013
                    )
                  )
              }}
            >
              직접 캡쳐
            </button>
            <ReactTooltip
              id="button-tooltip2"
              multiline={true}
              delayShow={100}
            />
          </>
        )} */}
      </div>
    </div>
  )
}

{
  /* // {
//   goalEditPhase === 'End' && (
//     <div
//       className="goal__editor-wrap"
//       onClick={() => setGoalEditPhase('Editing')}
//     >
//       <Viewer initialValue={viewerInput} />
//     </div>
//   )
// } */
}
