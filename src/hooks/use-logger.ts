import process from "process";

export default function useLogger<Media>() {
    return (...media: Media[]) => {
        if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.log(...media);
        }
    };
}
