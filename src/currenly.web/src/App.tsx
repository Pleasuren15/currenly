import { useState } from "react"
import { Github } from "lucide-react"
import CurrencyGraphy from "./components/currencygraphy"
import CurrencyConversion from "./components/currenyconversion"
import Navbar from "./components/navbar"

export function App() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZAR")

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Navbar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <CurrencyConversion
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          onFromCurrencyChange={setFromCurrency}
          onToCurrencyChange={setToCurrency}
        />
        <CurrencyGraphy fromCurrency={fromCurrency} toCurrency={toCurrency} />
      </main>
      <footer className="flex items-center gap-3 border-t border-border/50 px-4 py-1.5 text-[10px] text-muted-foreground/70">
        <span>&copy; {new Date().getFullYear()} <span className="font-semibold text-muted-foreground">pleasure<span className="text-primary">devs</span></span></span>
        <span className="text-border">|</span>
        <a href="https://github.com/pleasuredevs/currenly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 transition-colors hover:text-foreground">
          <Github size={10} />
          <span>GitHub</span>
        </a>
      </footer>
    </div>
  )
}

export default App
