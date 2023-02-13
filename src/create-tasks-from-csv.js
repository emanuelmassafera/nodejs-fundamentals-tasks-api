import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('../tasks.csv', import.meta.url)

async function createTasksFromCSV() {
  const parser = fs.createReadStream(csvPath)
    .pipe(parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2
    }))

  for await (const record of parser) {
    try {
      const [title, description] = record

      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title: title,
          description: description
        }),
      })

      console.log(await response.json())
    } catch (error) {
      console.error(error)
    }
  }
}

createTasksFromCSV()
