const functions = require("firebase-functions")
const app = require('express')()
const cors = require('cors')
const Parser = require('rss-parser')
const parser = new Parser()
const types = [
  'daily',
  'weekly',
  'monthly',
]

app.use(cors({origin: true}))

app.get('/', (req, res) => {
  let { since } = req.query
  if (!types.includes(since)) {
    since = 'daily'
  }
  parser.parseURL('http://github-trends.ryotarai.info/rss/github_trends_javascript_' + since + '.rss')
    .then(({items}) => {
      const repositories = items.map(item => {
        const str = item.title.split(' ')[0]
        const [author, name] = str.split('/')
        return {
          author,
          name,
          description: item.content,
          href: item.link,
        }
      })
      return res.send(repositories)
    }).catch(error => {
      return res.send(error)
    })
})


exports.trends = functions.https.onRequest(app)
