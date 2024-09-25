import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI || "mongodb+srv://gg:gg@cluster0.4oewv.mongodb.net/";

// Global client and promise to maintain the connection pool
let cachedClient = null;
let cachedClientPromise = null;

// Function to connect to the MongoDB
async function connectToDatabase() {
  if (!cachedClientPromise) {
    const client = new MongoClient(uri);
    cachedClientPromise = client.connect();
    cachedClient = client;
  }
  return cachedClientPromise;
}

// GET method to fetch products
export async function GET() {
  try {
    const client = await connectToDatabase();
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    
    const products = await inventory.find({}).toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST method to add a new product
export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation
    // if (!body.name || typeof body.price !== 'number' || typeof body.change !== 'number') {
    //   return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    // }

    // Ensure MongoDB client connection is established
    await connectToDatabase();

    // Access the database and collection
    const database = cachedClient.db('stock');
    const inventory = database.collection('inventory');

    // Insert the new product
    const result = await inventory.insertOne(body);

    return NextResponse.json({ result, ok: true });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// DELETE method to delete a product
export async function DELETE(request) {
  try {
    // Parse the product ID from the request
    const { id } = await request.json(); // make sure id is being passed correctly

    // Ensure MongoDB client connection is established
    const client = await connectToDatabase();

    // Access the database and collection
    const database = client.db('stock');
    const inventory = database.collection('inventory');

    // Delete the product by ID
    const result = await inventory.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
