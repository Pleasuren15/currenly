import { Sun, Moon, Info } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const isLightMode = theme === "light"

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-hero-from to-hero-to">
            <div className="mx-auto flex h-14 w-full items-center justify-between px-6">
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-white">
                        Currenly
                    </h1>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">currency converter</p>
                </div>
                <div className="flex items-center gap-1">
                    <Dialog>
                        <DialogTrigger render={<button className="flex size-8 items-center justify-center cursor-pointer text-white/70 transition-colors hover:text-white hover:bg-white/10" />}>
                            <Info size={18} />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">
                                    <span className="text-primary">Curr</span>enly
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3 text-sm text-muted-foreground">
                                <p>A simple, fast currency converter that lets you check live exchange rates and view historical trends across multiple currencies.</p>
                                <p>Exchange rate data is provided by{" "}
                                    <a href="https://frankfurter.dev/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                                        Frankfurter API
                                    </a>
                                    , an open-source API built on top of data published by the European Central Bank.
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <button
                        className="flex size-8 items-center justify-center cursor-pointer text-white/70 transition-colors hover:text-white hover:bg-white/10"
                        onClick={() => setTheme(isLightMode ? "dark" : "light")}
                    >
                        {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
