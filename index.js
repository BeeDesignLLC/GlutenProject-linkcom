//@prettier
const {send} = require('micro')
const {GraphQLClient} = require('graphql-request')
const parse = require('url').parse
const route = require('path-match')()
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

module.exports = async (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  let Location = ''

  const offer = matchOffer(parse(req.url).pathname)
  if (offer !== false) {
    const {Offer: {url, merchant}} = await client.request(offerQuery, {
      id: offer.id,
    })

    if (merchant === 'Thrive') {
      Location = thriveBase + encodeURIComponent(url)
    } else {
      Location = url
    }
  }

  if (Location) {
    res.writeHead(302, {Location})
    return res.end()
  }

  return send(res, 404, '<h1>Link not found :(</h1>')
}
