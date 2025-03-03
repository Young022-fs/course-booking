let express = require("express");
let app = express();
const mongodbAccess = require('./mongodbAccess'); 

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set('json spaces', 3);
const path = require('path');

app.use(express.static('views'))



mongodbAccess.connectDB();

app.use((req, res,next)=>{
  console.log(`A ${req.method} request come from ${req.url}`);
  next()
})

app.get('/collections/:collectionName', async function(req, res, next) {
    console.log("Fetching data from collection:", req.collection.collectionName); 
    try {
        const results = await req.collection.find({}).toArray();
        if (results.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }
        console.log("Results fetched:", results); 
        res.json(results);
    } catch (err) {
        console.error('Error fetching docs', err.message);
        next(err); 
    }
});


app.get('/collections1/:collectionName', async function(req, res, next) {
  try{
    // const results = await req.collection.find({},{limit:3,sort:{price:-1}}).toArray();
    mongodbAccess.getCollection(req.params.collectionName).then((results) => {
      // console.log('Retrived data:', results);
      res.json(results);
    });
  }
  catch(err){
    console.error('Error fetching docs', err.message);
    next(err); 
}
 
});

app.get('/collections/:collectionName/:max/:sortAspect/:sortAscDesc', async function(req, res, next){
  try{


var max = parseInt(req.params.max, 10);
let sortDirection = 1;
if (req.params.sortAscDesc === "desc") {
 sortDirection = -1;
}
    const results = await req.collection.find({},{limit:max,sort:{[req.params.sortAspect]:sortDirection}}).toArray();

    console.log('Retrived data:', results);
    
    res.json(results);

  }
  catch(err){
    console.error('Error fetching docs', err.message);
    next(err); 
}
    
});

app.get('/collections/:collectionName/:id' , async function(req, res, next) {
  try{
    const results = await req.collection.findOne({_id:newObjectId(req.params.id)});

    console.log('Retrived data:', results);

    res.json(results);

  }
  catch(err){
    console.error('Error fetching docs', err.message);
    next(err); 
}
    
});

app.post('/collections/:collectionName', async function(req, res, next) {
  try {

    console.log('Received request: ', req.body);

    const results = await req.collection.insertOne(req.body);

    console.log("Inserted documents:", results);

    res.json(results);

} catch (err) {
    console.error('Error fetching docs', err.message);
    next(err); 
}
});

app.delete('/collections/:collectionName/:id', async function(req, res, next) {
  try {
    console.log('Received request: ', req.params.id);

    const results = await req.collection.deleteOne( {_id: new ObjectId(req.params.id)} );

    console.log("Deleted data:", results);  

    res.json((results.deletedCount === 1) ? {msg: 'success'} : {msg: 'error'});
  } 
  catch (err) {
      console.error('Error fetching docs', err.message);
      next(err); 
  }
});

app.put('/collections/:collectionName/:id', async function(req, res, next) {
  try {
    console.log('Received request: ', req.params.id);

    const results = await req.collection.updateOne( {_id: new ObjectId(req.params.id)},
    {$set:req.body}
   );

    console.log("Updated data:", results);  

    res.json((results.matchedCount === 1) ? {msg: 'success'} : {msg: 'error'});
  } 
  catch (err) {
      console.error('Error fetching docs', err.message);
      next(err); 
  }
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'An error occurred' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  app.get("/search/:searchValue", async function(req, res, next) {
    try {
      // const results = await req.collection.find({$text:{$search:req.params.searchValue}}).toArray();
      // console.log("Results fetched:", results);
      // res.json(results);
      mongodbAccess.search(req.params.searchValue).then((results) => {
        console.log("Results fetched:", results);
        res.json(results);
      });
    } catch (err) {
      console.error("Error fetching docs", err.message);
      next(err);
    }
  });