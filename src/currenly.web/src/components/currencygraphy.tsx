"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Area, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const dateOptions = [
    { value: 11, display: "10D" },
    { value: 20, display: "20D" },
    { value: 90, display: "3M" },
    { value: 180, display: "6M" },
    { value: 365, display: "1Y" },
]

type ChartDataPoint = {
    date: string
    rate: number
}

type TimeSeriesResponse = {
    amount: number
    base: string
    start_date: string
    end_date: string
    rates: Record<string, Record<string, number>>
}

const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const getDateRange = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)
    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    }
}

type CurrencyGraphyProps = {
    fromCurrency: string
    toCurrency: string
}

const ANIMATION_DURATION = 600

function useAnimatedNumber(target: number, decimals: number) {
    const [display, setDisplay] = useState(target)
    const prevRef = useRef(target)
    const frameRef = useRef<number>(0)

    useEffect(() => {
        const from = prevRef.current
        const to = target
        prevRef.current = target

        if (from === to) return

        const start = performance.now()
        cancelAnimationFrame(frameRef.current)

        const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / ANIMATION_DURATION, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(from + (to - from) * eased)

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate)
            }
        }

        frameRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameRef.current)
    }, [target])

    return display.toFixed(decimals)
}

function AnimatedStat({ value, decimals = 4, prefix = "", suffix = "", className }: {
    value: number
    decimals?: number
    prefix?: string
    suffix?: string
    className?: string
}) {
    const animated = useAnimatedNumber(value, decimals)
    return <span className={className}>{prefix}{animated}{suffix}</span>
}

function FadeIn({ children, changeKey }: { children: React.ReactNode; changeKey: string }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(false)
        const frame = requestAnimationFrame(() => setVisible(true))
        return () => cancelAnimationFrame(frame)
    }, [changeKey])

    return (
        <div
            className="transition-all duration-500 ease-out"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)" }}
        >
            {children}
        </div>
    )
}

function ChartSkeleton() {
    return (
        <div className="h-[280px] w-full flex flex-col justify-end gap-1 px-2 pb-6 pt-4">
            {/* Fake chart bars that shimmer */}
            <div className="flex items-end gap-[3px] h-full">
                {Array.from({ length: 32 }).map((_, i) => {
                    const heights = [45, 52, 48, 60, 55, 65, 58, 70, 62, 75, 68, 72, 78, 74, 80, 76, 82, 85, 78, 88, 82, 90, 85, 88, 92, 86, 94, 90, 88, 92, 86, 90]
                    return (
                        <div
                            key={i}
                            className="skeleton flex-1"
                            style={{
                                height: `${heights[i % heights.length]}%`,
                                animationDelay: `${i * 30}ms`,
                            }}
                        />
                    )
                })}
            </div>
            {/* Fake axis labels */}
            <div className="flex justify-between pt-2">
                <div className="skeleton h-2.5 w-12" />
                <div className="skeleton h-2.5 w-12" />
                <div className="skeleton h-2.5 w-12" />
            </div>
        </div>
    )
}

const CurrencyGraphy = ({ fromCurrency, toCurrency }: CurrencyGraphyProps) => {
    const [selectedTab, setSelectedTab] = useState(dateOptions[0].display)
    const [dateRange, setDateRange] = useState(() => getDateRange(dateOptions[0].value))
    const [chartData, setChartData] = useState<ChartDataPoint[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [changeMode, setChangeMode] = useState<"absolute" | "percent">("absolute")
    const chartConfig = {
        rate: {
            label: toCurrency,
            color: "var(--chart-1)",
        },
    } satisfies ChartConfig

    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true)
            const minDelay = new Promise(r => setTimeout(r, 1000))
            try {
                const url = `https://api.frankfurter.dev/v1/${dateRange.startDate}..${dateRange.endDate}?base=${fromCurrency}&symbols=${toCurrency}`
                const [response] = await Promise.all([
                    fetch(url),
                    minDelay,
                ])
                const data: TimeSeriesResponse = await response.json()

                const points: ChartDataPoint[] = Object.entries(data.rates)
                    .map(([date, rates]) => ({
                        date,
                        rate: rates[toCurrency],
                    }))
                    .sort((a, b) => a.date.localeCompare(b.date))

                setChartData(points)
            } catch (error) {
                console.error("Error fetching time series rates:", error)
                await minDelay
            } finally {
                setIsLoading(false)
            }
        }

        fetchRates()
    }, [dateRange, fromCurrency, toCurrency])

    const stats = useMemo(() => {
        if (chartData.length === 0) return null
        const rates = chartData.map(d => d.rate)
        const open = rates[0]
        const close = rates[rates.length - 1]
        const high = Math.max(...rates)
        const low = Math.min(...rates)
        const average = rates.reduce((sum, r) => sum + r, 0) / rates.length
        const change = close - open
        const changePercent = (change / open) * 100
        return { open, close, high, low, average, change, changePercent }
    }, [chartData])

    const handleTabChange = (value: string) => {
        setSelectedTab(value)
        const selectedOption = dateOptions.find(option => option.display === value)
        if (selectedOption) {
            setDateRange(getDateRange(selectedOption.value))
        }
    }

    const chartKey = `${dateRange.startDate}-${dateRange.endDate}-${fromCurrency}-${toCurrency}`

    return (
        <section className="mx-auto max-w-2xl px-6 py-6">
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <Tabs value={selectedTab} className="w-full" onValueChange={handleTabChange}>
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <h3 className="text-sm font-semibold">{fromCurrency}/{toCurrency} Rate</h3>
                            <TabsList className="h-7 bg-muted/60 p-0.5">
                                {dateOptions.map(option => (
                                    <TabsTrigger key={option.value} value={option.display} className="text-xs px-2.5 py-1 h-6">
                                        {option.display}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <TabsContent value={selectedTab} className="px-4 pt-4 pb-2">
                            {isLoading ? (
                                <ChartSkeleton />
                            ) : (
                                <FadeIn changeKey={chartKey}>
                                    <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                        <LineChart data={chartData} accessibilityLayer>
                                            <defs>
                                                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="var(--color-rate)" stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor="var(--color-rate)" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <YAxis domain={["auto", "auto"]} hide />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                interval="preserveStartEnd"
                                                minTickGap={50}
                                                tickFormatter={(value: string) => {
                                                    const date = new Date(value)
                                                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                                }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent hideLabel />}
                                            />
                                            <Area
                                                dataKey="rate"
                                                type="natural"
                                                fill="url(#rateGradient)"
                                                stroke="none"
                                            />
                                            <Line
                                                dataKey="rate"
                                                type="natural"
                                                stroke="var(--color-rate)"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </FadeIn>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="grid grid-cols-3 gap-2 pt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} size="sm" className="border-l-2 border-l-primary/30">
                            <CardContent className="px-2.5 py-0">
                                <div className="flex items-center justify-between">
                                    <div className="skeleton h-2.5 w-10" />
                                    <div className="skeleton size-3" />
                                </div>
                                <div className="skeleton h-3.5 w-16 mt-1" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : stats && (
                <div className="grid grid-cols-3 gap-2 pt-4 animate-fade-in">
                    {([
                        { label: "Open", num: stats.open, icon: ArrowUpRight, iconColor: undefined as string | undefined },
                        { label: "Close", num: stats.close, icon: ArrowDownRight, iconColor: undefined as string | undefined },
                        { label: "High", num: stats.high, icon: ArrowUp, iconColor: "text-green-600" },
                        { label: "Low", num: stats.low, icon: ArrowDown, iconColor: "text-red-500" },
                        { label: "Average", num: stats.average, icon: TrendingUp, iconColor: undefined as string | undefined },
                    ]).map(({ label, num, icon: Icon, iconColor }) => (
                        <Card key={label} size="sm" className="border-l-2 border-l-primary/30">
                            <CardContent className="px-2.5 py-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-[10px] uppercase tracking-wide">{label}</span>
                                    <Icon className={`size-3 ${iconColor ?? "text-muted-foreground/60"}`} />
                                </div>
                                <div className="text-xs font-semibold tabular-nums mt-0.5">
                                    <AnimatedStat value={num} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Card size="sm" className="border-l-2 border-l-primary/30">
                        <CardContent className="px-2.5 py-0">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => setChangeMode("absolute")}
                                        className={`text-[10px] uppercase tracking-wide cursor-pointer ${changeMode === "absolute" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                                    >
                                        Chg
                                    </button>
                                    <span className="text-muted-foreground text-[10px]">/</span>
                                    <button
                                        onClick={() => setChangeMode("percent")}
                                        className={`text-[10px] uppercase tracking-wide cursor-pointer ${changeMode === "percent" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                                    >
                                        Chg%
                                    </button>
                                </div>
                                {stats.change >= 0
                                    ? <TrendingUp className="size-3 text-green-600" />
                                    : <TrendingDown className="size-3 text-red-500" />
                                }
                            </div>
                            <div className={`inline-block px-1 py-0.5 text-xs font-semibold tabular-nums mt-0.5 ${stats.change >= 0 ? "text-green-600 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
                                {changeMode === "absolute" ? (
                                    <AnimatedStat value={stats.change} prefix={stats.change >= 0 ? "+" : ""} />
                                ) : (
                                    <AnimatedStat value={stats.changePercent} decimals={2} prefix={stats.changePercent >= 0 ? "+" : ""} suffix="%" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </section>
    )
}

export default CurrencyGraphy
