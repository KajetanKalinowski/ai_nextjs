'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState,useEffect } from "react"
export default function Home(){
  const [dane,setDane]=useState(null)
  const [input,setInput]=useState(null)
  
  const [click,setClick]=useState(0)  
    const getData = async ()=>{
    try {
     const data = await fetch('http://172.16.15.138:5678/webhook/api',{headers:{"topic":`${input}`}})
      const json = await data.json()
      console.log(json.output)
      setDane(json.output)
      setClick(0)
    } catch (err) {
      console.log(err)
    }
   
  }

  
  const handleInput = (e)=>{
    setInput(e.target.value)
    console.log(e.target.value)
  }
  const sendInf = (i)=>{
    console.log(i)
    setClick(1)
    
  }
  return(
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-2">
      <Input onChange={(e)=>{handleInput(e)}} className="w-[300px]"></Input>
      <Button onClick={getData}>Submit</Button>
      {dane && 
          <div className="flex flex-col justify-start items-center">
            <h1 className="font-bold">{dane.question}</h1>
            <div className="flex flex-col gap-2">
            {dane.answers && dane.answers.map((item)=>(
              <Button disabled={click==1?true:false} variant="outline" key={item.isCorrect} onClick={()=>{sendInf(item.isCorrect)}} className={click==1?(item.isCorrect==true?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{item.text}</Button>
            ))}
            
            </div>
          </div>
      }
    </div>
  )
}