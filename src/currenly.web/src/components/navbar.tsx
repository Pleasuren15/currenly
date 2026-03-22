import { Sun, Moon, Info, Palette } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { COLOR_SCHEMES, type ColorSchemeKey } from "@/lib/color-schemes"

const Logo = () => (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Globe circle */}
        <circle cx="16" cy="16" r="12" stroke="white" strokeWidth="2" strokeOpacity="0.25" />
        {/* Horizontal equator */}
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Vertical meridian */}
        <ellipse cx="16" cy="16" rx="5" ry="12" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
        {/* Dollar/currency S stroke */}
        <path
            d="M19 11.5C19 11.5 17.5 10 15.5 10C13.5 10 12 11.2 12 12.8C12 14.4 13.5 15 15.5 15.5C17.5 16 19.5 16.8 19.5 18.8C19.5 20.8 17.8 22 15.8 22C13.8 22 12.5 20.5 12.5 20.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="square"
        />
        {/* Vertical bar through S */}
        <line x1="15.8" y1="8.5" x2="15.8" y2="23.5" stroke="white" strokeWidth="1.5" strokeLinecap="square" strokeOpacity="0.6" />
    </svg>
)

const Navbar = () => {
    const { theme, setTheme, colorScheme, setColorScheme } = useTheme()
    const isLightMode = theme === "light"

    return (
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-hero-from to-hero-to">
            <div className="mx-auto flex h-11 w-full items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Logo />
                    <div>
                        <h1 className="text-base font-extrabold tracking-tight text-white">
                            Currenly
                        </h1>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-white/60 -mt-0.5">currency converter</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Dialog>
                        <DialogTrigger render={<button className="flex size-7 items-center justify-center cursor-pointer text-white/70 transition-colors hover:text-white hover:bg-white/10" />}>
                            <Info size={16} />
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
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex size-7 items-center justify-center cursor-pointer text-white/70 transition-colors hover:text-white hover:bg-white/10">
                            <Palette size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[140px]">
                            <DropdownMenuGroup>
                                {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
                                    <DropdownMenuItem
                                        key={key}
                                        onClick={() => setColorScheme(key as ColorSchemeKey)}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span
                                            className="inline-block size-3 ring-1 ring-foreground/15"
                                            style={{ background: scheme.swatch }}
                                        />
                                        <span className="text-xs">{scheme.label}</span>
                                        {colorScheme === key && (
                                            <span className="ml-auto text-[10px] text-primary font-semibold">*</span>
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <button
                        className="flex size-7 items-center justify-center cursor-pointer text-white/70 transition-colors hover:text-white hover:bg-white/10"
                        onClick={() => setTheme(isLightMode ? "dark" : "light")}
                    >
                        {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
