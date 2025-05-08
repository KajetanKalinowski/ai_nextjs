'use client'
import { useState,useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import PocketBase, { ClientResponseError } from 'pocketbase';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart"
  
const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Historia({params}) {
    const [history,setHistory]=useState(null)
    const [truel,setTruel] = useState(0)
    const [falsel,setFalsel] = useState(0)
    useEffect(()=>{
        const getHis = async()=>{
          try {
             const data = await fetch('http://172.16.15.138:5678/webhook/history')
            //const data = await fetch('http://192.168.0.150:5678/webhook/history')
            const json = await data.json()
            console.log(json.items)
            setHistory(json.items)
            console.log(params.kod)
            
          } catch (error) {
            console.log(error)
          }
        
        }
        getHis()
      },[])
      const chartData = [
        { month: "Odpowiedzi", Poprawne: truel, Bledne: falsel  },
        
      ]
      const chartConfig = {
        Poprawne: {
          label: "Poprawne",
          color: "hsl(var(--chart-1))",
        },
        Bledne: {
            label: "Błędne",
            color: "hsl(var(--chart-2))",
          }
        
      }
      
      useEffect(()=>{
        const getInf = ()=>{
        history && history.map((item)=>{
            if(item.nrsesji==params.kod){
                (item.usr_answer=="true"?setTruel(truel+1):(item.usr_answer=="false"?setFalsel(falsel+1):null))
            }
        })
    }
    getInf()
      },[history])
    return(
        <div className="w-full h-[100vh]">
            <h1 className="text-center h-[3vh]"><b>Twoje odpowiedzi</b></h1>
<ScrollArea className="flex flex-col gap-2 h-[60vh] w-full rounded-md border">
        {history&&history.map((item,idx)=>(
            (item.nrsesji==params.kod?
          <div key={idx} className="flex flex-col justify-center items-center gap-2 m-2">
          <h1>{item.question}</h1>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer1?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer1}</Button>{item.answer1==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer2?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer2}</Button>{item.answer2==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer3?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer3}</Button>{item.answer3==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
         <div className="flex flex-row items-center"><Button disabled variant="outline" className={item.correct_answer==item.answer4?`border-2 border-black bg-green-500 disabled:opacity-100`:`border-2 border-black bg-red-500 disabled:opacity-100`}>{item.answer4}</Button>{item.answer4==item.usr_txt_ans?<p>Twoja odpowiedz</p>:null}</div>
          <div className="w-full border-2 border-black"></div>
          
          </div>
            :<></>)
        ))}
      </ScrollArea>
      <Card className="h-[37vh] w-full">
      <CardHeader>
        <CardTitle>Wykres odpowiedzi</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}  
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Poprawne" fill="green" radius={4} />
            <Bar dataKey="Bledne" fill="red" radius={4} />
            
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
      </div>
    )
}