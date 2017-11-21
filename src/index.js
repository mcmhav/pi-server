const express = require('express')
const { exec } = require('child_process')
const randomstring = require('randomstring')

const app = express()

const PORT = 3000

app.get('/', (req, res) => {
  const imgName = randomstring.generate(7)
  exec(`raspistill -o ${imgName}.jpg`, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })

  return res.send('Hello World!')
})

app.listen(PORT, () =>
  console.log('Example app listening on port ' + PORT + '!')
)
