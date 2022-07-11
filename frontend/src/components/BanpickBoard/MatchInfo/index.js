import React, { useState } from 'react'

export default function MatchInfo() {
  const [date, setDate] = useState('2022-00-00')
  const [round, setRound] = useState('GAME 1')

  const onChangeDate = (e) => {
    setDate(e.target.value)
  }
  const onChangeRound = (e) => {
    setRound(e.target.value)
  }

  return (
    <div className='match-info'>
      <div className='date-wrap'>
        <input
          id='date'
          className='date'
          type='text'
          value={date}
          spellCheck='false'
          onChange={onChangeDate}
        />
      </div>
      <div className='round-wrap'>
        <input
          id='round'
          className='round'
          type='text'
          value={round}
          spellCheck='false'
          onChange={onChangeRound}
        />
      </div>
    </div>
  )
}
