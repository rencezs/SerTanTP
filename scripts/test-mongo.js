import { MongoClient } from 'mongodb';

async function testMongoConnection() {
    const uri = "mongodb+srv://AllOff123-samePass:AllOff123@cluster0.ax0xzjc.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        
        console.log('Connected successfully!');
        
        // List databases
        const adminDb = client.db('admin');
        const dbs = await adminDb.admin().listDatabases();
        console.log('Available databases:', dbs.databases.map(db => db.name));
        
        // Connect to our specific database
        const db = client.db('Admen');
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('Collections in Admen:', collections.map(c => c.name));
        
    } catch (err) {
        console.error('Connection failed:', {
            message: err.message,
            code: err.code,
            name: err.name,
            stack: err.stack
        });
    } finally {
        await client.close();
        process.exit();
    }
}

testMongoConnection(); 