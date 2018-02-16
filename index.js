//@prettier
const {send} = require('micro')
const {GraphQLClient} = require('graphql-request')
const parse = require('url').parse
const route = require('path-match')()
const matchThrive = route('/link/thrive/:id')
const matchNuts = route('/link/nuts/:id')

const client = new GraphQLClient(
  'https://api.graph.cool/simple/v1/cjb9vgsrd1hlf0187xaxi7te1',
  {headers: {Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`}},
)

const thriveQuery = `query ThriveProduct($id: ID!){
  ThriveProduct(id: $id) {
    url
  }
}`
const nutsQuery = `query NutsProduct($id: ID!){
  NutsProduct(id: $id) {
    url
  }
}`

const thriveBase = 'http://www.kqzyfj.com/click-8542692-12982167?url='

module.exports = async (req, res) => {
  let Location = ''

  const thrive = matchThrive(parse(req.url).pathname)
  if (thrive !== false) {
    const {ThriveProduct: {url}} = await client.request(thriveQuery, {
      id: thrive.id,
    })
    Location = thriveBase + encodeURIComponent(url)
  }

  const nuts = matchNuts(parse(req.url).pathname)
  if (nuts !== false) {
    const {NutsProduct: {url}} = await client.request(nutsQuery, {
      id: nuts.id,
    })
    Location = url
  }

  if (Location) {
    res.writeHead(302, {Location})
    return res.end()
  }

  return send(res, 404, '<h1>Link not found :(</h1>')
}
