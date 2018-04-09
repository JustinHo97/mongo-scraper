var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {
    app.get("/api/scrape", function (req, res) {
        axios.get("https://www.nytimes.com/").then(function (response) {
            var $ = cheerio.load(response.data);

            $("article").each(function (i, element) {
                var result = {};
                result.title = $(this)
                    .find("a")
                    .text();
                result.link = $(this)
                    .find("a")
                    .attr("href");
                result.summary = $(this)
                    .find("p.summary")
                    .text();

                // Create a new Article using the `result` object built from scraping
                db.Article.findOneAndUpdate({ title: result.title }, { title: result.title, link: result.link, summary: result.summary }, { new: true, upsert: true })
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        });
    });

    app.get("/api/article", function (req, res) {
        db.Article.find({}).then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        })
    });

    app.put("/api/save/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true }).then(function (dbArticle) {
            console.log(dbArticle);
            res.send("Saved");
        })
    });

    app.get("/api/saved", function (req, res) {
        db.Article.find({ saved: true }).populate("notes").then(function (dbSaved) {
            console.log(dbSaved);
            res.json(dbSaved);
        }).catch(function (err) {
            res.json(err);
        });
    });

    app.put("/save/note/:id", function (req, res) {
        var id = req.params.id;
        var body = req.body.text;
        console.log(id);
        db.Notes.findOneAndUpdate({_id: id},{ _id: id, $push: {body}}, {upsert:true}).then(function (dbNotes) {
            return db.Article.findOneAndUpdate({ _id: id }, { notes: dbNotes._id }, { new: true });
        }).then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
    })
}