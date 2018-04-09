var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  notes: Array
});

// This creates our model from the above schema, using mongoose's model method
var Notes = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Notes;
