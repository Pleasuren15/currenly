import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const isLightMode = theme === "light"

    return (
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6 border-b border-blue-500">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                    <span className="text-blue-500">Curr</span>enly
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">your currency converter</p>
            </div>
            <button className="relative size-5" onClick={() => setTheme(isLightMode ? "dark" : "light")}>
                <Sun size={20} className={`absolute inset-0 transition-all duration-300 ${isLightMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
                <Moon size={20} className={`absolute inset-0 transition-all duration-300 ${isLightMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
            </button>
        </div>
    )
}

export default Navbar;
