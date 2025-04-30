"use client"
import { useEffect,useState } from "react"
import { Car, TrendingUp } from "lucide-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
// const i=0; i<10 ;i++;
export default function Podsumowania() {
  const [history,setHistory] = useState(null)
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
  return (
    <ScrollArea className="flex flex-col gap-2 h-[100vh] w-full rounded-md border">
      {history && history.map((item,idx)=>{
        if(item.sesja==item.sesja){
          
        }
        <Card key={idx}>
        <CardTitle>Sesja {item.category}</CardTitle>
          <CardContent>

          </CardContent>
          </Card>
})}
    </ScrollArea>
  )
}
