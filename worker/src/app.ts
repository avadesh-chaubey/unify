const express = require('express');
const app = express();

const probe = require('kube-probe');

probe(app, {
    bypassProtection: true
});

export { app };