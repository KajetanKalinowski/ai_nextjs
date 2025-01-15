'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState,useEffect } from "react"
export default function Home(){
  const [dane,setDane]=useState(null)
  const [input,setInput]=useState(null)
  const [correct,setCorrect]=useState(null)
  
    const getData = async ()=>{
    try {
     const data = await fetch('http://172.16.15.138:5678/webhook/api',{headers:{"topic":`${input}`}})
      const json = await data.json()
      console.log(json.output)
      setDane(json.output)
      setCorrect(null)
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
    if(i==true){
      setCorrect("Poprawna odpowiedź")
    }else{
      setCorrect("Błędna odpowiedź")
    }
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
              <Button key={item.isCorrect} onClick={()=>{sendInf(item.isCorrect)}} className="border-2 border-black">{item.text}</Button>
            ))}
            {correct}
            </div>
          </div>
      }
    </div>
  )
}