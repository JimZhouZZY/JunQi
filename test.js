/*
 * Copyright (C) 2025 Zhiyu Zhou (jimzhouzzy@gmail.com)
 * This file is part of Web-JunQi.
 * Licensed under the GPLv3 License.
 */

const { spawn } = require("child_process");
const assert = require("assert"); // Node.js 的原生断言模块

const app = spawn("node", ["app.js"]);

let stdoutData = "";
let stderrData = "";

app.stdout.on("data", (data) => {
  stdoutData += data.toString();
  if (stdoutData.includes("listening on port: ")) {
    console.log("App started successfully");
    assert(
      stdoutData.includes("listening on port: "),
      "App did not start correctly",
    );
    console.log("Test passed");
    process.exit(0);
    app.kill("SIGTERM");
  }
});

app.stderr.on("data", (data) => {
  stderrData += data.toString();
  console.error("App STDERR:", stderrData);
});

app.on("close", (code) => {
  if (code !== 0) {
    console.error(`App exited with code ${code}`);
    process.exit(1); // 如果应用崩溃，退出测试并标记为失败
  }
});

// 设置超时，防止测试卡住
setTimeout(() => {
  app.kill();
  console.error("App did not start within timeout");
  process.exit(1); // 超时标记为失败
}, 5000); // 5秒超时
