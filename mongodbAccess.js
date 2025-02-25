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
const { connect } = require('http2');

const uri = `${dbPrefix}${dbUser}:${dbPassword}${dbHost}${dbParams}`;

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function connectDB() {
  try {
    client.connect();
    console.log('Connected to MongoDB');
    client.db('processedData');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

async function getCourses(){
  try {
    const database = client.db("processedData")
    const collection = database.collection("Subjects");

    const result = await collection.find({}).toArray()
    
    return result;

  } catch (error) {
    console.error(error.message);
  }

}

async function getCollection(collectionName){
  try {
    const database = client.db("processedData")
    const collection = database.collection(collectionName);

    const result = await collection.find({}).toArray()
    
    return result;

  } catch (error) {
    console.error(error.message);
  }
}


module.exports = {connectDB, getCourses, getCollection};