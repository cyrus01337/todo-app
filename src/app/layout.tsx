import "~/styles/globals.css";

import { Inter } from "next/font/google";

import type { Metadata } from "next";

interface Properties {
    children: React.ReactNode;
}

const INTER = Inter({
    subsets: ["latin"],
    display: "swap",
});
export const metadata: Metadata = {
    title: "Todo App",
    description: "Be productive in style",
};

export default async function RootLayout(properties: Properties) {
    // TODO: Add source button in bottom right corner
    return (
        <html className={INTER.className} lang="en">
            <body>
                <nav className="box-border flex w-dvw flex-row items-center justify-between rounded-b-lg px-8 py-6 shadow-lg">
                    {/* TODO: Find fun font */}
                    <span className="text-2xl font-bold text-primary">Todo App</span>
                </nav>

                {/* TODO: Change background to base-200 and other element
                    matching this colour to base-100 */}
                <div className="box-border p-4">{properties.children}</div>
            </body>
        </html>
    );
}
