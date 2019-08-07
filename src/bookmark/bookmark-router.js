const express = require('express');
const uuid = require('uuid/v4');
const { bookmarks } = require('../store');
const logger = require('../logger');

const bookmarkRouter = express.Router();
const bodyParser = express.json()


bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        return res.status(200).send(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, description, rating} = req.body;

        if(!title) {
          logger.error('title is required')
          return res.status(404).send('need title')
        }
      
        if(!description) {
          logger.error('description is required')
          return res.status(404).send('need description')
        }
      
        if(isNaN(rating)) {
          logger.error('number is required')
          return res.status(404).send('need number')
        }
      
        if(!url) {
          logger.error('url is required')
          return res.status(404).send('need url')
        }
      
        const id = uuid();
      
        const bookmark = {
          id,
          title,
          url,
          description,
          rating
        }
      
        bookmarks.push(bookmark);
        
        logger.info(`bookmark created with ${id}`);
      
        res.status(200).location(`http://localhost:8000/bookmarks/${id}`).json(bookmark)
})

bookmarkRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const {id} = req.params;


        const filteredBookmark = bookmarks.find(b => b.id == id);
      
        if(!filteredBookmark) {
          logger.error(`bookmark with ${id} not found`)
          return res.status(404).send('404 not found');
        }
      
        res.json(filteredBookmark)
    })
    .delete((req, res) => {
        const {id} = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
      
        if(bookmarkIndex === -1) {
          logger.error('bookmark with id not found')
          return res.status(404).send('not found')
        }
      
        bookmarks.splice(bookmarkIndex, 1);
      
        logger.info(`bookmark with id ${id} deleted`);
      
        res.status(204).end()
    })

module.exports = bookmarkRouter;