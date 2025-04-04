import Link from 'next/link';
import React from 'react';
import Image from 'next/image';


// Helper function to split name into English and Amharic parts
const splitBilingualName = (name) => {
  // Match Latin characters (English) with numbers/symbols/whitespace
  const englishPart = name.match(/[\p{Script=Latin}\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gu)?.join('')?.trim() || '';
  
  // Match Ethiopic characters (Amharic) with numbers/symbols/whitespace
  const amharicPart = name.match(/[\p{Script=Ethiopic}\d\s!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/gu)?.join('')?.trim() || '';

  return { englishPart, amharicPart };
};


 export default function ProductItem({ product, addToCartHandler }) {
  const { englishPart, amharicPart } = splitBilingualName(product.name);

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}
        > 
      <Image
        src={product.image[0]}
        alt={product.name}
        width={100}
        height={100}
        sizes="100vw"
        style={{
          width: '100%',
          height: '73%',
        }}
      ></Image>
      </Link>
      <div className="flex flex-col">
        <Link href={`/product/${product.slug}`}> 
        <div style={{ 
          width: '100%',
          margin: 0,
        }}>
          {/* English Name */}
          {englishPart && (
            <p style={{ 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}>
              {englishPart}
            </p>
          )}
          
          {/* Amharic Name */}
         {amharicPart && (
            <p style={{ 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}>
              {amharicPart}
            </p>
          )}
        </div>
         </Link> 
         <p className="text-left price">
            ETB&nbsp;&nbsp;{product.price}&nbsp;&nbsp; 
          <span
            className="add-cart"
            onClick={() => {
            addToCartHandler(product);
           }}
          >
               Add to cart
          </span></p>
      </div>
    </div>
  );
}




