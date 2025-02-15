import { Header } from 'antd/es/layout/layout'
import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
        <Header/>

        <div>
            <Outlet/>
        </div>
        <div>
            footer
        </div>
    </div>
  )
}

export default Layout