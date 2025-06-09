import React from 'react'
import SpeciesManager from '@/components/SpeciesManager'

const page = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Species Manager</h1>
      <SpeciesManager />
    </div>
  )
}

export default page