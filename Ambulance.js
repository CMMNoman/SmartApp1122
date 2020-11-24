const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const connectDB = require('./DBConnection')
const common = require('./common')
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/Add', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { Name, Reg_No, Op_First_Name, Op_Last_Name, Op_Email, Op_Phone_No, Op_Password, Location } = req.body
      var requiredFields = ''
      if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Reg_No === undefined || Reg_No === '') {
        requiredFields += 'Registration No, '
      } if (Op_First_Name === undefined || Op_First_Name === '') {
        requiredFields += 'Operator First Name, '
      } if (Op_Last_Name === undefined || Op_Last_Name === '') {
        requiredFields += 'Operator Last Name, '
      } if (Op_Email === undefined || Op_Email === '') {
        requiredFields += 'Operator Email, '
      } if (Op_Password === undefined || Op_Password === '') {
        requiredFields += 'Operator Password, '
      } if (Op_Phone_No === undefined || Op_Phone_No === '') {
        requiredFields += 'Operator Phone Number, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Ambulance Default Location, '
      } if (requiredFields) {
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.all(`SELECT * FROM USER WHERE Email =  '${Op_Email}' COLLATE NOCASE`, (error, result, fields) => {
          if (error) {
            res.status(400).send({ error: error })
          } else if (result && result.length > 0) {
            res.send({ message: 'Already Registered' })
          } else {
            const uid = common.getUUIDv4()
            response.all(`INSERT INTO USER (ID, First_Name, Last_Name, Email, Password, Role) VALUES ('${uid}', '${Op_First_Name}', '${Op_Last_Name}', '${Op_Email}', '${Op_Password}', 'Ambulance')`,
              (error, result, fields) => {
                if (error) {
                  res.status(400).send({ error: error })
                } else {
                  const aid = common.getUUIDv4()
                  response.all(`INSERT INTO AMBULANCE (ID, Name, Reg_No, Op_ID, Op_Phone_No, Location, Status, Current_Location) VALUES ('${aid}', '${Name}', '${Reg_No}', '${uid}', '${Op_Phone_No}', '${Location}', 'Available', '0,0')`, (error, result, fields) => {
                    if (error) {
                      res.status(400).send({ error: error })
                    } else {
                      res.send({ message: 'Ambulance Added Successfully', aid: aid, uid: uid })
                    }
                  })
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

router.get('/GetAll', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      response.all(`SELECT A.ID, A.Name, A.Reg_No, U.First_Name AS Op_Name, A.Op_Phone_No, A.Location, A.Status FROM user U INNER JOIN AMBULANCE A ON U.ID = A.Op_ID`, (error, result, fields) => {
        if (error) {
          res.status(400).send({ error: error })
        } else {
          res.send({ ambulances: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetByID/:ID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID } = req.params
      response.all(`SELECT * FROM AMBULANCE WHERE ID = '${ID}'`, (error, result, fields) => {
        if (error) {
          res.status(400).send({ error: error })
        } else {
          res.send({ ambulance: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.post('/Update', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID, Name, Location } = req.body
      var requiredFields = ''
      if (ID === '') {
        requiredFields += 'ID, '
      } if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (requiredFields) {
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.all(`UPDATE HOSPITAL SET Name = '${Name}', Location = '${Location}' WHERE ID = '${ID}'`, (error, result, fields) => {
          if (error) {
            res.status(400).send({ error: error })
          } else {
            res.send({ message: 'Hospital Updated Successfully', iid: ID })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.post('/UpdateLocation', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { ID, Location } = req.body
      var requiredFields = ''
      if (ID === '') {
        requiredFields += 'ID, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (requiredFields) {
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.all(`UPDATE AMBULANCE SET Current_Location = '${Location}' WHERE Op_ID = '${ID}'`, (error, result, fields) => {
          if (error) {
            res.status(400).send({ error: error })
          } else {
            res.send({ message: true })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.post('/GetAmbulancesCurrentLocation', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { AIDS } = req.body
      var aidsJoin = ''
      AIDS.split(',').forEach((aid) => {
        aidsJoin += `'${aid}',`
      })
      aidsJoin = aidsJoin.substr(0, aidsJoin.length - 1)
      response.all(`SELECT Current_Location FROM AMBULANCE WHERE ID IN (${aidsJoin}) ORDER BY ID`, (error, result, fields) => {
        if (error) {
          res.status(400).send({ error: error })
        } else {
          res.send({ ambulances: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/Delete/:AID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { AID } = req.params
      response.all(`SELECT * FROM ASSIGNED_AMBULANCE_HOSPITAL WHERE AIDS LIKE '%${AID}%'`, (error, result, fields) => {
        if (error) {
          res.status(400).send({ error: error })
        } else {
          if (result.length > 0) {
            res.send({ message: `Can't delete right now because it is assigned to an incident.` })
          } else {
            response.all(`DELETE FROM USER WHERE ROLE = 'Ambulance' AND ID = (SELECT Op_ID FROM AMBULANCE WHERE ID = '${AID}')`)
            response.all(`DELETE FROM AMBULANCE WHERE ID = '${AID}'`, (error, result, fields) => {
              if (error) {
                res.status(400).send({ error: error })
              } else {
                res.send({ message: 'Deleted' })
              }
            })
          }
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

module.exports = router