import fs from 'fs';
export function reportError(errorMessage: string): void {
    console.log("ERROR!", errorMessage)
    fs.appendFile("error.feed.log", `${errorMessage}\n`, () => {})
}
export const randColor = () =>
    Math.floor(Math.random() * 256 * 256 * 256)
        .toString(16)
        .padStart(6, "0")
