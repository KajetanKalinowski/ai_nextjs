"use client"
import { useEffect,useState } from "react"
import { Car, TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis, 
  Radar, 
  RadarChart,
} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import PocketBase, { ClientResponseError } from 'pocketbase';
import Link from "next/link"
import Menu from "@/components/ui/menu"
const pb = new PocketBase('http://172.16.15.138:8080');
//const pb = new PocketBase('http://192.168.0.150:8080');
export default function Podsumowania() {
  const [sesjons,setSesjons] = useState(null)
  const [quiz,setQuiz] = useState(null)
   useEffect(()=>{
      const getHis = async()=>{
        try {
           const data = await fetch('http://172.16.15.138:5678/webhook/sesje')
          //const data = await fetch('http://192.168.0.150:5678/webhook/sesje')
          const json = await data.json()
          console.log(json.items)
          setSesjons(json.items)
          //const dane = await fetch('http://192.168.0.150:5678/webhook/history')
          const dane = await fetch('http://172.16.15.138:5678/webhook/history')
          const jotson = await dane.json()
          console.log(jotson.items)
          setQuiz(jotson.items)
        } catch (error) {
          console.log(error)
        }
      }
      getHis()
    },[])
    const chartData = [
      { month: "HTML", sesje: 186 },
      { month: "CSS", sesje: 305 },
      { month: "JavaScript", sesje: 237 },
      { month: "Python", sesje: 273 },
      { month: "C", sesje: 209 },
      { month: "C++", sesje: 214 },
      { month: "C#", sesje: 214 },
      { month: "PHP", sesje: 214 },
    ]
    const chartConfig = {
      sesje: {
        label: "Sesje",
        color: "hsl(var(--chart-1))",
      },
    }
  return (
    <>
    <Menu></Menu>
    <div className="flex flex-col flex-wrap h-[95vh] w-[50%] rounded-md border">
      {sesjons && sesjons.map((item,idx)=>(
        <Link key={idx} href={`/${item.nrsesji}`} className="w-[50vh]">
        <Card className="h-auto w-[50vh] m-2">
        <CardTitle>Sesja {(item.created).substr(0,16)}</CardTitle>
          <CardContent>
            {item.category}
          </CardContent>
          </Card>
          </Link>
))}
    </div>
    <Card className="w-[50%] h-[95vh]">
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Dots</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="sesje"
              fill="blue"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
    </>
  )
}
