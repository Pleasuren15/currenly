export type ColorSchemeKey = "blue" | "emerald" | "rose" | "amber" | "violet" | "cyan" | "slate"

export type ColorScheme = {
    label: string
    hue: number
    chroma: number
    vividChroma: number
    heroHueOffset: number
    swatch: string
}

export const COLOR_SCHEMES: Record<ColorSchemeKey, ColorScheme> = {
    blue: {
        label: "Blue",
        hue: 250,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -20,
        swatch: "oklch(0.55 0.24 250)",
    },
    emerald: {
        label: "Emerald",
        hue: 160,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -15,
        swatch: "oklch(0.55 0.20 160)",
    },
    rose: {
        label: "Rose",
        hue: 15,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -10,
        swatch: "oklch(0.55 0.22 15)",
    },
    amber: {
        label: "Amber",
        hue: 75,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -15,
        swatch: "oklch(0.55 0.18 75)",
    },
    violet: {
        label: "Violet",
        hue: 300,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -20,
        swatch: "oklch(0.55 0.22 300)",
    },
    cyan: {
        label: "Cyan",
        hue: 200,
        chroma: 1,
        vividChroma: 1,
        heroHueOffset: -15,
        swatch: "oklch(0.55 0.18 200)",
    },
    slate: {
        label: "Slate",
        hue: 250,
        chroma: 0.15,
        vividChroma: 0.25,
        heroHueOffset: -20,
        swatch: "oklch(0.45 0.03 250)",
    },
}

export const SCHEME_KEYS = Object.keys(COLOR_SCHEMES) as ColorSchemeKey[]
export const DEFAULT_SCHEME: ColorSchemeKey = "blue"

function o(l: number, c: number, h: number): string {
    return `oklch(${l} ${c} ${h})`
}

type ThemeVars = Record<string, string>

export function generateLightVars(scheme: ColorScheme): ThemeVars {
    const h = scheme.hue
    const hh = scheme.hue + scheme.heroHueOffset
    const s = scheme.chroma
    const v = scheme.vividChroma

    return {
        "--background": o(0.965, 0.015 * s, h),
        "--foreground": o(0.18, 0.04 * s, h),
        "--card": o(0.985, 0.01 * s, h),
        "--card-foreground": o(0.18, 0.04 * s, h),
        "--popover": o(0.985, 0.01 * s, h),
        "--popover-foreground": o(0.18, 0.04 * s, h),
        "--primary": o(0.55, 0.24 * v, h),
        "--primary-foreground": o(0.98, 0.008 * s, h),
        "--secondary": o(0.93, 0.025 * s, h),
        "--secondary-foreground": o(0.25, 0.04 * s, h),
        "--muted": o(0.94, 0.015 * s, h),
        "--muted-foreground": o(0.48, 0.03 * s, h),
        "--accent": o(0.92, 0.03 * s, h),
        "--accent-foreground": o(0.25, 0.04 * s, h),
        "--border": o(0.88, 0.025 * s, h),
        "--input": o(0.90, 0.02 * s, h),
        "--ring": o(0.55, 0.24 * v, h),
        "--chart-1": o(0.55, 0.22 * v, h),
        "--hero-from": o(0.44, 0.24 * v, h),
        "--hero-to": o(0.48, 0.20 * v, hh),
        "--sidebar": o(0.96, 0.015 * s, h),
        "--sidebar-foreground": o(0.18, 0.04 * s, h),
        "--sidebar-primary": o(0.55, 0.24 * v, h),
        "--sidebar-primary-foreground": o(0.98, 0.008 * s, h),
        "--sidebar-accent": o(0.92, 0.03 * s, h),
        "--sidebar-accent-foreground": o(0.25, 0.04 * s, h),
        "--sidebar-border": o(0.88, 0.025 * s, h),
        "--sidebar-ring": o(0.55, 0.24 * v, h),
    }
}

export function generateDarkVars(scheme: ColorScheme): ThemeVars {
    const h = scheme.hue
    const hh = scheme.hue + scheme.heroHueOffset
    const s = scheme.chroma
    const v = scheme.vividChroma

    return {
        "--background": o(0.15, 0.04 * s, h),
        "--foreground": o(0.92, 0.015 * s, h),
        "--card": o(0.19, 0.05 * s, h),
        "--card-foreground": o(0.92, 0.015 * s, h),
        "--popover": o(0.19, 0.05 * s, h),
        "--popover-foreground": o(0.92, 0.015 * s, h),
        "--primary": o(0.65, 0.22 * v, h),
        "--primary-foreground": o(0.13, 0.04 * s, h),
        "--secondary": o(0.24, 0.05 * s, h),
        "--secondary-foreground": o(0.92, 0.015 * s, h),
        "--muted": o(0.22, 0.035 * s, h),
        "--muted-foreground": o(0.62, 0.04 * s, h),
        "--accent": o(0.24, 0.05 * s, h),
        "--accent-foreground": o(0.92, 0.015 * s, h),
        "--border": o(0.30, 0.04 * s, h),
        "--input": o(0.26, 0.04 * s, h),
        "--ring": o(0.65, 0.22 * v, h),
        "--chart-1": o(0.65, 0.22 * v, h),
        "--hero-from": o(0.38, 0.20 * v, h),
        "--hero-to": o(0.42, 0.16 * v, hh),
        "--sidebar": o(0.19, 0.05 * s, h),
        "--sidebar-foreground": o(0.92, 0.015 * s, h),
        "--sidebar-primary": o(0.65, 0.22 * v, h),
        "--sidebar-primary-foreground": o(0.92, 0.015 * s, h),
        "--sidebar-accent": o(0.24, 0.05 * s, h),
        "--sidebar-accent-foreground": o(0.92, 0.015 * s, h),
        "--sidebar-border": o(0.30, 0.04 * s, h),
        "--sidebar-ring": o(0.65, 0.22 * v, h),
    }
}
