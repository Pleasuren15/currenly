import { useState } from "react"
import CurrencyGraphy from "./components/currencygraphy"
import CurrencyConversion from "./components/currenyconversion"
import Navbar from "./components/navbar"

export function App() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZAR")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <CurrencyConversion
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          onFromCurrencyChange={setFromCurrency}
          onToCurrencyChange={setToCurrency}
        />
        <CurrencyGraphy fromCurrency={fromCurrency} toCurrency={toCurrency} />
      </main>
      <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Currenly. All rights reserved.
      </footer>
    </div>
  )
}

export default App
