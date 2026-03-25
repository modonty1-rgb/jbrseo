import { BetaAnalyticsDataClient } from '@google-analytics/data'

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

const propertyId = process.env.GA4_PROPERTY_ID!

export type AnalyticsData = {
  pageviews7d:      number
  activeUsersToday: number
  signupStart7d:    number
  pricingView7d:    number
  whatsappClick7d:  number
  topPages:         { page: string; views: number }[]
}

export async function getAnalyticsData(_country?: string): Promise<AnalyticsData> {
  try {
    const [m, e, p] = await Promise.all([
      client.runReport({
        property: propertyId,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      }),
      client.runReport({
        property: propertyId,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'eventName' }],
        metrics:    [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName:    'eventName',
            inListFilter: { values: ['signup_start', 'pricing_view', 'whatsapp_click'] },
          },
        },
      }),
      client.runReport({
        property:  propertyId,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics:    [{ name: 'screenPageViews' }],
        orderBys:   [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5,
      }),
    ])

    const row    = m[0]?.rows?.[0]
    const events = e[0]?.rows ?? []
    const pages  = p[0]?.rows ?? []

    const getEvent = (name: string) =>
      Number(
        events.find(r => r.dimensionValues?.[0]?.value === name)
          ?.metricValues?.[0]?.value ?? 0
      )

    return {
      pageviews7d:      Number(row?.metricValues?.[0]?.value ?? 0),
      activeUsersToday: Number(row?.metricValues?.[1]?.value ?? 0),
      signupStart7d:    getEvent('signup_start'),
      pricingView7d:    getEvent('pricing_view'),
      whatsappClick7d:  getEvent('whatsapp_click'),
      topPages: pages.map(r => ({
        page:  r.dimensionValues?.[0]?.value ?? '/',
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })),
    }
  } catch {
    // Never break the admin page — return zeros on any error
    return {
      pageviews7d: 0, activeUsersToday: 0,
      signupStart7d: 0, pricingView7d: 0, whatsappClick7d: 0,
      topPages: [],
    }
  }
}

export type AllAnalyticsData = {
  all: AnalyticsData
  sa:  AnalyticsData
  eg:  AnalyticsData
}

export async function getAllAnalyticsData(): Promise<AllAnalyticsData> {
  const [all, sa, eg] = await Promise.all([
    getAnalyticsData(),
    getAnalyticsData('SA'),
    getAnalyticsData('EG'),
  ])
  return { all, sa, eg }
}
