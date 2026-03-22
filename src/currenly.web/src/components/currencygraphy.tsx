"use client"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"



const dateOptions = [
    { value: 1, display: "1D" },
    { value: 10, display: "20D" },
    { value: 90, display: "3M" },
    { value: 180, display: "6M" },
    { value: 365, display: "1Y" },
    { value: 1825, display: "5Y" },
]

const CurrencyGraphy = () => {
    return (
        <div className="px-6">
            <Tabs defaultValue={dateOptions[0].display} className="w-full py-4">
                <TabsList className="w-full">
                    {dateOptions.map(option => (
                        <TabsTrigger key={option.value} value={option.display}>{option.display}</TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={dateOptions[0].display}>
                    <p>Content for {dateOptions[0].display}</p>
                </TabsContent>
            </Tabs >
        </div>
    )
};

export default CurrencyGraphy
