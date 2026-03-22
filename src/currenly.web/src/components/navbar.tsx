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
        <div className="mx-auto flex h-16 w-full items-center justify-between px-6 border-b border-primary">
            <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                    <span className="text-primary">Curr</span>enly
                </h1>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">your currency converter</p>
            </div>
            <div className="flex items-center gap-3">
                <Dialog>
                    <DialogTrigger render={<button className="flex items-center justify-center cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />}>
                        <Info size={20} />
                    </DialogTrigger>
                    <DialogContent className="rounded-none">
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
                <button className="flex items-center justify-center cursor-pointer text-muted-foreground transition-colors hover:text-foreground" onClick={() => setTheme(isLightMode ? "dark" : "light")}>
                    {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </div>
    )
}

export default Navbar;
