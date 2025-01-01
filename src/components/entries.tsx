"use client";

import { MouseEventHandler, useEffect, useState } from "react";

import EntryCreator from "~/components/entry-creator";
import EntryDeletionConfirmation from "~/components/entry-deletion-confirmation";
import TrashIcon from "~/components/trash-icon";
import useStore from "~/hooks/use-store";

// eslint-disable-next-line
const AVOID_CLEANUP = () => {};

export default function Entries() {
    const store = useStore("entries", "initialiseEntries");
    const [deletingEntryID, setDeletingEntryID] = useState(-1);
    let tags: string[] = [];

    if (store.entries && tags.length === 0) {
        tags = store.entries.flatMap(entry => entry.tags);
    }

    useEffect(() => {
        if (!store.entries) {
            store.initialiseEntries();
        }

        return AVOID_CLEANUP;
    }, []);

    console.log(deletingEntryID);

    // TODO: Add skeleton when no entries are present
    return (
        <>
            {store.entries?.map((entry, id) => (
                // TODO: Add IDs to entries on the API level to remove
                // workaround
                <div
                    className="box-border flex h-28 flex-col rounded-lg bg-base-200 p-4 shadow-md"
                    key={`entry-${id}`}
                >
                    <div className="flex flex-row items-center justify-between">
                        <span className="line-clamp-1 overflow-ellipsis text-lg font-bold">
                            {entry.title}
                        </span>

                        <TrashIcon
                            className="text-error hover:cursor-pointer"
                            onClick={() => setDeletingEntryID(id)}
                        />
                    </div>

                    {/* TODO: Add relative, human readable format */}
                    {/* TODO: On hover, show full date */}
                    {/* TODO: Colour code based on impending time, i.e. orange/yellow when 1w away, red when passed, green when completed */}
                    {/* TODO: Make colour-coding configurable */}
                    <div className="flex flex-row gap-2 pb-3">
                        {/* TODO: Support tags */}
                        {/* TODO: Make colour-coding configurable */}
                        {entry.tags?.map(name => (
                            <span
                                className="badge badge-info badge-outline select-none"
                                key={`tag-${name}`}
                            >
                                {name}
                            </span>
                        ))}
                    </div>

                    <p className="line-clamp-2 overflow-ellipsis text-neutral-content">
                        {entry.description}
                    </p>
                </div>
            ))}

            {store.entries ? <EntryCreator tags={tags} /> : null}

            <EntryDeletionConfirmation
                deletingEntryID={deletingEntryID}
                setDeletingEntryID={setDeletingEntryID}
            />
        </>
    );
}
