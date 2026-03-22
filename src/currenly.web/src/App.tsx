import CurrencyGraphy from "./components/currencygraphy"
import CurrencyConversion from "./components/currenyconversion"
import Navbar from "./components/navbar"

export function App() {
  return (
    <div>
      <Navbar />
      <CurrencyConversion />
      <CurrencyGraphy />
    </div>
  )
}

export default App
