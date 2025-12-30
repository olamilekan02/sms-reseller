const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
  name: String,
  code: String,
  operators: [String],
});

module.exports = mongoose.model('Country', CountrySchema);
