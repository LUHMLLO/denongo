import { Application } from './_deps.ts';
import router from "./router.ts";

const app = new Application();

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3000;
console.log(`Server is running http://localhost:${port}/api/`)
await app.listen({ port });

