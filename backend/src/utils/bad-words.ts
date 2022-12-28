import fs from "fs"
export const watchListInit = (fileName: string) => {
    if (
        !fs.existsSync(fileName) ||
        !fs.readFileSync(fileName).toString().length
    ) {
        fs.appendFileSync(fileName, `fuck`)
    }
    buildPattern(fileName)
}

export let pattern = new RegExp("", "i")

export const buildPattern = (fileName: string) => {
    pattern = new RegExp(fs.readFileSync(fileName).toString(), "i")
}
export const addToWatchList = (fileName: string, words: Array<string>) => {
    for (const word of words) {
        if (!pattern.test(word)) fs.appendFileSync(fileName, `|${word}`)
    }
    buildPattern(fileName)
}
