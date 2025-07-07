// Extra logger middleware stub for candidate to enhance
module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;  
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}; // This middleware logs the request method, URL, status code, and duration of the request. 
// It uses the 'finish' event to log after the response has been sent, ensuring accurate timing.
