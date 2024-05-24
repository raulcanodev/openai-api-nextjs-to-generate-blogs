import React from 'react'

export const AppLayout = ({children}) => {
  return (
    <>
    <div>
      <h1>App Layout</h1>
      <div>
        {children}
      </div>
    </div>
    </>
  )
}
