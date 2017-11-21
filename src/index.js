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
  try {
    const imageName = await takeImage();

    const fileToLoad = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type':  contentType });
    res.end(fileToLoad, 'binary');
  } catch (e) {
    return res.send('ajjajj')
  }
})

app.listen(PORT, () =>
  console.log('Example app listening on port ' + PORT + '!')
)