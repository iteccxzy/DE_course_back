"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursosSchema = Schema({
  nombre: String,
  descripcion: String,
  institucion: String,
  duracion: String,
  keyword: [],
  date: { type: Date, default: Date.now },
  image: String,
  url: String,
});

module.exports = mongoose.model("Curso", CursosSchema);
