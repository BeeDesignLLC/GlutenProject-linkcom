//@prettier
const raven = require('raven')
raven
  .config(process.env.SENTRY_DSN_LINKCOM, {
    logger: 'server',
    name: process.env.NOW_URL,
  })
  .install()
const {send} = require('micro')
const {GraphQLClient} = require('graphql-request')
const parse = require('url').parse
const route = require('path-match')()
const matchTest = route('/link/test')
const matchOffer = route('/link/offer/:id')

const client = new GraphQLClient(
  'https://api.graph.cool/simple/v1/cjb9vgsrd1hlf0187xaxi7te1',
  {headers: {Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`}},
)

const offerQuery = `query Offer($id: ID!){
  Offer(id: $id) {
    url
    merchant
  }
}`

const thriveBase = 'http://www.kqzyfj.com/click-8542692-12982167?url='
const walmartBase =
  'http://linksynergy.walmart.com/deeplink?id=8loQjOHw*oo&mid=2149&murl='

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    raven.captureException(err, {req})
    return send(
      res,
      500,
      '<h3>On snap! This Gluten Project robot has suffered a heart attack! The founders have been notified and will investigate ASAP.</h3>',
    )
  }
}

module.exports = handleErrors(async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  let Location = ''

  const offer = matchOffer(parse(req.url).pathname)
  if (offer !== false) {
    const {Offer: {url, merchant}} = await client.request(offerQuery, {
      id: offer.id,
    })

    switch (merchant) {
      case 'Thrive':
        Location = thriveBase + encodeURIComponent(url)
        break
      case 'Walmart':
        Location = walmartBase + encodeURIComponent(url)
        break
      default:
        Location = url
    }
  }

  if (Location) {
    res.writeHead(302, {Location})
    return res.end()
  }

  const test = matchTest(parse(req.url).pathname)
  if (test !== false) {
    return send(res, 200)
  }

  return send(res, 404, '<h1>Link not found :(</h1>')
})
