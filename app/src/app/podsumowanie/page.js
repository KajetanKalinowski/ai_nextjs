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
  const [html,setHtml] = useState(0)
  const [css,setCss] = useState(0)
  const [c,setC] = useState(0)
  const [javascript,setjavascript] = useState(0)
  const [php,setPhp] = useState(0)
  const [python,setPython] = useState(0)
  const [c1,setC1] = useState(0)
  const [c2,setC2] = useState(0)
  const [user,setUser] = useState(pb.authStore.record)
  if(!user){
    window.location.href="/logowanie"
  }
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
          //licz()
          const records = await pb.collection('Sesje').getFullList({
              filter: 'category="PHP"',
          });
          setPhp(records.length)
          const records1 = await pb.collection('Sesje').getFullList({
              filter: 'category="JavaScript"',
          });
          setjavascript(records1.length)
          const records2 = await pb.collection('Sesje').getFullList({
              filter: 'category="HTML"',
          });
          setHtml(records2.length)
          const records3 = await pb.collection('Sesje').getFullList({
              filter: 'category="CSS"',
          });
          setCss(records3.length)
          const records4 = await pb.collection('Sesje').getFullList({
              filter: 'category="Python"',
          });
          setPython(records4.length)
          const records5 = await pb.collection('Sesje').getFullList({
              filter: 'category="C"',
          });
          setC(records5.length)
          const records6 = await pb.collection('Sesje').getFullList({
              filter: 'category="C++"',
          });
          setC1(records6.length)
          const records7 = await pb.collection('Sesje').getFullList({
              filter: 'category="C#"',
          });
          setC2(records7.length)
        } catch (error) {
          console.log(error)
        }
      }
      getHis()
    },[])
    const chartData = [
      { month: "HTML", sesje: html },
      { month: "CSS", sesje: css },
      { month: "JavaScript", sesje: javascript },
      { month: "Python", sesje: python },
      { month: "C", sesje: c },
      { month: "C++", sesje: c1 },
      { month: "C#", sesje: c2 },
      { month: "PHP", sesje: php },
    ]
    const chartConfig = {
      sesje: {
        label: "Sesje",
        color: "hsl(var(--chart-1))",
      },
    }
    // const licz = ()=>{
    //   sesjons && sesjons.map((item)=>(
    //     (item.category=="PHP"?setPhp(php+1):(item.category=="HTML"?setHtml(html+1):(item.category=="CSS"?setCss(css+1):(item.category=="JavaScript"?setjavascript(javascript+1):(item.category=="Python"?setPython(python+1):(item.category=="C"?setC(c+1):(item.category=="C++"?setC1(c1+1):(item.category=="C#"?setC2(c2+1):null))))))))
    //   ))
    //   console.log(php)
    // }
  return (
    <>
        <Menu></Menu>
    <div className="flex flex-row h-[95vh] w-[100%]">
    <div className="flex flex-col flex-wrap h-[95vh] w-[50%] rounded-md border">
      {sesjons && sesjons.map((item,idx)=>(
        <Link key={idx} href={`/${item.nrsesji}`} className="w-[50vh]">
        <Card className="h-auto w-[50vh] m-2">
        <CardTitle className="m-2">Sesja {(item.sesja).substr(4,21)}</CardTitle>
          <CardContent className="text-orange-400 text-right">
            {item.category}
          </CardContent>
          </Card>
          </Link>
))}
    </div>
    <Card className="w-[50%] h-[95vh]">
      <CardHeader className="items-center">
        <CardTitle>Twoje tematy</CardTitle>
        <CardDescription>
          Najczęściej wybierane przez ciebie tematy Quizów
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
              fill="orange"
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
    </div>
    </>
  )
}
