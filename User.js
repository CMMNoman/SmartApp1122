const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const connectDB = require('./DBConnection')
const common = require('./common')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/Register', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { First_Name, Last_Name, Email, Password, Role } = req.body
      var requiredFields = ''
      if (First_Name === undefined || First_Name === '') {
        requiredFields += 'First Name, '
      } if (Last_Name === undefined || Last_Name === '') {
        requiredFields += 'Last Name, '
      } if (Email === undefined || Email === '') {
        requiredFields += 'Email, '
      } if (Password === undefined || Password === '') {
        requiredFields += 'Password, '
      } if (Role === undefined || Role === '') {
        requiredFields += 'Role, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.query(`SELECT * FROM USER WHERE Email =  '${Email}'`, (error, result, fields) => {
          if (error) {
            response.destroy()
            res.status(400).send({ error: error })
          } else if (result && result.length > 0) {
            response.destroy()
            res.send({ message: 'Already Registered' })
          } else {
            const uid = common.getUUIDv4()
            response.query(`INSERT INTO USER (ID, First_Name, Last_Name, Email, Password, Role) VALUES ('${uid}', '${First_Name}', '${Last_Name}', '${Email}', '${Password}', '${Role}')`,
              (error, result, fields) => {
                if (error) {
                  response.destroy()
                  res.status(400).send({ error: error })
                } else {
                  response.destroy()
                  res.send({ message: 'Account Created Successfully', uid: uid })
                }
              })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/Login/:Email/:Password', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { Email, Password, Role } = req.params
      var requiredFields = ''
      if (Email === undefined || Email === '') {
        requiredFields += 'Email, '
      } if (Password === undefined || Password === '') {
        requiredFields += 'Password, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.query(`SELECT * FROM USER WHERE Email = '${Email}'`, (error, result, fields) => {
          if (error) {
            response.destroy()
            res.status(400).send({ error: error })
          } else {
            if (result && result.length > 0) {
              response.query(`SELECT * FROM USER WHERE Email = '${Email}' AND Password = '${Password}'`, (error, result, fields) => {
                if (error) {
                  response.destroy()
                  res.status(400).send({ error: error })
                } else {
                  if (result && result.length > 0) {
                    response.destroy()
                    res.send({ uid: result[0].ID, role: result[0].Role })
                  } else {
                    response.destroy()
                    res.send({ message: 'Incorrect Password' })
                  }
                }
              })
            } else {
              response.destroy()
              res.send({ message: 'User Doesn`t Exists' })
            }
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetUserByID/:ID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID } = req.params
      var requiredFields = ''
      if (ID === undefined || ID === '') {
        requiredFields += 'ID, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.query(`SELECT * FROM USER WHERE ID = '${ID}'`, (error, result, fields) => {
          if (error) {
            response.destroy()
            res.status(400).send({ error: error })
          } else {
            if (result && result.length > 0) {
              response.destroy()
              res.send(result[0])
            } else {
              response.destroy()
              res.send({ message: 'No Record(s) Found' })
            }
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.post('/Update', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID, First_Name, Last_Name, Email, Password, Role } = req.body
      var requiredFields = ''
      if (ID === undefined || ID === '') {
        requiredFields += 'ID, '
      } if (First_Name === undefined || First_Name === '') {
        requiredFields += 'First Name, '
      } if (Last_Name === undefined || Last_Name === '') {
        requiredFields += 'Last Name, '
      } if (Email === undefined || Email === '') {
        requiredFields += 'Email, '
      } if (Password === undefined || Password === '') {
        requiredFields += 'Password, '
      } if (Role === undefined || Role === '') {
        requiredFields += 'Role, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.query(`UPDATE USER SET First_Name = '${First_Name}', Last_Name = '${Last_Name}', Email = '${Email}', Password = '${Password}', Role = '${Role}' WHERE ID = '${ID}'`,
          (error, result, fields) => {
            if (error) {
              response.destroy()
              res.status(400).send({ error: error })
            } else {
              response.destroy()
              res.send({ message: 'Account Updated Successfully', uid: ID })
            }
          })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

module.exports = router