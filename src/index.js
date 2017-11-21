const express = require('express')
const fs = require('fs')
const { exec } = require('child_process')
const randomstring = require('randomstring')

const app = express()

const PORT = 80

const takeImage = () => {
  return new Promise((resolve, reject) => {
    const imgName = randomstring.generate(7)
    exec(`raspistill -o ${imgName}.jpg`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject()
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)

      resolve(imgName)
    })
  })
}

app.get('/', (req, res) => {
  takeImage()
    .then(imageName => {
      const fileToLoad = fs.readFileSync(`../${file}.jpg`)
      console.log(file)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(fileToLoad, 'binary')
    })
    .catch(err => {
      return res.send(`ajjjjajaja ${err}`)
    })
})

app.listen(PORT, () =>
  console.log('Example app listening on port ' + PORT + '!')
)
