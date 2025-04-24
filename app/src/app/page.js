'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState,useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PocketBase, { ClientResponseError } from 'pocketbase';
const pb = new PocketBase('http://172.16.15.138:8080');
export default function Home(){
  const [dane,setDane]=useState(null)
  const [input,setInput]=useState(null)
  const [first,setFirst]=useState(0)
  const [click,setClick]=useState(0) 
  const [history,setHistory]=useState(null)
  const [user,setUser] = useState(pb.authStore.record)
  const [show,setShow] = useState(true)
  if(!user){
    window.location.href="/logowanie"
  }
    const getData = async ()=>{
    try {
      const data = await fetch('http://172.16.15.138:5678/webhook/api',{headers:{"topic":`${input}`}})
     //const data = await fetch('http://192.168.0.136:5678/webhook/api',{headers:{"topic":`${input}`}})
      const json = await data.json()
      console.log(data)
      console.log(json)
      setDane(json.output)
      setClick(0)
      setFirst(1)
    //   if(json.output==undefined){
    //     getData()
    // }
    
    } catch (err) {
      console.log(err)
    }
   
  }
  useEffect(()=>{
    const getHis = async()=>{
      try {
         const data = await fetch('http://172.16.15.138:5678/webhook/history')
       // const data = await fetch('http://192.168.0.136:5678/webhook/history')
        const json = await data.json()
        console.log(json.items)
        setHistory(json.items)
      } catch (error) {
        
      }
    }
    getHis()
  },[])

  
  const handleInput = (e)=>{
    setInput(e)
    console.log(e)
    setShow(false)
  }
  const sendInf = async(i)=>{
    console.log(i)
    await fetch(`http://172.16.15.138:5678/webhook/base?question=${dane.question}&answer1=${dane.answers[0].text}&answer2=${dane.answers[1].text}&answer3=${dane.answers[2].text}&answer4=${dane.answers[3].text}&usr_answer=${i}&correct_answer=${(dane.answers[0].isCorrect==true?dane.answers[0].text:(dane.answers[1].isCorrect==true?dane.answers[1].text:(dane.answers[2].isCorrect==true?dane.answers[2].text:(dane.answers[3].isCorrect==true?dane.answers[3].text:null))))}`,{method:"POST"})
    //await fetch(`http://192.168.0.136:5678/webhook/base?question=${dane.question}&answer1=${dane.answers[0].text}&answer2=${dane.answers[1].text}&usr_answer=${i}&correct_answer=${(dane.answers[0].isCorrect==true?dane.answers[0].text:dane.answers[1].text)}`,{method:"POST"})
    setClick(1)
  }
  const wyloguj = ()=>{
    pb.authStore.clear()
    window.location.href="/logowanie"
  }
  return(
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-2">
      <Button onClick={wyloguj}>Wyloguj</Button>
      {/* <Input onChange={(e)=>{handleInput(e)}} placeholder="Temat pytania" className="w-[300px]"></Input> */}
      <Select onValueChange={(e)=>{handleInput(e)}}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Kategorie Pytań" />
      </SelectTrigger>
      <SelectContent >
        <SelectGroup>
          <SelectLabel>Języki programowania</SelectLabel>
          <SelectItem value="HTML">HTML</SelectItem>
          <SelectItem value="CSS">CSS</SelectItem>
          <SelectItem value="JavaScript">JavaScript</SelectItem>
          <SelectItem value="Python">Python</SelectItem>
          <SelectItem value="C#">C#</SelectItem>
          <SelectItem value="C++">C++</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
      {first==0?<Button onClick={getData} disabled={show}>Losuj Pytanie</Button>:<></>}
      {dane && 
          <div className="flex flex-col justify-start items-center gap-2">
            <h1 className="font-bold">{dane.question}</h1>
            <div className="flex flex-col gap-2">
            {dane.answers && dane.answers.map((item,idx)=>(
              <Button disabled={click==1?true:false} variant="outline" key={idx} onClick={()=>{sendInf(item.isCorrect)}} className={click==1?(item.isCorrect==true?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{item.text}</Button>
            ))}
            
            </div>
            {first==1?<Button onClick={getData}>Następne Pytanie</Button>:<></>}
          </div>
      }
      <ScrollArea className="flex flex-col gap-2 h-[50vh] w-full rounded-md border">
        {history&&history.map((item,idx)=>(
          <div key={idx} className="flex flex-col justify-center items-center gap-2 m-2">
          <h1>{item.question}</h1>
          <Button disabled variant="outline" className={item.correct_answer==item.answer1?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer1}</Button>
          <Button disabled variant="outline" className={item.correct_answer==item.answer2?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer2}</Button>
          <Button disabled variant="outline" className={item.correct_answer==item.answer3?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer3}</Button>
          <Button disabled variant="outline" className={item.correct_answer==item.answer4?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer4}</Button>
          <div className="w-full border-2 border-black"></div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}