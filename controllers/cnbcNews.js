// NPM Modules

var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');

// Assign Mongoose promise
mongoose.Promise = Promise;

// Mongodb models
var Articles = require("../models/articles");
var Comments = require("../models/comments");

// Website To Be Scraped
var url = "https://www.cnbc.com/business/";

// Test Route To Verify Scraping Works From Route
router.get('/home', function(req, res) {
    // body of the html with request
    request(url, function(error, response, html) {
        var $ = cheerio.load(html);
		var result = [];
		$(".cnbcnewsstory").each(function(i, element) {
			var title = $(element).find("a").find("img").attr("title");
			var storyLink = $(element).find("a").attr("href");
			var imgLink = $(element).find("a").find("img").attr("src");
			var summary = $(element).find(".td-post-text-excerpt").text();
			result.push({ 
				Title: title,
				Story: storyLink,
				Link: imgLink,
				Summary: summary
			});
		});
		console.log(result);
		res.send(result);
    });
});


// Scrape the website and assign stories to the database. Checks to verify story has not been added previously.
router.get('/scrape', function(req, res){
	 // body of the html with request
	 request(url, function(error, response, html) {
        var $ = cheerio.load(html);
		var result = [];
		$(".cnbcnewsstory").each(function(i, element) {
			var title = $(element).find("a").find("img").attr("title");
			var storyLink = $(element).find("a").attr("href");
			var imgLink = $(element).find("a").find("img").attr("src");
			var summary = $(element).find(".desc").text();
			result.push({ 
				Title: title,
				Link: storyLink,
				Image: imgLink,
				Summary: summary
			});
		});
		res.send(result);
	});
});


// Default route renders the index handlebars view
router.get('/', function(req, res){
	console.log('in home');
	res.render('index');
});


// Get all current articles in database
router.get('/articles', function(req, res){
	Articles.find().sort({ createdAt: -1 }).exec(function(err, data) { 
		if(err) throw err;
		res.json(data);
	});
});

// Get all comments for one article
router.get('/comments/:id', function(req, res){
	Comments.find({'articleId': req.params.id}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}	
	});
});

// Add comment for article
router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id+' '+req.body.comment);
	Comments.create({
		articleId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Comment Added");
		}
	});
});

// Add comment for article
router.post('/addarticle', function(req, res){
	Articles.create({
		title: req.body.Title,
		imgLink: '',
		storyLink: req.body.Link,
		summary: req.body.Summary
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Article Added");
		}
	});
});

// Delete comment for article
router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comments.remove({'_id': req.params.id}).exec(function(err, data){
		if(err){
			console.log(err);
		} else {
			console.log("Comment deleted");
		}
	})
});

module.exports = router;