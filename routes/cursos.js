"use strict";

var express = require("express");
var CursosController = require("../controllers/cursos");
var multipart = require("connect-multiparty");

var router = express.Router();
var md_upload = multipart({ uploadDir: "./upload/cursos" });

router.post("/save", CursosController.save);
router.get("/cursos/:last?", CursosController.getCursos);
router.get("/curso/:id", CursosController.getCurso);
router.get("/search/:id", CursosController.searchCurso);
router.get("/searchkw/:id", CursosController.searchCursoKw);

router.put("/update/:id", CursosController.update);
router.delete("/delete/:id", CursosController.delete);
router.post("/upload-image/:id", md_upload, CursosController.upload);
router.get("/get-image/:image", CursosController.getImage);

module.exports = router;
