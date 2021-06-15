const fs = require("fs");
const Koa = require("koa");
const app = new Koa();

const jwt = require("jsonwebtoken");

app.use(async (ctx) => {
    const token_payload = { foo: "bar", ts: Date.now() };

    if (ctx.path === "/") {
        let html = `route: ${ctx.path}<br>`;

        // const hmac_secret = "hash";
        // const hmac_token = jwt.sign(token_payload, hmac_secret);
        // html += `hmac_token: ${hmac_token}<br>`;
        // jwt.verify(hmac_token, hmac_secret, function (err, payload) {
        //     if (!err) {
        //         html += `hmac_token is <b>OK</b><br>`;
        //         html += `payload.foo: ${payload.foo}<br>`;
        //     } else {
        //         html += `<b>INVALID</b> hmac_token<br>`;
        //     }
        // });

        const privateKey = fs.readFileSync("./.ssh/jwtRS256.key");
        // const wrongKey = fs.readFileSync("./.ssh/before_openssl_cmd.key.pub");
        // const publicKey = wrongKey;
        const publicKey = fs.readFileSync("./.ssh/jwtRS256.key.pub");
        const rsa_token = jwt.sign(token_payload, privateKey, { algorithm: "RS256" });
        html += `rsa_token: ${rsa_token}<br>`;

        jwt.verify(rsa_token, publicKey, function (err, payload) {
            if (!err) {
                html += `rsa_token is <b>OK</b><br>`;
                html += `payload.foo: ${payload.foo}<br>`;
            } else {
                html += `<b>INVALID</b> rsa_token<br>`;
            }
        });

        ctx.set("Content-type", "text/html");
        ctx.body = html;
    } else if (ctx.path === "/api" || ctx.path.startsWith("/api/")) {
        let json = token_payload;
        json = JSON.stringify(json, null, 2);

        ctx.set("Content-type", "application/json");
        ctx.body = json;
    }
});

app.listen(4000);

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on("event", (msg) => {
    console.log("on event " + msg);
});
// myEmitter.once("event", (msg) => {
//     console.log("once event " + msg);
// });
// myEmitter.emit("event", "test");
fs.watch(__dirname).on("change", (event, filename) => {
    myEmitter.emit("event", `${filename} ${event}`);
});
