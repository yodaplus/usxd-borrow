import { enableMixpanelDevelopmentMode, MixpanelDevelopmentType } from 'analytics/analytics'
import Mixpanel from 'mixpanel'
import { NextApiRequest, NextApiResponse } from 'next'

type MixpanelType = MixpanelDevelopmentType | typeof Mixpanel
let mixpanel: MixpanelType = {} as MixpanelType

mixpanel = enableMixpanelDevelopmentMode(mixpanel)

export default async function (req: NextApiRequest, res: NextApiResponse<{ status: number }>) {
  try {
    const { eventName, eventBody } = req.body

    mixpanel.track(`be-${eventName}`, {
      ...eventBody,
      id: `be-${eventBody.id}`,
    })

    res.json({ status: 200 })
  } catch (err) {
    res.json({ status: 500 })
  }
}
