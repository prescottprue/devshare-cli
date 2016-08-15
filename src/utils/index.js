import fs from 'fs'
import { paths } from '../config'

export const randomFromList = (list) => {
  return list[Math.floor(Math.random() * list.length)]
}

let previousAnswers

export const loadPreviousAnswers = () => {
  // Attempt to load previous answers
  try {
    previousAnswers = require(`${paths.previousAnswers}`) // eslint-disable-line
  } catch (e) {
    previousAnswers = {}
  }
  return previousAnswers
}

export const saveAnswers = (answers) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(paths.previousAnswers, JSON.stringify(answers, 0, 2), (err) => {
      return err ? reject(err) : resolve(answers)
    })
  })
}

export const checkForServiceAccount = () => {
  return fs.existsSync(paths.serviceAccount)
}

export default { randomFromList, saveAnswers, loadPreviousAnswers }
