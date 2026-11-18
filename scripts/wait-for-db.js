#!/usr/bin/env node
'use strict';

const net = require('node:net');

const url = new URL(process.env.DATABASE_URL || 'postgresql://truewell:changeme@localhost:5432/truewell');
const port = Number(url.port || 5432);
const deadline = Date.now() + Number(process.env.WAIT_TIMEOUT_MS || 60_000);

function attempt() {
  const socket = net.connect({ host: url.hostname, port });
  socket.once('connect', () => {
    socket.end();
    console.info(`Database reachable at ${url.hostname}:${port}`);
  });
  socket.once('error', () => {
    socket.destroy();
    if (Date.now() > deadline) {
      console.error(`Timed out waiting for ${url.hostname}:${port}`);
      process.exit(1);
    }
    setTimeout(attempt, 1000);
  });
}

attempt();
