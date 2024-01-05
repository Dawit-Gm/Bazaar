import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import GridLayout from 'react-grid-layout';

//import { incrementViews } from '../utils/product';


export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

   /* products.forEach(product => {
      incrementViews(product._id);
    })*/
  
 
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Product added to the cart');
  };

    const imageUrls = ['https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594094/banner2_dvibxa.jpg', 
                      'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594059/banner1_tsl0jc.jpg'];
  return (
    <Layout>
      <Carousel showThumbs={false} autoPlay>
        {imageUrls.map((url, index) => (
        <div key={index}>
        <img src={url} alt={`Image ${index + 1}`} />
        </div>
        ))}
      </Carousel>      
      <GridLayout className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={
              addToCartHandler
            }
          ></ProductItem>
        ))}
      </GridLayout>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
