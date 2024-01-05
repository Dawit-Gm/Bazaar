import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

//import { incrementViews } from '../utils/product';


export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}
        //</div> onClick={() => incrementViews(product._id)} 
        > 
      <Image
        src={product.image[0]}
        alt={product.name}
        width={100}
        height={100}
        sizes="100vw"
        style={{
          width: '100%',
          height: '78%',
        }}
      ></Image>
      </Link>
      <div className="flex flex-col">
        <Link href={`/product/${product.slug}`}> 
        <p className="text-md text-left cardname"> 
         {product.name}</p>
         </Link> 
         <p className="text-left price">ETB&nbsp;&nbsp;{product.price}&nbsp;&nbsp; 
         <span
            className="add-cart"
            onClick={() => {
              addToCartHandler(product);
              //incrementViews(product._id);
            }}
             >
            Add to cart
           </span></p>
            
      </div>
    </div>
  );
}





