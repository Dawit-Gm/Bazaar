// Import mongoose and Product model
import mongoose from 'mongoose';
import Product from '../models/Product';

export const incrementViews = async productId => {

  // Connect to db
  await mongoose.connect(process.env.MONGODB_URI);

  // Find and update product
  const product = await Product.findById(productId);
  product.numberOfViews += 1;
  await product.save();

  // Disconnect
  mongoose.disconnect();
}