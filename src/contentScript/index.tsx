import React from 'react'
import { createRoot } from 'react-dom/client'
import '../assets/tailwind.css'
import ContentScript from './contentScript'

function init() {
  const appContainer = document.createElement('div')
  if (!appContainer) {
    throw new Error('Can not find container')
  }
  document.body.appendChild(appContainer)
  const root = createRoot(appContainer)
  console.log(appContainer)
  root.render(<ContentScript />)
}
init()
