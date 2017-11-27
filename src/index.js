const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const randomstring = require('randomstring')

const app = express()

const PORT = 80

const takeImage = () => {
  return new Promise((resolve, reject) => {
    const imgName = randomstring.generate(7)
    // exec(`raspistill -o ${imgName}.jpg`, (err, stdout, stderr) => {

    exec(`./scripts/rollTheDice.sh`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err)
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      resolve('image')
    })
  })
}

const showMessage = () => {
  return new Promise((resolve, reject) => {
    exec(`python packages/pi-sense/message.py`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err)
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      resolve('image')
    })
  })
}

app.get('/message', (req, res) => {
  showMessage()
})

app.get('/', (req, res) => {
  takeImage()
    .then(imgName => {
      console.log(`./${imgName}.jpg`)
      // const fileToLoad = fs.readFileSync(`./${imgName}.jpg`)
      const fileToLoad = fs.readFileSync(`./packages/pi-sense/${imgName}.jpg`)
      res.writeHead(200, { 'Content-Type': 'image/jpg' })
      res.end(fileToLoad, 'binary')
    })
    .catch(err => {
      return res.send(`ajjjjajaja ${err}`)
    })
})

app.listen(PORT, () =>
  console.log('Example app listening on port ' + PORT + '!')
)
