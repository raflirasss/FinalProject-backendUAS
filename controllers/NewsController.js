const db = require('../models');
const news = db.news;
const Joi = require('joi');


const newsSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    content: Joi.string().required(),
    url: Joi.string(),
    url_image: Joi.string(),
    published_at: Joi.date(),
    category: Joi.string().valid('sport', 'finance', 'automotive'),
});


exports.create = (req, res) => {
    const { error } = newsSchema.validate(req.body);

    if (error) {
        return res.status(422).send({ message: error.details[0].message });
    }

    req.body.tanggal_lahir = new Date(req.body.tanggal_lahir);

    news.create(req.body)
        .then(data => res.status(201).send({ message: 'Resource is added successfully', data }))
        .catch(err => res.status(500).send({ message: err }));
};


exports.findAll = (req, res) => {
    news.find()
        .then(data => {
            if (data.length === 0) {
                res.status(404).send({ message: 'Data Berita Kosong' });
            } else {
                res.status(200).send({ message: 'Get All Resource', data });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};



exports.show = (req, res) => {

    const id = req.params.id;

    news.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Resource not found' });
            } else {
                res.status(200).send({ message: 'Get Detail Resource', data });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};

exports.searchByTitle = (req, res) => {

    const title = req.params.title;

    news.findOne({ title: title })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Resource not found' });
            } else {
                res.status(200).send({ message: 'Get Detail Resource By Title', data });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};




exports.update = (req, res) => {
    const { error } = newsSchema.validate(req.body);

    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    const id = req.params.id;
    req.body.tanggal_lahir = new Date(req.body.tanggal_lahir);

    news.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Resource not found, unable to update" });
            } else {
                res.status(200).send({ message: "Resource updated successfully", data });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};


exports.delete = (req, res) => {
    const id = req.params.id;

    news.findOneAndDelete({ _id: id })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Resource not found, unable to delete" });
            } else {
                res.status(200).send({ message: "Resource deleted successfully" });
            }
        })
        .catch(err => res.status(500).send({ message: err.message }));
};