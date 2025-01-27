import { useEffect, useRef } from "react";

import useStore from "~/hooks/use-store";

import type { Dispatch, MouseEventHandler, SetStateAction } from "react";

interface Properties {
    deletingEntryID?: number;

    setDeletingEntryID: Dispatch<SetStateAction<number>>;
}

const NO_ENTRY_TO_DELETE = -1;

// eslint-disable-next-line
const AVOID_CLEANUP = () => {};

// TODO: Refactor using DaisyUI modal
export default function EntryDeletionConfirmation({
    deletingEntryID = NO_ENTRY_TO_DELETE,
    ...properties
}: Properties) {
    const MODAL_VISIBLE_CLASS = "bg-black";
    const MODAL_HIDDEN_CLASS = "bg-black/30";
    const modalReference = useRef<HTMLDivElement>(null);
    const cancelButtonReference = useRef<HTMLButtonElement>(null);
    const store = useStore("setEntries", "entries");

    const maybeCloseModal: MouseEventHandler<HTMLDivElement> = event => {
        if (
            event.target !== modalReference.current &&
            event.target !== cancelButtonReference.current
        ) {
            return;
        }

        properties.setDeletingEntryID(NO_ENTRY_TO_DELETE);
    };

    const deleteEntry: MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault();

        if (!store.entries) {
            return;
        }

        store.setEntries(store.entries.filter((_, index) => index !== deletingEntryID));
        properties.setDeletingEntryID(NO_ENTRY_TO_DELETE);
    };

    useEffect(() => {
        if (deletingEntryID === -1 && modalReference.current?.classList.contains("hidden")) {
            return;
        }

        modalReference.current?.classList.toggle("hidden");
        modalReference.current?.classList.toggle("pointer-events-none");

        if (deletingEntryID !== NO_ENTRY_TO_DELETE) {
            modalReference.current?.classList.replace(MODAL_VISIBLE_CLASS, MODAL_HIDDEN_CLASS);
        } else {
            modalReference.current?.classList.replace(MODAL_HIDDEN_CLASS, MODAL_VISIBLE_CLASS);
        }

        return AVOID_CLEANUP;
    }, [deletingEntryID]);

    // TODO: Animate hover effect
    return deletingEntryID !== NO_ENTRY_TO_DELETE ? (
        <div
            className={`pointer-events-none fixed left-0 top-0 flex hidden h-dvh w-dvw items-center justify-center ${MODAL_HIDDEN_CLASS}`}
            onClick={maybeCloseModal}
            ref={modalReference}
        >
            <div className="z-10 box-border flex w-80 flex-col gap-2 rounded-lg bg-base-100 p-6 shadow-lg">
                <span className="text-center font-bold">
                    Are you sure you want to delete this entry?
                </span>

                <div className="flex flex-row justify-between">
                    <button className="btn btn-success" onClick={deleteEntry}>
                        Confirm
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={maybeCloseModal as unknown as MouseEventHandler<HTMLButtonElement>}
                        ref={cancelButtonReference}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    ) : null;
}
