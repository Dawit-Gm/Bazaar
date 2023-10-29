import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

import '@fortawesome/fontawesome-free/css/all.css';
import { BsPhoneVibrate } from 'react-icons/bs';


export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);


    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
    };

    
  return (
    <Layout title={product.name}>
      <div className="mt-0 mb-3">
        <Link href="/">Back to Products</Link>
      </div>
      <div className="grid md:grid-cols-2 sm:gap-3">
        <div className="md:col-span-1">
          <Image
            src={product.image}
            alt={product.name}
            width={450}
            height={450}
            sizes="100vw"
            ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            
            <li>Description: {product.description}</li>
            <li>
             Status: {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
            </li>
           {/*<li>
              {product.rating} of {product.numReviews} reviews
            </li>*/}
          </ul>
          <div>Price:&nbsp;&nbsp;ETB&nbsp;{product.price}</div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
         
            <button
                className="primary-button"
                onClick={addToCartHandler}
              >
                Add to cart
              </button> 

              <a href="tel:2519111111" className="primary-button">
                <span style={{display: 'flex', alignItems: 'center',}}>
                <BsPhoneVibrate size={28} />
                <span style={{marginLeft: '10px'}}>2519111111</span> 
                </span>
              </a>
           </div>        
          </div>       
        </div> 
    </Layout>
    );
  }

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
