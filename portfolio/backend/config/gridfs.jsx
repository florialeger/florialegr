const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectGridFS = (connection) => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection('uploads'); // Nom de la collection pour GridFS
};

const getGFS = () => gfs;

module.exports = { connectGridFS, getGFS };
