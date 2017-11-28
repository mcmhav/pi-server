const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const randomstring = require('randomstring')
const fetch = require('node-fetch')

const app = express()

const PORT = 5000

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

const showMessage = (msg = 'hello world') => {
  return new Promise((resolve, reject) => {
    exec(
      `python packages/pi-sense/message.py --message="${msg}"`,
      (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          reject(err)
          return
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)

        resolve('image')
      }
    )
  })
}

app.get('/message', (req, res) => {
  const { msg } = req.query
  showMessage(msg)
  return res.send(`showing msg: ${msg}`)
})

const triggerPixelate = () => {
  return new Promise((resolve, reject) => {
    exec(`python packages/pi-sense/pixelate.py`, (err, stdout, stderr) => {
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

app.get('/pixelateImage', (req, res) => {
  triggerPixelate()
  return res.send(`doing image stuff`)
})

const triggerTemp = () => {
  return new Promise((resolve, reject) => {
    exec(`python packages/pi-sense/temperature.py`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err)
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      resolve()
    })
  })
}

app.get('/temp', (req, res) => {
  triggerTemp()
  return res.send(`doing tmp stuff`)
})

const triggerAcc = () => {
  return new Promise((resolve, reject) => {
    exec(`python packages/pi-sense/accelerometer.py`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err)
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      resolve()
    })
  })
}

app.get('/accelerometer', (req, res) => {
  triggerAcc()
  return res.send(`doing tmp stuff`)
})

const btcValue = () => {
  return new Promise((resolve, reject) => {
    fetch('https://api.bitfinex.com/v1/pubticker/btcusd')
      .then(res => {
        return res.json()
      })
      .then(res => {
        resolve(res.mid)
      })
      .catch(err => {
        reject(err)
      })
  })
}

app.get('/btcValue', (req, res) => {
  btcValue()
    .then(value => {
      return res.send(`bct val: ${value}`)
    })
    .catch(err => {
      return res.send(`bct val: ${err}`)
    })
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
