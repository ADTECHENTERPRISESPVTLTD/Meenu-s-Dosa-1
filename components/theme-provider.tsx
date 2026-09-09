'use client'
import { createContext, useContext, useEffect, useState } from 'react'
const ThemeContext = createContext<{dark:boolean; toggle:()=>void}>({dark:false,toggle:()=>{}})
export function ThemeProvider({children}:{children:React.ReactNode}) { const [dark,setDark]=useState(false); useEffect(()=>{ const saved=localStorage.getItem('meenu-theme'); const next=saved ? saved==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches; setDark(next); document.documentElement.classList.toggle('dark', next) },[]); const toggle=()=>{ const next=!dark; setDark(next); localStorage.setItem('meenu-theme', next?'dark':'light'); document.documentElement.classList.toggle('dark', next) }; return <ThemeContext.Provider value={{dark,toggle}}>{children}</ThemeContext.Provider> }
export const useTheme=()=>useContext(ThemeContext)
