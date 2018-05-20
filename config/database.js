if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: process.env.REMOTE_MONGO,
    environment: "Production"
  };
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/vidjot-dev",
    environment: "Development"
  };
}
