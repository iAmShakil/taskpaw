const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { google } = require('googleapis')
const jwtDecode = require('jwt-decode')
const { signJwt, getJwtVerifiedData } = require('./auth')
const taskController = require('./task/task.controller')

const prisma = new PrismaClient()
const app = express()

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_LOGIN_REDIRECT
)

app.use(cors())
app.use(bodyParser())
app.use(cookieParser())

app.get('/', (_, res) => {
  res.send('ok')
})

app.get('/echo', (req, res) => {
  res.send(JSON.stringify(req.headers))
})

app.get('/auth/user', async (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization.split('Bearer ')[1]
    const data = getJwtVerifiedData(jwtToken)
    const email = data.email
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) {
      throw new Error(`user ${email} does not exist`)
    }
    res.send({
      email,
      name: `${user.first_name} ${user.last_name}`,
      id: user.id,
      profile_photo: user.profile_photo
    })
  } catch (error) {
    next(error)
  }
})

app.post('/social-login/google/', async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.body.code)
    const googleData = jwtDecode(tokens.id_token)
    const data = {
      email: googleData.email,
      first_name: googleData.given_name,
      last_name: googleData.family_name,
      registration_source: 'google',
      profile_photo: googleData.picture
    }
    const user = await prisma.user.upsert({
      where: {
        email: googleData.email
      },
      update: data,
      create: data
    })

    const token = signJwt({
      email: googleData.email,
      id: user.id
    })

    res.send({
      access_token: token
    })
  } catch (error) {
    res.status(401).send()
  }
})

// task router
app.use('/task', taskController)

// error handler
app.use(function (err, __req, res) {
  try {
    // eslint-disable-next-line no-console
    console.error(err)
    const errorObject = {
      status: err?.status ? err.status : 500,
      message: err?.message ? err.message : 'Unexpected error'
    }
    res.status(errorObject.status).send({
      message: errorObject.message
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    res.status(500).json({
      message: 'unexpected error'
    })
  }
})
module.exports = app
