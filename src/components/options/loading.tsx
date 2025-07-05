import React from 'react'
import { PacmanLoader } from 'react-spinners'

export default function LoadingFirst() {
    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-9999">
            <div className="text-center p-8 rounded-lg transform transition-all duration-300 hover:scale-105">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center ">
                    <PacmanLoader size={100} color={`#29bfff`} />
                    {/* <p className='absolute animate-pulse'>Loading</p> */}
                </h1>
            </div>
        </div>
    )
}
