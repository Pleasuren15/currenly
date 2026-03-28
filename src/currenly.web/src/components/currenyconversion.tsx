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
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
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
        setEmailStatus('sending')
        const subject = `Currency Conversion: ${fromAmount} ${fromCurrency} to ${toAmount} ${toCurrency}`
        const body = `As of ${rates?.date}, ${fromAmount} ${currencies[fromCurrency] ?? fromCurrency} equals ${toAmount} ${currencies[toCurrency] ?? toCurrency}.\n\nExchange Rate: 1 ${fromCurrency} = ${(rates?.rates[toCurrency] ?? "—")} ${toCurrency}\n\nData provided by Frankfurter API.`

        try {
            const baseUrl = "https://currenly-dhbzdvfnehgyaqej.southafricanorth-01.azurewebsites.net";
            const response = await fetch(`${baseUrl}/send-email?subject=${encodeURIComponent(subject)}&htmlBody=${encodeURIComponent(body)}`, {
                method: 'POST'
            })
            
            if (response.ok) {
                setEmailStatus('success')
                setToastMessage('Email sent successfully! 📧')
                setShowToast(true)
                console.log("Email sent successfully:", response)
            } else {
                setEmailStatus('error')
                setToastMessage('Failed to send email. Please try again.')
                setShowToast(true)
                console.error("Email send failed:", response.statusText)
            }
        }
        catch (error) {
            setEmailStatus('error')
            setToastMessage('Email send failed. Check your connection.')
            setShowToast(true)
            console.error("Error sharing conversion:", error)
        }

        // Reset status after 3 seconds
        setTimeout(() => {
            setEmailStatus('idle')
            setShowToast(false)
        }, 3000)
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
        <section className="bg-gradient-to-br from-hero-from to-hero-to px-4 py-4 text-white relative">
            {/* Toast Notification */}
            {showToast && (
                <div 
                    className={`absolute top-2 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
                        emailStatus === 'success' 
                            ? 'bg-green-500/90 text-white' 
                            : 'bg-red-500/90 text-white'
                    } animate-fade-in`}
                >
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {emailStatus === 'success' ? (
                            <span className="text-lg">✅</span>
                        ) : (
                            <span className="text-lg">❌</span>
                        )}
                        {toastMessage}
                    </div>
                </div>
            )}
            
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
                    <button 
                        className={`flex items-center gap-1.5 text-[10px] cursor-pointer transition-colors ${
                            emailStatus === 'sending' 
                                ? 'text-white/70 cursor-wait' 
                                : emailStatus === 'success'
                                ? 'text-green-400 hover:text-green-300'
                                : emailStatus === 'error'
                                ? 'text-red-400 hover:text-red-300'
                                : 'text-white/50 hover:text-white/80'
                        }`} 
                        onClick={sendEmail}
                        disabled={emailStatus === 'sending'}
                    >
                        {emailStatus === 'sending' ? (
                            <>
                                <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />
                                sending...
                            </>
                        ) : emailStatus === 'success' ? (
                            <>
                                <span className="text-xs">✓</span>
                                sent
                            </>
                        ) : emailStatus === 'error' ? (
                            <>
                                <span className="text-xs">✗</span>
                                failed
                            </>
                        ) : (
                            <>
                                <Share2 size={12} />
                                share
                            </>
                        )}
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
