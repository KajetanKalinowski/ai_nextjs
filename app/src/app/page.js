'use client'
import { useState,useEffect } from "react"
export default function Home(){
  const [dane,setDane]=useState(null)
  useEffect(()=>{
    const getData = async ()=>{
    try {
     const data = await fetch(`http://192.168.0.136:5678/webhook/api?theme=niggers`)
      setDane(data)
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  getData()
  },[])
  return(
    <div>

    </div>
  )
}