import { NextApiHandler } from 'next'
import { Expo } from 'expo-server-sdk'

const expo = new Expo()

const handler: NextApiHandler = async (req, res) => {
  const { token, url, title = 'Open', body = 'Open on phone' } = req.body
  const pushToken = `ExponentPushToken[${token}]`
  if (!Expo.isExpoPushToken(pushToken)) {
    res.status(400).json({ error: 'Invalid token' })
    return
  }
  await expo.sendPushNotificationsAsync([{ to: pushToken, title, body, data: { url } }])
  res.json({ ok: 1 })
}

export default handler
