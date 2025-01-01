"use client";

import { useEffect, useRef, useState } from "react";

import PlusIcon from "~/components/plus-icon";
import TagSelector from "~/components/tag-selector";
import useStore from "~/hooks/use-store";

import type { Entry, Tag } from "~/shared/types";
import type { FormEventHandler, MouseEventHandler } from "react";

interface Properties {
    tags: Tag[];
}

// eslint-disable-next-line
const AVOID_CLEANUP = () => {};

// TODO: Refactor using DaisyUI modal
export default function EntryCreator(properties: Properties) {
    const MODAL_VISIBLE_CLASS = "bg-black";
    const MODAL_HIDDEN_CLASS = "bg-black/30";
    const modalReference = useRef<HTMLDivElement>(null);
    const creatorReference = useRef<HTMLFormElement>(null);
    const [creating, setCreating] = useState(false);
    const store = useStore("appendEntry");

    const openModal = () => setCreating(true);

    const maybeCloseModal: MouseEventHandler<HTMLDivElement> = event => {
        if (event.target !== modalReference.current) {
            return;
        }

        setCreating(false);
    };

    function formDataToObject<ObjectType extends object>(formData: FormData): ObjectType {
        const object: Record<string, unknown> = {};

        for (const [key, value] of formData.entries()) {
            object[key] = value;
        }

        return object as ObjectType;
    }

    const createEntry: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        const details = formDataToObject(formData);
        // TODO: Use Zod to Validate shape
        const serialisedEntry = details as Entry;

        store.appendEntry(serialisedEntry);
        target.reset();
        setCreating(false);
    };

    useEffect(() => {
        if (!creating && modalReference.current?.classList.contains("hidden")) {
            return;
        }

        modalReference.current?.classList.toggle("hidden");
        modalReference.current?.classList.toggle("pointer-events-none");

        if (creating) {
            modalReference.current?.classList.replace(MODAL_VISIBLE_CLASS, MODAL_HIDDEN_CLASS);
        } else {
            modalReference.current?.classList.replace(MODAL_HIDDEN_CLASS, MODAL_VISIBLE_CLASS);
        }

        return AVOID_CLEANUP;
    }, [creating]);

    return (
        <>
            {/* TODO: Animate hover effect */}
            <div
                className="group box-border flex h-28 items-center justify-center rounded-lg bg-base-200 p-4 shadow-md hover:cursor-pointer hover:shadow-none hover:brightness-90"
                onClick={openModal}
            >
                <PlusIcon />
            </div>

            {/* TODO: Use Daisy UI's modal battery */}
            {/* TODO: Animate visibility */}
            {/* TODO: Find a way to silence linter error */}
            <div
                className={`pointer-events-none fixed left-0 top-0 flex hidden h-dvh w-dvw items-center justify-center ${MODAL_VISIBLE_CLASS}`}
                onClick={maybeCloseModal}
                ref={modalReference}
            >
                <form
                    className="z-10 box-border flex w-80 flex-col gap-2 rounded-lg bg-base-100 p-6 shadow-lg"
                    onSubmit={createEntry}
                    ref={creatorReference}
                >
                    <span className="text-center text-2xl font-bold">Create a Todo Entry...</span>

                    <input
                        className="input input-bordered invalid:input-error"
                        name="title"
                        placeholder="Title"
                        required
                    />
                    <textarea
                        className="textarea textarea-bordered resize-none"
                        name="description"
                        placeholder="Description"
                        rows={3}
                    />
                    <input
                        className="box-border rounded-lg border border-base-content/20 bg-base-100 px-4 py-2 text-neutral-content/70 focus:shadow-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-base-content/20"
                        name="due-date"
                        type="date"
                    />

                    {/* TODO: Add tags using React Select before this submit button */}
                    <TagSelector value={properties.tags} />

                    <input className="btn btn-secondary" type="submit" value="Create entry" />
                </form>
            </div>
        </>
    );
}
