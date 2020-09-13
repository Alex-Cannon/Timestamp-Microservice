const express = require('express');
const path = require('path');
const app = express();

const isUnix = (dateString) => {
  return /^\d+$/.test(dateString);
}

// Give express access to static files in ./public
app.use(express.static('public'));

// When "/" is requested, serve ./views/index.html
app.get("/", function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

// Return the timestamp NOW if there is no :datestring parameter
app.get("/api/timestamp", (request, response) => {
  const date = new Date();
  
  response.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// When "/api/timestamp/:dateString" 
app.get("/api/timestamp/:dateString", (request, response) => {
  const date = isUnix(request.params.dateString) ? new Date(parseInt(request.params.dateString)) : new Date(request.params.dateString);
  
  // Verify date is valid
  if (date.getTime()) {
    response.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    }); 
  }
  
  response.status(400).send("Bad Request. Please use a valid date string.");
});

// Open our app to requests
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}...`);
});
