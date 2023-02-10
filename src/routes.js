import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end(JSON.stringify({ error: 'The title and description fields are mandatory' }))
      }

      const currentDate = new Date()

      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: currentDate,
        updated_at: currentDate
      }

      const createdTask = database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(createdTask))
    }
  },
]
