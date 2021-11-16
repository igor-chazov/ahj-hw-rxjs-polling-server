const http = require('http');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Router = require('koa-router');
const MsgGenerator = require('./js/MsgGenerator');

const app = new Koa();

const dirPublic = path.join(__dirname, '/public');
app.use(koaStatic(dirPublic));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

const msgGenerator = new MsgGenerator();
msgGenerator.start();

const getMessages = async (ctx) => {
  const id = ctx.params.id ? ctx.params.id : '';

  ctx.response.body = JSON.stringify({
    status: msgGenerator.isFinish ? 'finish' : 'ok',
    timestamp: Date.now(),
    messages: msgGenerator.getLastMessages(id),
  });
};

router.get('/messages/unread', getMessages);
router.get('/messages/unread/:id', getMessages);

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
// eslint-disable-next-line no-console
server.listen(port, () => console.log('Server started'));
