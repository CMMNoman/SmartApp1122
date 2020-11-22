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
      const { Name, Contact_Number, How, Injured_Person, Ambulance_Needed, Situation, Address, Location, Created_By } = req.body
      var requiredFields = ''
      if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Contact_Number === undefined || Contact_Number === '') {
        requiredFields += 'Contact Number, '
      } if (How === undefined || How === '') {
        requiredFields += 'How, '
      } if (Injured_Person === undefined || Injured_Person === '') {
        requiredFields += 'Injured Person, '
      } if (Ambulance_Needed === undefined || Ambulance_Needed === '') {
        requiredFields += 'Ambulance Needed, '
      } if (Situation === undefined || Situation === '') {
        requiredFields += 'Situation, '
      } if (Address === undefined || Address === '') {
        requiredFields += 'Address, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (Created_By === undefined || Created_By === '') {
        requiredFields += 'Created By, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        const iid = common.getUUIDv4()
        response.query(`INSERT INTO INCIDENT (ID, Name, Contact_Number, How, Injured_Person, Ambulance_Needed, Situation, Address, Location, Created_Date, Created_By, Status) VALUES ('${iid}', '${Name}', '${Contact_Number}', '${How}', ${Injured_Person}, ${Ambulance_Needed}, '${Situation}', '${Address}', '${Location}', '${new Date().toLocaleString()}', '${Created_By}', 'Pending')`, (error, result, fields) => {
          if (error) {
            response.destroy()
            res.status(400).send({ error: error })
          } else {
            response.destroy()
            res.send({ message: 'Incident Reported Successfully', iid: iid })
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
      response.query(`SELECT * FROM INCIDENT`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          response.destroy()
          res.send({ incidents: result })
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
      response.query(`SELECT * FROM INCIDENT WHERE ID = '${ID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          response.destroy()
          res.send({ incident: result })
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
      const { ID, Name, Contact_Number, How, Injured_Person, Ambulance_Needed, Situation, Address, Location, Created_Date, Status } = req.body
      var requiredFields = ''
      if (ID === undefined || ID === '') {
        requiredFields += 'ID, '
      } if (Name === undefined || Name === '') {
        requiredFields += 'Name, '
      } if (Contact_Number === undefined || Contact_Number === '') {
        requiredFields += 'Contact Number, '
      } if (How === undefined || How === '') {
        requiredFields += 'How, '
      } if (Injured_Person === undefined || Injured_Person === '') {
        requiredFields += 'Injured Person, '
      } if (Ambulance_Needed === undefined || Ambulance_Needed === '') {
        requiredFields += 'Ambulance Needed, '
      } if (Situation === undefined || Situation === '') {
        requiredFields += 'Situation, '
      } if (Address === undefined || Address === '') {
        requiredFields += 'Address, '
      } if (Location === undefined || Location === '') {
        requiredFields += 'Location, '
      } if (Created_Date === undefined || Created_Date === '') {
        requiredFields += 'Created_Date, '
      } if (Status === undefined || Status === '') {
        requiredFields += 'Status, '
      } if (requiredFields) {
        response.destroy()
        res.status(400).send({ message: `Following Fileds Are Missing: ${requiredFields.substr(0, requiredFields.length - 2)}` })
      } else {
        response.query(`UPDATE INCIDENT SET Name = '${Name}', Contact_Number = '${Contact_Number}', How = '${How}', Injured_Person = ${Injured_Person}, Ambulance_Needed = ${Ambulance_Needed}, Situation = '${Situation}', Address = '${Address}', Location = '${Location}', Created_Date = '${Created_Date}', Status = '${Status}' WHERE ID = '${ID}'`, (error, result, fields) => {
          if (error) {
            response.destroy()
            res.status(400).send({ error: error })
          } else {
            response.destroy()
            res.send({ message: 'Incident Updated Successfully', iid: ID })
          }
        })
      }
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetDetailByID/:IID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { IID } = req.params
      response.query(`SELECT I.Name AS I_Name, I.HOW AS I_How, I.Contact_Number AS I_Contact_Number, I.Injured_Person AS I_Injured_Person, I.Ambulance_Needed AS I_Ambulance_Needed, I.Situation AS I_Situation, I.Address AS I_Address, I.Location AS I_Location, I.Created_Date AS I_Created_Date, I.Status AS I_Status, AAH.AIDS, H.NAME AS H_Name, H.Phone_No AS H_Phone_No, H.Address AS H_Address, H.Location AS H_Location FROM ASSIGNED_AMBULANCE_HOSPITAL AAH INNER JOIN INCIDENT I ON AAH.IID = I.ID INNER JOIN HOSPITAL H ON AAH.HID = H.ID WHERE AAH.IID = '${IID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          var incidentDetails = result[0]
          var aidsJoin = ''
          result[0].AIDS.split(',').forEach((aid) => {
            aidsJoin += `'${aid}',`
          })
          aidsJoin = aidsJoin.substr(0, aidsJoin.length - 1)
          response.query(`SELECT A.ID, A.Name, A.Reg_No, U.First_Name AS Op_Name, A.Op_Phone_No, A.Location, A.Status FROM user U INNER JOIN AMBULANCE A ON U.ID = A.Op_ID WHERE A.ID IN (${aidsJoin}) ORDER BY A.ID`, (error, result, fields) => {
            if (error) {
              response.destroy()
              res.status(400).send({ error: error })
            } else {
              response.destroy()
              incidentDetails.Ambulances = result
              res.send({ incidentDetails: incidentDetails })
            }
          })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/MarkAsResolved/:IID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { IID } = req.params
      response.query(`SELECT AIDS FROM ASSIGNED_AMBULANCE_HOSPITAL WHERE IID = '${IID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          var aidsJoin = ''
          result[0].AIDS.split(',').forEach((aid) => {
            aidsJoin += `'${aid}',`
          })
          aidsJoin = aidsJoin.substr(0, aidsJoin.length - 1)
          response.query(`UPDATE AMBULANCE SET STATUS = 'Available' WHERE ID IN (${aidsJoin})`, (error, result, fields) => {
            if (error) {
              response.destroy()
              res.status(400).send({ error: error })
            } else {
              response.query(`UPDATE INCIDENT SET STATUS = 'Resolved' WHERE ID = '${IID}'`, (error, result, fields) => {
                if (error) {
                  response.destroy()
                  res.status(400).send({ error: error })
                } else {
                  response.destroy()
                  res.send({ message: 'Resolved' })
                }
              })
            }
          })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetIncidentsByUserID/:UID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { UID } = req.params
      response.query(`SELECT I.* FROM USER U INNER JOIN AMBULANCE A ON U.ID = A.Op_ID INNER JOIN ASSIGNED_AMBULANCE_HOSPITAL AAH ON AAH.AIDS LIKE CONCAT('%',A.ID, '%') INNER JOIN INCIDENT I ON I.ID = AAH.IID WHERE U.ID = '${UID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          response.destroy()
          res.send({ incidents: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetIncidentDetailAmbulanceByID/:UID/:IID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { UID, IID } = req.params
      response.query(`SELECT I.Name AS I_Name, I.HOW AS I_How, I.Contact_Number AS I_Contact_Number, I.Injured_Person AS I_Injured_Person, I.Ambulance_Needed AS I_Ambulance_Needed, I.Situation AS I_Situation, I.Address AS I_Address, I.Location AS I_Location, I.Created_Date AS I_Created_Date, I.Status AS I_Status, A.ID AS A_ID, A.Name AS A_Name, A.Reg_No AS A_Reg_No, U.First_Name AS A_Op_Name, A.Op_Phone_No AS A_Op_Phone_No, A.Location AS A_Location, A.Status AS A_Status, H.NAME AS H_Name, H.Phone_No AS H_Phone_No, H.Address AS H_Address, H.Location AS H_Location FROM INCIDENT I INNER JOIN ASSIGNED_AMBULANCE_HOSPITAL AAH ON AAH.IID = I.ID INNER JOIN AMBULANCE A ON AAH.AIDS LIKE CONCAT('%', A.ID, '%') INNER JOIN USER U ON U.ID = A.Op_ID INNER JOIN HOSPITAL H ON H.ID = AAH.HID WHERE I.ID = '${IID}' AND U.ID = '${UID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          response.destroy()
          res.send({ incidentDetails: result[0] })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/Delete/:IID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { IID } = req.params
      response.query(`SELECT AIDS FROM ASSIGNED_AMBULANCE_HOSPITAL WHERE IID = '${IID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          if (result.length > 0) {
            var aidsJoin = ''
            result[0].AIDS.split(',').forEach((aid) => {
              aidsJoin += `'${aid}',`
            })
            aidsJoin = aidsJoin.substr(0, aidsJoin.length - 1)
            response.query(`UPDATE AMBULANCE SET STATUS = 'Available' WHERE ID IN (${aidsJoin})`, (error, result, fields) => {
              if (error) {
                response.destroy()
                res.status(400).send({ error: error })
              }
            })
          }
          response.query(`DELETE FROM ASSIGNED_AMBULANCE_HOSPITAL WHERE IID = '${IID}'`)
          response.query(`DELETE FROM INCIDENT WHERE ID = '${IID}'`, (error, result, fields) => {
            if (error) {
              response.destroy()
              res.status(400).send({ error: error })
            } else {
              response.destroy()
              res.send({ message: 'Deleted' })
            }
          })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

router.get('/GetIncidentsByCreatorID/:UID', (req, res, next) => {
  connectDB((isSuccess, response) => {
    if (isSuccess) {
      const { UID } = req.params
      response.query(`SELECT * FROM INCIDENT WHERE CREATED_BY = '${UID}'`, (error, result, fields) => {
        if (error) {
          response.destroy()
          res.status(400).send({ error: error })
        } else {
          response.destroy()
          res.send({ incidents: result })
        }
      })
    } else {
      res.status(500).send({ message: 'Error in connecting with DB.' })
    }
  })
})

module.exports = router