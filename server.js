const http = require("http");
const fs = require("fs");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const { posts, users } = require("./data");

const delay = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

const randomNumber = (start, stop) => {
  return Math.floor(Math.random() * (stop - start + 1)) + start;
};

const fortune = (ctx, body = null, status = 200) => {
  const delay = randomNumber(1, 2) * 500;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.9) {
        reject(new Error("Something bad happened"));
        return;
      }

      ctx.response.status = status;
      ctx.response.body = body;
      resolve();
    }, delay);
  });
};

const app = new Koa();
app.use(cors());
app.use(
  koaBody({
    json: true,
  })
);

const router = new Router();

router.get("/api/users", async (ctx, next) => {
  console.log(1);
  return fortune(ctx, users);
});

router.get("/api/posts/:id", async (ctx, next) => {
  const id = Number(ctx.params.id);
  const filtered = posts.filter((o) => o.userId === id);
  return fortune(ctx, filtered);
});

router.get("/api/users/:id", async (ctx, next) => {
  const id = Number(ctx.params.id);
  const item = users.find((o) => o.id === id);
  if (item === undefined) {
    return fortune(ctx, "Not found", 404);
  }
  return fortune(ctx, item);
});

router.post("/api/users/:id", async (ctx, next) => {
  const id = Number(ctx.params.id);
  const { body } = ctx.request;
  
  // ERROR ?
  await delay(2000)
  if (Math.random() > 0.5) {
    ctx.response.status = 500;
    ctx.response.body = { message: "Something bad happened" };
    return ctx;
  }

  let user = users.find((i) => i.id === id);

  users[id - 1] = { ...user, ...body };
  ctx.response.body = "111";
  ctx.response.status = 204;

  return ctx;
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port);
