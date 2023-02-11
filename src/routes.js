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

      const tasks = database.select('tasks', search && {
        title: search,
        description: search
      })

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'The resource with the provided id was not found' }))
      }

      return res.writeHead(200).end(JSON.stringify(task))
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
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res.writeHead(400).end(JSON.stringify({ error: 'At least one field from title and description fields is mandatory' }))
      }

      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'The resource with the provided id was not found' }))
      }

      const updatedFields = {
        updated_at: new Date()
      }
      if (title) updatedFields['title'] = title
      if (description) updatedFields['description'] = description

      const updatedTask = database.update('tasks', id, updatedFields)

      return res.writeHead(200).end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)
      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'The resource with the provided id was not found' }))
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
]
