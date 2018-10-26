const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const app = new Koa()

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

app.use(koaStatic(resolve('./dist')))
const { createBundleRenderer } = require('vue-server-renderer')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientMainfest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('./src/index.temp.html'), 'utf-8'),
  clientManifest: clientMainfest
})

function renderToString(ctx) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(ctx, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

app.use(async ctx => {
  const context = {
    title: 'ssr test',
    url: ctx.url
  }
  const html = await renderToString(context)
  ctx.body = html
})

app.listen(8000, () => {
  console.log(`server started at 8000`)
})
