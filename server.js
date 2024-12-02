var express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set('json spaces', 3);
const path = require('path');
let PropertiesReader = require("properties-reader");

let propertiesPath = path.resolve(__dirname, "./dbconnection.properties");
let properties = PropertiesReader(propertiesPath);


const dbPrefix = properties.get('db.prefix');
const dbHost = properties.get('db.host');
const dbName = properties.get('db.name');
const dbUser = properties.get('db.user');
const dbPassword = properties.get('db.password');
const dbParams = properties.get('db.params');

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `${dbPrefix}${dbUser}:${dbPassword}${dbHost}${dbParams}`;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

let db1;

async function connectDB() {
  try {
    client.connect();
    console.log('Connected to MongoDB');
    db1 = client.db('processedData');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();


app.param('collectionName', async function(req, res, next, collectionName) { 
    req.collection = db1.collection(collectionName);
    
    console.log('Middleware set collection:', req.collection.collectionName);
    next();
});

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
    const results = await req.collection.find({},{limit:3,sort:{price:-1}}).toArray();

    console.log('Retrived data:', results);
    
    res.json(results);

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