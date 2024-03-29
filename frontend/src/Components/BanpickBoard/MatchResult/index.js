import React, { useState } from 'react'

const MatchResult = () => {
  const [matchResult, setMatchResult] = useState('Win or Lose')
  const onChangeMatchResult = (e) => setMatchResult(e.target.value)

  return (
    <div id='match-result-wrap' className='match-result-wrap'>
      <input
        className='match-result'
        type='text'
        id='match-result'
        value={matchResult}
        spellCheck='false'
        onChange={onChangeMatchResult}
      />
    </div>
  )
}

export default React.memo(MatchResult)
