import React from 'react'
import imge from '../../assets/images/testimg.png'

const Card = () => {
  return (
    <div className='h-[220px] w-[300px] rounded-2xl bg-[#D9D9D9] overflow-hidden'>
        <div className='h-[150px] w-full bg-white'>
            <img src={imge} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='h-[70px] w-full flex justify-between items-center px-3 py-1 '>
            <h1>
                Name of pet
            </h1>
            <button className='bg-[#82c596] text-[#2c2c2c] text-lg px-2 py-1 font-semibold rounded-2xl'>
                Details
            </button>
        </div>
    </div>
  )
}

export default Card