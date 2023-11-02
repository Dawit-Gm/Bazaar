import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}> 
        <Image
            src={product.image}
            alt={product.name}
            width={450}
            height={450}
            sizes="100vw"
        ></Image>
      </Link>
      <div className="flex flex-col">
        <Link href={`/product/${product.slug}`}> 
        <p className="text-lg text-left cardname"> 
         {product.name}</p>
         </Link> 
         <p className="text-left price">ETB&nbsp;&nbsp;{product.price}&nbsp;&nbsp; 
         <span
            className="add-cart"
            onClick={() => addToCartHandler(product)}
             >
            Add to cart
           </span></p>
            
      </div>
    </div>
  );
}





