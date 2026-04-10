const http = require('http');

const server = http.createServer((req, res) => {
    res.write("DevSecOps Project Running 🚀");
    res.end();
});

server.listen(3000);
