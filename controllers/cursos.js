"use strict";

var validator = require("validator");
var Curso = require("../models/cursos");
var fs = require("fs");
var path = require("path");

var controller = {
  save: (req, res) => {
    var body = req.body;

    console.log(body);

    // validar datos con validator
    try {
      var validate_nombre = !validator.isEmpty(body.nombre);
      var validate_institucion = !validator.isEmpty(body.institucion);
    } catch (e) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar!!",
      });
    }

    if (validate_nombre && validate_institucion) {
      var curso = new Curso();

      curso.nombre = body.nombre;
      curso.descripcion = body.descripcion;
      curso.institucion = body.institucion;
      curso.duracion = body.duracion;
      curso.keyword = body.keyword;
      curso.image = body.image;
      curso.url = body.url;

      curso.save((err, cursoStored) => {
        if (err || !cursoStored) {
          return res.status(404).send({
            status: "error",
            message: "no se guardò!!",
          });
        } else {
          return res.status(200).send({
            status: "success",
            cursoStored,
          });
        }
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "LOS datos no son validos!!",
      });
    }
  },

  getCursos: (req, res) => {
    var query = Curso.find({});
    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(3);
    }

    //find
    query.sort("-_id").exec((err, cursos) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "error al devolver los articulos!!",
        });
      }

      if (!cursos) {
        return res.status(404).send({
          status: "error",
          message: "error no hay articulos!!",
        });
      }

      return res.status(200).send({
        status: "success",
        cursos,
      });
    });
  },

  // prueba de buscar
  searchCurso: (req, res) => {
    var keyword = req.params.id;

    let er = new RegExp(keyword, "i");

    Curso.find({ nombre: er }).exec((err, cursos) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "error al devolver los articulos!!",
        });
      }
      return res.status(200).send({
        status: "success",
        cursos,
      });
    });
  },

  searchCursoKw: (req, res) => {
    var kword = req.params.id;

    let er = new RegExp(kword, "i");

    Curso.find({ $or: [{ keyword: { $in: er } }, { nombre: er }] }).exec(
      (err, cursos) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "error al devolver los articulos!!",
          });
        }
        return res.status(200).send({
          status: "success",
          cursos,
        });
      }
    );
  },

  getCurso: (req, res) => {
    //recoger el id
    var curso_id = req.params.id;

    console.log(req.params);

    if (!curso_id || curso_id == null) {
      return res.status(404).send({
        status: "error",
        message: "error no existe articulos!!",
      });
    }

    Curso.findById(curso_id, (err, curso) => {
      if (err || !curso) {
        return res.status(404).send({
          status: "error",
          message: "error no existe el  articulos!!",
        });
      }

      return res.status(200).send({
        status: "success",
        curso,
      });
    });
  },

  update: (req, res) => {
    var curso_id = req.params.id;

    var body = req.body;

    // validar
    try {
      var validate_nombre = !validator.isEmpty(body.nombre);
      var validate_institucion = !validator.isEmpty(body.institucion);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "faltan datos por enviar!!",
      });
    }

    //actualizar
    if (validate_nombre && validate_institucion) {
      Curso.findOneAndUpdate(
        { _id: curso_id },
        body,
        { new: true },
        (err, curso_updated) => {
          if (err || !curso_updated) {
            return res.status(404).send({
              status: "error",
              message: "error al actualizar!!",
            });
          }
          return res.status(200).send({
            status: "success",
            curso_updated,
          });
        }
      );
    } else {
      return res.status(404).send({
        status: "error",
        message: "la validacion no  es correcta!!",
      });
    }
  },

  delete: (req, res) => {
    var curso_id = req.params.id;

    Curso.findOneAndDelete({ _id: curso_id }, (err, cursoRemoved) => {
      if (err || !cursoRemoved) {
        return res.status(404).send({
          status: "error",
          message: "error al borrar!!",
        });
      }
      return res.status(200).send({
        status: "success",
        message: "objeto eliminado",
        // cursoRemoved
      });
    });
  },

  upload: (req, res) => {

    var file_name = "imagen no subida...";
    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    var file_path = req.files.file0.path;

    var file_split = file_path.split("/");
    var file_name = file_split[2];

    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];

    if (file_ext != "jpg" && file_ext != "png" && file_ext != "webp") {
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "error",
          message: "la extension no es valida",
        });
      });
    } else {
    

      var id = req.params.id;
      Curso.findOneAndUpdate(
        { _id: id },
        { image: file_name },
        { new: true },
        (err, curso_updated) => {
          if (err || !curso_updated) {
            return res.status(200).send({
              status: "error",
              message: "error al guardar",
            });
          }

          return res.status(200).send({
            status: "succes",
            curso_updated,
          });
        }
      );
    }
  },

  getImage: (req, res) => {
    var file = req.params.image;

    // busca el archivo
    var path_file = "./upload/cursos/" + file;

    if (fs.existsSync(path_file)) {
      return res.sendFile(path.resolve(path_file));
    } else {
      return res.status(404).send({
        status: "error",
        message: "La imagen no existe !!!",
      });
    }
  },
};

module.exports = controller;
