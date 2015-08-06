var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function (req, res) {
	if(req.query.search === undefined) {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index.ejs', {
				quizes: quizes
			});
		});
	} else {
		var search = "%" + req.query.search + "%";
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
			function (quizes) {
				res.render('quizes/index.ejs', {
					quizes: quizes
				});
			}
		);
	}
};

// GET /quizes/:id
exports.show = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {
			quiz: req.quiz
		});
	});
};

// GET /quizes/answer
exports.answer = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if(req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', {
				quiz: quiz,
				respuesta: 'Correcto'
			});
		} else {
			res.render('quizes/answer', {
				quiz: req.quiz,
				respuesta: 'Incorrecto'
			});
		}
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	//guarda en DB los campos pregunta y respuesta de Quiz
	quiz.save({fields: ["pregunta", "respuesta"]}).then(
		function () {
			res.redirect('/quizes'); //Redirección HTTP (URL relativo) lista de preguntas
		}
	);
};

// GET /author
exports.author = function (req, res) {
	res.render('author');
};