import { Share2, ChevronDownIcon, ArrowLeftRight } from "lucide-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useRef, useState, useCallback } from "react"

type CurrencyMap = Record<string, string>

type RatesResponse = {
    amount: number
    base: string
    date: string
    rates: Record<string, number>
}

type CurrencyConversionProps = {
    fromCurrency: string
    toCurrency: string
    onFromCurrencyChange: (code: string) => void
    onToCurrencyChange: (code: string) => void
}

const CurrencyConversion = ({ fromCurrency, toCurrency, onFromCurrencyChange, onToCurrencyChange }: CurrencyConversionProps) => {
    const [currencies, setCurrencies] = useState<CurrencyMap>({})
    const [rates, setRates] = useState<RatesResponse | null>(null)
    const [fromAmount, setFromAmount] = useState("1")
    const [toAmount, setToAmount] = useState("")
    const [isLoadingRates, setIsLoadingRates] = useState(true)
    const fetchedRef = useRef(false)

    useEffect(() => {
        if (fetchedRef.current) return

        const fetchCurrencies = async () => {
            try {
                const response = await fetch("https://api.frankfurter.dev/v1/currencies")
                const data: CurrencyMap = await response.json()
                setCurrencies(data)
            } catch (error) {
                console.error("Error fetching currencies:", error)
            }
        }

        fetchCurrencies()
        fetchedRef.current = true
    }, [])

    useEffect(() => {
        const fetchRates = async () => {
            setIsLoadingRates(true)
            const minDelay = new Promise(r => setTimeout(r, 1000))
            try {
                const [response] = await Promise.all([
                    fetch(`https://api.frankfurter.dev/v1/latest?base=${fromCurrency}`),
                    minDelay,
                ])
                const data: RatesResponse = await response.json()
                setRates(data)
            } catch (error) {
                console.error("Error fetching rates:", error)
                await minDelay
            } finally {
                setIsLoadingRates(false)
            }
        }

        fetchRates()
    }, [fromCurrency])

    const sendEmail = async () => {
        const subject = `Currency Conversion: ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency}`
        const body = `As of ${rates?.date}, ${fromAmount} ${currencies[fromCurrency] ?? fromCurrency} equals ${toAmount} ${currencies[toCurrency] ?? toCurrency}.\n\nExchange Rate: 1 ${fromCurrency} = ${(rates?.rates[toCurrency] ?? "—")} ${toCurrency}\n\nData provided by Frankfurter API.`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

        try {
            const baseUrl = "https://currenly-dhbzdvfnehgyaqej.southafricanorth-01.azurewebsites.net/";
            const reponse = await fetch(`${baseUrl}/send-email?subject=${encodeURIComponent(subject)}&htmlBody=${encodeURIComponent(body)}`, {
                method: 'POST'
            })
            console.log("Email send response:", reponse)
        }
        catch (error) {
            console.error("Error sharing conversion:", error)
        }
    }

    const convertFromTo = useCallback((amount: string) => {
        const num = parseFloat(amount)
        if (!rates || isNaN(num)) {
            setToAmount("")
            return
        }
        const rate = rates.rates[toCurrency]
        setToAmount(rate !== undefined ? (num * rate).toFixed(2) : "")
    }, [rates, toCurrency])

    const convertToFrom = useCallback((amount: string) => {
        const num = parseFloat(amount)
        if (!rates || isNaN(num)) {
            setFromAmount("")
            return
        }
        const rate = rates.rates[toCurrency]
        setFromAmount(rate !== undefined ? (num / rate).toFixed(2) : "")
    }, [rates, toCurrency])

    useEffect(() => {
        convertFromTo(fromAmount)
    }, [rates, toCurrency, convertFromTo])

    const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFromAmount(value)
        convertFromTo(value)
    }

    const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setToAmount(value)
        convertToFrom(value)
    }

    const handleFromChange = (code: string) => {
        if (code === toCurrency) onToCurrencyChange(fromCurrency)
        onFromCurrencyChange(code)
    }

    const handleToChange = (code: string) => {
        if (code === fromCurrency) onFromCurrencyChange(toCurrency)
        onToCurrencyChange(code)
    }

    const handleSwap = () => {
        onFromCurrencyChange(toCurrency)
        onToCurrencyChange(fromCurrency)
    }

    return (
        <section className="bg-gradient-to-br from-hero-from to-hero-to px-4 py-4 text-white">
            <div className="mx-auto max-w-2xl">
                <p className="text-xs text-white/70">{fromAmount || "1"} {currencies[fromCurrency] ?? fromCurrency} equals</p>
                <div className="flex items-baseline justify-between gap-4 mt-0.5">
                    {isLoadingRates ? (
                        <div className="flex items-baseline gap-3">
                            <div className="skeleton-hero h-8 w-44" />
                            <div className="skeleton-hero h-6 w-10" />
                        </div>
                    ) : (
                        <h2 className="text-2xl font-bold tabular-nums tracking-tight animate-fade-in">
                            {toAmount || "—"} <span className="text-white/80 font-medium">{toCurrency}</span>
                        </h2>
                    )}
                    <button className="flex items-center gap-1.5 text-[10px] text-white/50 cursor-pointer hover:text-white/80 transition-colors" onClick={sendEmail}>
                        <Share2 size={12} />
                        share
                    </button>
                </div>
                {isLoadingRates ? (
                    <div className="skeleton-hero h-2.5 w-48 mt-1.5" />
                ) : (
                    <p className="text-[10px] text-white/50 mt-0.5 animate-fade-in">
                        {currencies[toCurrency] ?? toCurrency} &middot; {rates?.date ?? "—"} &middot;{" "}
                        <a target="_blank" className="underline underline-offset-2 hover:text-white/80" href="https://frankfurter.dev/">Frankfurter</a>
                    </p>
                )}

                <div className="mt-3 flex items-center gap-2">
                    <InputGroup className="flex-1 border-white/20 bg-white/10 shadow-none ring-0">
                        <InputGroupInput
                            placeholder="Amount"
                            type="number"
                            value={fromAmount}
                            onChange={handleFromAmountChange}
                            className="text-white placeholder:text-white/40"
                        />
                        <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 px-3 py-1.5 pr-1.5 text-xs font-semibold text-white/90">
                                    {fromCurrency}
                                    <ChevronDownIcon className="size-3" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        {Object.entries(currencies).map(([code]) => (
                                            <DropdownMenuItem key={code} onClick={() => handleFromChange(code)}>
                                                {code}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </InputGroupAddon>
                    </InputGroup>
                    <button
                        onClick={handleSwap}
                        className="flex shrink-0 size-8 items-center justify-center bg-white/10 cursor-pointer text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                    >
                        <ArrowLeftRight size={16} />
                    </button>
                    <InputGroup className="flex-1 border-white/20 bg-white/10 shadow-none ring-0">
                        <InputGroupInput
                            placeholder="Amount"
                            type="number"
                            value={toAmount}
                            onChange={handleToAmountChange}
                            className="text-white placeholder:text-white/40"
                        />
                        <InputGroupAddon align="inline-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 px-3 py-1.5 pr-1.5 text-xs font-semibold text-white/90">
                                    {toCurrency}
                                    <ChevronDownIcon className="size-3" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        {Object.entries(currencies).map(([code]) => (
                                            <DropdownMenuItem key={code} onClick={() => handleToChange(code)}>
                                                {code}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>
        </section>
    )
}

export default CurrencyConversion;
