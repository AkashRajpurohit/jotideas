if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI : 'mongodb://akash:akash123@ds227939.mlab.com:27939/vidjot-app'
  } 
} else {
  module.exports = {
    mongoURI : 'mongodb://localhost/vidjot-dev'
  }
}