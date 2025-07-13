import express from 'express'
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Kit from './models/kit.mjs';

dotenv.config();

const app = express();
const PORT = 5000;

// Initialize session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize cart in session if it doesn't exist
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

app.use(express.json());  
app.use(express.static('niceKits'));// Routes
// const productRoutes = require('./routes/products');
// app.use('/api/products', productRoutes);   

dotenv.config();
// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

//landing
app.get('/', async (req, res) =>{
    res.sendFile('index.html', {root: 'niceKits'});
});

app.get('/api/hot-selections', async (req, res) =>{
   try{
    console.log('Fetching hot kits...');
    const hotKits = await Kit.find({
        $expr: {
            $lte: [
                { 
                    $reduce: {
                        input: "$stock",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this"]}
                    }
                }, 
                12
            ]
        }
    }); 
    console.log('Hot kits fetched:', hotKits.length);
    res.json(hotKits);
   }catch(error){
    console.error('Error fetching hot kits:', error);
    res.status(500).json({message: error.message});
   }
});

app.get('/api/kit-info', async (req, res) =>{
    try{
        console.log('Fetching kit info...');
        const kitId = req.query.id;
        
        if(!kitId){
            return res.status(400).json({message: 'Kit ID is required'});
        }
        
        console.log('Looking for kit with ID:', kitId);
        const item = await Kit.findById(kitId);
        
        if(!item){
            return res.status(404).json({message: 'Item not found'});
        }
        
        res.json(item);
      
    }catch(error){
        console.error('Error fetching kit info:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/new-arrivals', async (req, res) =>{
    try{
        console.log('Fetching new arrivals...');
        // Find kits added after June 15, 2025
        const june15Date = new Date('2025-06-15');
        console.log('june15Date:', june15Date);
        const newArrivals = await Kit.find({dateAdded: {$gt: june15Date}});
        console.log('New arrivals fetched:', newArrivals.length);
        res.json(newArrivals);
    }catch(error){
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/player-kits', async (req, res) =>{
    try{
        console.log('Fetching player kits...');
        const playerName = req.query.name;
        console.log('Fetching player kits for:', playerName);   
        const playerKits = await Kit.find({players: {$in: [playerName]}});
        console.log('Player kits fetched:', playerKits.length);
        res.json(playerKits);
    }catch(error){
        console.error('Error fetching player kits:', error);
        res.status(500).json({message: error.message}); 
    }
});

app.get('/api/all-kits', async (req, res) =>{
    try{
        console.log('Fetching all kits...');
        const allKits = await Kit.find();
        console.log('All kits fetched:', allKits.length);
        res.json(allKits);
    }catch(error){
        console.error('Error fetching all kits:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/sort-kits/:sortby', async (req, res) =>{
    try{
        const sortOrder = req.params.sortby.toLowerCase();
        let sortedKits = [];
        console.log('Sorting kits by:', sortOrder);
        if(sortOrder === 'a to z'){
            //sort the kits alphabetically
            sortedKits = await Kit.find().sort({name: 1});
        }else if(sortOrder === 'z to a'){
            //sort the kits alphabetically in reverse
            sortedKits = await Kit.find().sort({name: -1});
        }else {
            // no sort
            sortedKits = await Kit.find();
        }
          
        console.log('Sorted kits:', sortedKits.length);
        res.json(sortedKits);   
    }catch(error){
        console.error('Error sorting kits:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/search-kits', async (req, res) =>{
    try{
        const searchInput = req.query.search;
        console.log('Searching for kits:', searchInput);
        
        
        const regex = new RegExp(searchInput, 'i'); //make it case insensitive
        const searchResults = await Kit.find({name: {$regex: regex}});
        console.log('Search results:', searchResults.length);
        res.json(searchResults);
    }catch(error){
        console.error('Error searching kits:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/collections', async (req, res) =>{
    try{
        const category = req.query.category;
        let kits;
        if(category === 'hot'){
         kits = await Kit.find({
                $expr: {
                    $lte: [
                        { 
                            $reduce: {
                                input: "$stock",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this"]}
                            }
                        }, 
                        12
                    ]
                }
            });
        }else{
        console.log('Fetching kits for category:', category);
         kits = await Kit.find({category: category});
        }
        console.log('Kits fetched:', kits.length);
        res.json(kits);
    }catch(error){
        console.error('Error fetching kits:', error);   
        res.status(500).json({message: error.message});
    }
});


app.get('/api/add-to-cart', async (req, res) =>{
    try{
        console.log('Adding to cart...');
        const kitId = req.query.id;
        const size = req.query.size;
        const addon = req.query.addon;
        console.log('addon:', addon);
        if(!kitId){
            return res.status(400).json({message: 'Kit ID is required'});
        }
        
        const kit = await Kit.findById(kitId);
        console.log('Kit found:', kit);
        
        if(!kit){
            return res.status(404).json({message: 'Kit not found'});
        }
        
        // Add kit to cart with size and addon information
        const cartItem = {
            ...kit.toObject(),
            selectedSize: size,
            selectedAddon: addon,
            quantity: 1
        };
        
        req.session.cart.push(cartItem);
        console.log('Cart updated:', req.session.cart);
        
        res.json(req.session.cart);
    }catch(error){
        console.error('Error adding to cart:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/get-cart', async (req, res) =>{
    try{
        console.log('Getting cart...');
        console.log('Session cart:', req.session.cart);
        res.json(req.session.cart || []);
    }catch(error){
        console.error('Error getting cart:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/remove-from-cart', async (req, res) =>{
    try{
        console.log('Removing from cart...');
        const kitId = req.query.id;
        
        if(!kitId){
            return res.status(400).json({message: 'Kit ID is required'});
        }
        
        req.session.cart = req.session.cart.filter(item => item._id !== kitId);
        console.log('Cart after removal:', req.session.cart);
        
        res.json(req.session.cart);
    }catch(error){
        console.error('Error removing from cart:', error);
        res.status(500).json({message: error.message});
    }
});

app.get('/api/clear-cart', async (req, res) =>{
    try{
        console.log('Clearing cart...');
        req.session.cart = [];
        res.json({message: 'Cart cleared successfully'});
    }catch(error){
        console.error('Error clearing cart:', error);
        res.status(500).json({message: error.message});
    }
});

app.post('/home', async (req, res) =>{


});


  


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log(import.meta.url);