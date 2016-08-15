import inquirer from 'inquirer'
import baseData from '../data/base'
import transactionData from '../data/transactions.json'
import { removeOld, setNew } from './utils/firebase'
import { greetings, goodbyes } from './config'
import { loadPreviousAnswers, saveAnswers, randomFromList } from './utils'
import { red, magenta } from 'chalk'

const previousAnswers = loadPreviousAnswers()

const questions = [
  {
    type: 'input',
    name: 'firebaseApp',
    message: `What is the Firebase Instance Name?\n ${magenta('NOTE:')} must match service account`,
    default: previousAnswers.firebaseApp || 'top-agent-dev',
    validate: (input) => {
      if (!input) return false
      if (input.match('http') || input.match('firebaseio.com')) {
        return red('Just include the Firebase name, not the entire URL')
      }
      if (!input.match(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/)) {
        return red('Your Firebase name may only contain [a-z], [0-9], and hyphen (-). ' +
          'It may not start or end with a hyphen.')
      }
      return true
    }
  },
  {
    type: 'input',
    name: 'googleId',
    message: 'What Google ID should we be sure to include in listings data?',
    default: previousAnswers.googleId
  }
]

// Greet user
console.log(magenta(randomFromList(greetings))) //eslint-disable-line

inquirer.prompt(questions)
  .then((answers) => {
    return saveAnswers(answers).then(() => {
      const { googleId, firebaseApp } = answers

      if (googleId) {
        // Add the googleId to
        Object.keys(transactionData).forEach((key) => {
          if (Math.random() < 0.5) {
            transactionData[key].uid = googleId
          }
        })
      }

      const newFirebaseData = Object.assign({}, baseData, { transactions: transactionData })
      const firebaseUrl = `https://${firebaseApp}.firebaseio.com`

      removeOld(firebaseUrl)
        .then(() => {
          return setNew(firebaseUrl, newFirebaseData)
            .then(() => {
              console.log(randomFromList(goodbyes)) // eslint-disable-line
              process.exit()
            })
            .catch(() => { return process.exit() })
        })
        .catch(() => { return process.exit() })
    })
  })
