import fs from "fs"

// function to load a html file from local storage
export default function loadHtml(path: string, link: string) {
  const html = fs.readFileSync(path, "utf8")

  return html.replace("[link]", link)
} 