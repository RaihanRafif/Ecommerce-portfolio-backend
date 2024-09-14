// server.js
const express = require('express');
const sequelize = require('./config/db'); // Import the sequelize instance
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('common'));

const userApi = require('./routes/userRoutes')
const categoryApi = require('./routes/categoryRoutes')
const productApi = require('./routes/productRoutes')
const productPhotosApi = require('./routes/productPhotoRoutes')
const wishlistApi = require('./routes/wishlistRoutes')
const orderApi = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes');
const errorHandler = require('./utils/errorHandler');




app.use("/user", userApi);
app.use('/category', categoryApi);
app.use('/product', productApi);
app.use('/productPhoto', productPhotosApi);
app.use("/user/wishlist", wishlistApi);
app.use("/order", orderApi);
app.use('/review', reviewRoutes);

app.use(errorHandler);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });