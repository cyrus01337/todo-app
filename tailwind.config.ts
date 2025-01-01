import tailwindCSSTypography from "@tailwindcss/typography";
import daisyUI from "daisyui";

import type { Config } from "tailwindcss";

export default {
    content: ["src/**/*.tsx"],
    daisyui: {
        logs: false,
        themes: ["dracula"],
        darkTheme: "dracula",
    },
    plugins: [tailwindCSSTypography, daisyUI],
} satisfies Config;
