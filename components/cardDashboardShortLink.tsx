import React, { FC } from 'react'

type ParamCardDashboardShortLink = {
  title: string,
  date: string,
  count: string,
  direction: string
}

export const CardDashboardShortLink: FC<ParamCardDashboardShortLink> = ({ title, count, date, direction }) => {
  return (
    <div className='flex justify-between bg-gray-100 px-2 py-3 rounded-md shadow-gray-300 shadow-sm h-24 cursor-pointer hover:bg-gray-200 mb-3'>
      <div className='flex flex-col justify-between items-start'>
        <span className='text-sm'>{date}</span>
        <h2 className='text-lg'>{title}</h2>
      </div>
      <div className='flex flex-col justify-between items-end'>
        <span className='text-sm'>{count} clicks</span>
        <span className='text-sky-900'>{direction}</span>
      </div>
    </div>
  )
}
