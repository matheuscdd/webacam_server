const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const NodeWebcam = require("node-webcam");

const internalPort = Number(process.env.INTERNAL_PORT || 8031);

const server = createServer((request, response) => {
    const { url } = request;

    switch(url) {
        case '/':
            return serveFile(response, 'index.html', 'text/html');
        case '/front.js':
            return serveFile(response, url, 'application/javascript');
        case '/state.jpg':
            return serveFile(response, 'state.jpg', 'image/jpg');
        default:
            return serveJson(response, 404, { 'message': 'Not found' });
    }
});

function serveJson(response, status, data) {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(data));
}

function serveFile(response, filePath, contentType) {
    const fullPath = path.join(__dirname, filePath);
    try {
        const content = fs.readFileSync(fullPath);
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content);
    } catch (error) {
        serveJson(response, 500, { 'message': 'Internal Server Error' });
    }
}


const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "location",
  verbose: false
};

const Webcam = NodeWebcam.create(opts);

function capture() {
  Webcam.capture("state", function(err) {
    if (err) {
      console.log("Error capturing image: ", err);
      return;
    }
  });
}

setInterval(capture, 5000);

server.listen(internalPort, () => console.log(`START - Server is listening on ${internalPort}`));