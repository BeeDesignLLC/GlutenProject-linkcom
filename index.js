//@prettier
const {send} = require('micro')
const {GraphQLClient} = require('graphql-request')
const parse = require('url').parse
const route = require('path-match')()
const matchThrive = route('/thrive/:id')

const client = new GraphQLClient(
  'https://api.graph.cool/simple/v1/cjb9vgsrd1hlf0187xaxi7te1',
  {
    headers: {
      Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
    },
  },
)

const thriveQuery = `query ThriveProduct($id: ID!){
  ThriveProduct(id: $id) {
    url
  }
}`

const thriveBase = 'http://www.kqzyfj.com/click-8542692-12982167?url='

module.exports = async (req, res) => {
  const thrive = matchThrive(parse(req.url).pathname)

  if (thrive === false) {
    return send(res, 404, "Link not found")
  }

  const {ThriveProduct: {url}} = await client.request(thriveQuery, {id: thrive.id})
  const Location = thriveBase + encodeURIComponent(url)

  res.writeHead(302, {Location})
  res.end()
}
