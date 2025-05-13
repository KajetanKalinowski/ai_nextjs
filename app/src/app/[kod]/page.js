'use client'
import { useState,useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import PocketBase, { ClientResponseError } from 'pocketbase';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
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
  import Menu from "@/components/ui/menu";
const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Historia({params}) {
    const [history,setHistory]=useState(null)
    const [truel,setTruel] = useState(0)
    const [falsel,setFalsel] = useState(0)
    const [sesja,setSesja] = useState(null)
    const [user,setUser] = useState(pb.authStore.record)
      if(!user){
        window.location.href="/logowanie"
      }
    useEffect(()=>{
        const getHis = async()=>{
          try {
             const data = await fetch('http://172.16.15.138:5678/webhook/history')
            //const data = await fetch('http://192.168.0.150:5678/webhook/history')
            const dane = await pb.collection('Sesje').getFullList({
              filter: `nrsesji = '${params.kod}'`,
            });
            const json = await data.json()
            console.log(json.items)
            setHistory(json.items)
            console.log(params.kod)
            setSesja(dane[0])
            console.log(dane[0])
          } catch (error) {
            console.log(error)
          }
        
        }
        getHis()
      },[])
      const chartData = [{ month: "Odpowiedzi", poprawne: sesja&&sesja.poprawne, niepoprawne: sesja&&sesja.niepoprawne }]
      const chartConfig = {
         poprawne: {
         label: "Poprawne",
         color: "hsl(var(--chart-1))",
        },
          niepoprawne: {
          label: "Błędne",
          color: "hsl(var(--chart-2))",
        },
      }
      const totalVisitors1 = chartData[0].poprawne 
      const totalVisitors2 =  chartData[0].niepoprawne
      
    return(
        <div className="w-full h-[100vh]">
          <Menu></Menu>
            <h1 className="text-center h-[3vh]"><b>Twoje odpowiedzi</b></h1>
<ScrollArea className="flex flex-col gap-2 h-[55vh] w-full rounded-md border">
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
      <Card className="flex flex-col h-[37vh]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Twoje odpowiedzi</CardTitle>
        <CardDescription>Poprawne odpowiedzi</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors1+" / "+10}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Poprawność
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="poprawne"
              stackId="a"
              cornerRadius={5}
              fill="green"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="niepoprawne"
              fill="red"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
      </div>
    )
}