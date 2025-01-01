import Entries from "~/components/entries";

export default async function Home() {
    return (
        <div className="grid grid-cols-3 grid-rows-3 gap-4">
            <Entries />
        </div>
    );
}
