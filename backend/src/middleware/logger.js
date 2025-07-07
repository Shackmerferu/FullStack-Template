module.exports = (req, res, next) => {
  const start = Date.now(); // Capture start time

  res.on('finish', () => { // 'finish' fires when response is sent
    const duration = Date.now() - start; // Calculate elapsed time  
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`); // Log method, URL, status, duration
  });

  next(); // Proceed to next middleware
};
