"use client";

import { useRef } from "react";

import type { FormEventHandler } from "react";

export default function LoginPanel() {
    const formReference = useRef<HTMLFormElement>(null);

    const sendLoginRequest = async (credentials: FormData) => {
        const response = await fetch("/api/login", {
            body: credentials,
            method: "POST",
        });

        if (response.ok) {
            return;
        }

        // TODO: Replace with dedicated logging solution
        console.error(`Unable to login (${response.status} - ${response.statusText})`);
    };

    const tryLogin: FormEventHandler<HTMLFormElement> = event => {
        const credentials = new FormData(event.currentTarget);

        sendLoginRequest(credentials);
    };

    return (
        <form
            className="box-border flex flex-col gap-2 rounded-lg bg-base-200 p-4 shadow-md"
            onSubmit={tryLogin}
            ref={formReference}
        >
            <span className="pb-1 text-lg font-bold">Login</span>

            {/* TODO: Upon pressing enter, automatically submit for UX */}
            <input className="input input-bordered" name="email" type="email" />
            <input className="input input-bordered" name="password" type="password" />
        </form>
    );
}
