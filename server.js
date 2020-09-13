const express = require('express');
const path = require('path');
const app = express();

// Use a digit-only regex to verify if a dateString is unix
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
  // If we have a unix dateString, we must convert it from a string to an integer for `Date` to process it.
  const date = isUnix(request.params.dateString) ? new Date(parseInt(request.params.dateString)) : new Date(request.params.dateString);
  
  // Verify `date.getTime()` is truthy and therefore valid.
  if (date.getTime()) {
    response.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    }); 
  }
  
  // Since `date.getTime()` was NOT truthy, it is invalid.
  response.status(400).send("Bad Request. Please use a valid date string.");
});

// Open our app to requests
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}...`);
});
