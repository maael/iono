import { NextApiHandler } from 'next'
import { Expo } from 'expo-server-sdk'
import Cors from 'micro-cors'

const cors = Cors({
  allowedMethods: ['POST', 'HEAD', 'OPTIONS'],
})

const expo = new Expo()

const handler: NextApiHandler = async (req, res) => {
  const { token, url, title = 'Open', body = 'Open on phone' } = req.body
  // eslint-disable-next-line no-console
  console.info('[request]', token, url, title, body)
  const pushToken = `ExponentPushToken[${token}]`
  if (!token || !Expo.isExpoPushToken(pushToken)) {
    res.status(400).json({ error: 'Invalid token' })
    return
  }
  const result = await expo.sendPushNotificationsAsync([{ to: pushToken, title, body, data: { url } }])
  // eslint-disable-next-line no-console
  console.info('[push]', result)
  res.json({ ok: 1 })
}

export default cors(handler)
