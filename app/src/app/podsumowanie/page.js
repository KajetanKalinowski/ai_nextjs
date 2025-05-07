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
import PocketBase, { ClientResponseError } from 'pocketbase';
import Link from "next/link"
//const pb = new PocketBase('http://172.16.15.138:8080');
const pb = new PocketBase('http://192.168.0.150:8080');
export default function Podsumowania() {
  const [sesjons,setSesjons] = useState(null)
  const [quiz,setQuiz] = useState(null)
   useEffect(()=>{
      const getHis = async()=>{
        try {
           //const data = await fetch('http://172.16.15.138:5678/webhook/history')
          const data = await fetch('http://192.168.0.150:5678/webhook/sesje')
          const json = await data.json()
          console.log(json.items)
          setSesjons(json.items)
          const dane = await fetch('http://192.168.0.150:5678/webhook/history')
          const jotson = await dane.json()
          console.log(jotson.items)
          setQuiz(jotson.items)
        } catch (error) {
          console.log(error)
        }
      }
      getHis()
    },[])
  return (
    <div className="flex flex-col flex-wrap h-screen w-screen rounded-md border">
      {sesjons && sesjons.map((item,idx)=>(
        <Link key={idx} href={'/'} className="w-[50vh]">
        <Card className="h-auto w-[50vh] m-2">
        <CardTitle>Sesja {(item.created).substr(0,16)}</CardTitle>
          <CardContent>
            {item.category}
          </CardContent>
          </Card>
          </Link>
))}
    </div>
  )
}
