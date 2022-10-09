import { useState } from 'react'
import './App.css'
import MainBox from './layouts/MainBox'

// 1. Import `createTheme`
import {createTheme, NextUIProvider, Switch, useTheme} from "@nextui-org/react"
import useDarkMode from 'use-dark-mode';

// 2. Call `createTheme` and pass your custom values
const lightTheme = createTheme({
  type: 'light',
  theme: {
    // colors: {...},
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    // colors: {...},
  }
})

function App() {
  const darkMode = useDarkMode(false);
  const { type, isDark } = useTheme();
  return (
    <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
      The current theme is: {type}
      <Switch
        checked={darkMode.value}
        onChange={() => darkMode.toggle()}
      />
      <MainBox></MainBox>
    </NextUIProvider>

  )
}

export default App
