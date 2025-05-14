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
import { Check,X } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import Menu from "@/components/ui/menu"
import PocketBase, { ClientResponseError } from 'pocketbase';
const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Home(){
  
  const [dane,setDane]=useState(null)
  const [input,setInput]=useState(null)
  const [first,setFirst]=useState(0)
  const [click,setClick]=useState(0) 
  const [liczbap,setLiczbap]=useState(0)
  const [history,setHistory]=useState(null)
  const [user,setUser] = useState(pb.authStore.record)
  const [show,setShow] = useState(true)
  const [sesjon,setSesjon] = useState(Date())
  const [cos,setCos] = useState(Math.random()*10000)
  const [truel,setTruel] = useState(0)
  const [falsel,setFalsel] = useState(0)
  const [notion,setNotion] = useState(false)
  const [n_ans,setN_ans] = useState(false)
  if(!user){
    window.location.href="/logowanie"
  }
    const onfirst = async ()=>{
    try {
      const data = await fetch('http://172.16.15.138:5678/webhook/api',{headers:{"topic":`${input}`}})
     //const data = await fetch('http://192.168.0.150:5678/webhook/api',{headers:{"topic":`${input}`}})
     //await fetch(`http://192.168.0.150:5678/webhook/sesja?sesja=${sesjon}&category=${input}`,{method:"POST"})
      const json = await data.json()
      console.log(data)
      console.log(json)
      setDane(json.output)
      setClick(0)
      setFirst(1)
      setNotion(false)
      setLiczbap(liczbap+1)
      console.log(sesjon)
       if(json.output==undefined){
         getNotion()
     }
    
    } catch (err) {
      console.log(err)
      getNotion()
    }
   
  }
  const getData = async ()=>{
    try {
      const data = await fetch('http://172.16.15.138:5678/webhook/api',{headers:{"topic":`${input}`}})
     //const data = await fetch('http://192.168.0.150:5678/webhook/api',{headers:{"topic":`${input}`}})
      const json = await data.json()
      console.log(data)
      console.log(json)
      setDane(json.output)
      setClick(0)
      setFirst(1)
      setNotion(false)
      setLiczbap(liczbap+1)
      console.log(sesjon)
      console.log(input)
      if(json.output==undefined){
        getNotion()
    }
    
    
    } catch (err) {
      console.log(err)
      getNotion()
    }
   
  }
  const getNotion = async ()=>{
    try{
    const data = await fetch('http://172.16.15.138:5678/webhook/notion',
      {headers:{"topic":`${input}`}}
      )
    const json = await data.json()
    console.log(json)
    
    setDane(json[0])
    
    setClick(0)
    setFirst(1)
    setLiczbap(liczbap+1)
    setNotion(true)
    console.log(sesjon)
    console.log(input)
    }catch(err){
      console.log(err)
    }

  }
  useEffect(()=>{
    const getHis = async()=>{
      try {
         const data = await fetch('http://172.16.15.138:5678/webhook/history')
        //const data = await fetch('http://192.168.0.150:5678/webhook/history')
        const json = await data.json()
        console.log(json.items)
        setHistory(json.items)
      } catch (error) {
        
      }
    }
    getHis()
  },[])

  
  const handleInput = (e)=>{
    setInput(e.toString())
    console.log(e)
    setShow(false)
  }
  const sendInf = async(i)=>{
    console.log(i)
    if(i.isCorrect==true){
      setTruel(truel+1)
      console.log(truel)
    }else if(i.isCorrect==false){
      setFalsel(falsel+1)
      console.log(falsel)
    }
    await fetch(`http://172.16.15.138:5678/webhook/base?question=${dane.question}&answer1=${dane.answers[0].text}&answer2=${dane.answers[1].text}&answer3=${dane.answers[2].text}&answer4=${dane.answers[3].text}&sesjon=${sesjon}&category=${input}&usr_answer=${i.isCorrect}&usr_txt_ans=${i.text}&nrsesji=${cos}&id_usr=${user.id}&correct_answer=${(dane.answers[0].isCorrect==true?dane.answers[0].text:(dane.answers[1].isCorrect==true?dane.answers[1].text:(dane.answers[2].isCorrect==true?dane.answers[2].text:(dane.answers[3].isCorrect==true?dane.answers[3].text:null))))}`,{method:"POST"})
    //await fetch(`http://192.168.0.150:5678/webhook/base?question=${dane.question}&answer1=${dane.answers[0].text}&answer2=${dane.answers[1].text}&answer3=${dane.answers[2].text}&answer4=${dane.answers[3].text}&sesjon=${sesjon}&category=${input}&usr_answer=${i}&correct_answer=${(dane.answers[0].isCorrect==true?dane.answers[0].text:(dane.answers[1].isCorrect==true?dane.answers[1].text:(dane.answers[2].isCorrect==true?dane.answers[2].text:(dane.answers[3].isCorrect==true?dane.answers[3].text:null))))}`,{method:"POST"})
    setClick(1)
  }
  const sendInfN = async(i)=>{
    console.log(i)
    if(i.target.innerHTML==dane.property_correct_answer){
      setN_ans(true)
      setTruel(truel+1)
      console.log(truel)
    }else{
      setN_ans(false)
      setFalsel(falsel+1)
      console.log(falsel)
    }
    await fetch(`http://172.16.15.138:5678/webhook/base?question=${dane.property_question}&answer1=${dane.property_answer1}&answer2=${dane.property_answer2}&answer3=${dane.property_answer3}&answer4=${dane.property_answer4}&sesjon=${sesjon}&category=${input}&usr_answer=${n_ans}&usr_txt_ans=${i.target.innerHTML}&nrsesji=${cos}&id_usr=${user.id}&correct_answer=${dane.property_correct_answer}`,{method:"POST"})
    //await fetch(`http://192.168.0.150:5678/webhook/base?question=${dane.question}&answer1=${dane.answers[0].text}&answer2=${dane.answers[1].text}&answer3=${dane.answers[2].text}&answer4=${dane.answers[3].text}&sesjon=${sesjon}&category=${input}&usr_answer=${i}&correct_answer=${(dane.answers[0].isCorrect==true?dane.answers[0].text:(dane.answers[1].isCorrect==true?dane.answers[1].text:(dane.answers[2].isCorrect==true?dane.answers[2].text:(dane.answers[3].isCorrect==true?dane.answers[3].text:null))))}`,{method:"POST"})
    setClick(1)
  }
  const pod = async()=>{
    await fetch(`http://172.16.15.138:5678/webhook/sesja?sesja=${sesjon}&id_usr=${user.id}&poprawne=${truel}&niepoprawne=${falsel}&nrsesji=${cos}&category=${input}`,{method:"POST"})
    window.location.href=`/${cos}`
  }
  const chartData = [
    { progress: "Pytania", pytania: liczbap, fill: "var(--color-safari)" },
  ]
  
  const chartConfig = {
    pytania: {
      label: "Pytania",
    },
    progress: {
      label: "Pytania",
      color: "hsl(var(--chart-2))",
    },
  }
  return(
    <>
    
    <Menu></Menu>
    <div className="flex flex-col justify-center items-center h-[95vh] w-screen gap-2">
      {/* <Input onChange={(e)=>{handleInput(e)}} placeholder="Temat pytania" className="w-[300px]"></Input> */}
      <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
              <CardTitle>Zadane pytania</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  startAngle={90}
                  endAngle={90+(liczbap*-36)}
                  innerRadius={80}
                  outerRadius={110}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={true}
                    stroke="none"
                    className="first:fill-muted last:fill-background"
                    polarRadius={[86, 74]}
                  />
                  <RadialBar dataKey="pytania" background cornerRadius={10} />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-4xl font-bold"
                              >
                                {chartData[0].pytania}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                               ✔️ {truel} | {falsel} ❌
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
            </CardFooter>
          </Card>
      {first==0?<Select onValueChange={(e)=>{handleInput(e)}}>
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
          <SelectItem value="C">C</SelectItem>
          <SelectItem value="PHP">PHP</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>:<></>}
      {first==0?<Button onClick={onfirst} disabled={show}>Losuj Pytanie</Button>:<></>}
      {notion==false?(dane && 
          <div className="flex flex-col justify-start items-center gap-2">
            <h1 className="font-bold">{dane.question}</h1>
            <div className="flex flex-col gap-2">
            {dane.answers && dane.answers.map((item,idx)=>(
              <Button disabled={click==1?true:false} variant="outline" key={idx} onClick={()=>{sendInf(item)}} className={click==1?(item.isCorrect==true?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{item.text}</Button>
            ))}
            
            </div>
            {first==1 && liczbap<10?(click!=0?<Button onClick={getData}>Następne Pytanie</Button>:<Button disabled onClick={getData}>Następne Pytanie</Button>):(click!=0?<Button onClick={pod}>Przejdź do podsumowania</Button>:<Button disabled onClick={pod}>Przejdź do podsumowania</Button>)}
          </div>
      ):(dane && 
          <div className="flex flex-col justify-start items-center gap-2">
            <h1 className="font-bold">{dane.property_question}</h1>
            <div className="flex flex-col gap-2">
            
              <Button disabled={click==1?true:false} variant="outline" onClick={(e)=>{sendInfN(e)}} className={click==1?(dane.property_answer1==dane.property_correct_answer?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{dane.property_answer1}</Button>
              <Button disabled={click==1?true:false} variant="outline" onClick={(e)=>{sendInfN(e)}} className={click==1?(dane.property_answer2==dane.property_correct_answer?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{dane.property_answer2}</Button>
              <Button disabled={click==1?true:false} variant="outline" onClick={(e)=>{sendInfN(e)}} className={click==1?(dane.property_answer3==dane.property_correct_answer?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{dane.property_answer3}</Button>
              <Button disabled={click==1?true:false} variant="outline" onClick={(e)=>{sendInfN(e)}} className={click==1?(dane.property_answer4==dane.property_correct_answer?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`):`border-2 border-black bg-black-500`}>{dane.property_answer4}</Button>
            </div>
            {first==1 && liczbap<10?(click!=0?<Button onClick={getData}>Następne Pytanie</Button>:<Button disabled onClick={getData}>Następne Pytanie</Button>):(click!=0?<Button onClick={pod}>Przejdź do podsumowania</Button>:<Button disabled onClick={pod}>Przejdź do podsumowania</Button>)}
          </div>)}
      {/* <ScrollArea className="flex flex-col gap-2 h-[50vh] w-full rounded-md border">
        {history&&history.map((item,idx)=>(
          <div key={idx} className="flex flex-col justify-center items-center gap-2 m-2">
          <h1>{item.question}</h1>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer1?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer1}</Button>{item.answer1==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer2?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer2}</Button>{item.answer2==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer3?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer3}</Button>{item.answer3==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer4?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer4}</Button>{item.answer4==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
          <div className="w-full border-2 border-black"></div>
          </div>
        ))}
      </ScrollArea> */}
    </div>
    </>
    

  )
}