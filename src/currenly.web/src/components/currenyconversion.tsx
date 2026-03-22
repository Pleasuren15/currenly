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
            try {
                const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${fromCurrency}`)
                const data: RatesResponse = await response.json()
                setRates(data)
            } catch (error) {
                console.error("Error fetching rates:", error)
            }
        }

        fetchRates()
    }, [fromCurrency])

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
        <div>
            <div className="mx-auto px-6 py-4">
                <div className="mx-auto flex w-full items-center justify-between">
                    <p className="text-sm">{fromAmount || "1"} {currencies[fromCurrency] ?? fromCurrency} equals</p>
                    <button className="flex items-center gap-1.5 text-sm text-primary cursor-pointer">
                        <Share2 size={16} />
                        share
                    </button>
                </div>
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl">{toAmount || "—"} {currencies[toCurrency] ?? toCurrency} ({toCurrency})</h1>
                </div>
                <p className="text-xs">{rates?.date ?? "—"} <a target="_blank" className="text-primary font-bold" href="https://frankfurter.dev/">Frankfurter API</a></p>
            </div>

            <div className="mx-auto flex items-center gap-2 px-6">
                <InputGroup className="flex-1 border-none shadow-none rounded-none ring-0">
                    <InputGroupInput placeholder="Amount" type="number" value={fromAmount} onChange={handleFromAmountChange} />
                    <InputGroupAddon align="inline-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 px-3 py-1.5 pr-1.5 text-xs">
                                {fromCurrency}
                                <ChevronDownIcon className="size-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
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
                    className="flex shrink-0 items-center justify-center cursor-pointer text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeftRight size={18} />
                </button>
                <InputGroup className="flex-1 border-none shadow-none rounded-none ring-0">
                    <InputGroupInput placeholder="Amount" type="number" value={toAmount} onChange={handleToAmountChange} />
                    <InputGroupAddon align="inline-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 px-3 py-1.5 pr-1.5 text-xs">
                                {toCurrency}
                                <ChevronDownIcon className="size-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="[--radius:0.95rem]">
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
    )
}

export default CurrencyConversion;
