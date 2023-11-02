import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'John1',
      email: 'admin1@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Jane1',
      email: 'user1@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: 'pyramid chidren0',
      slug: 'pyramid chidren0',
      category: 'Chair',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698065939/pyramid_children_chair_di13af.jpg',
      price: 350,
      brand: 'Pyramid',
      countInStock: 100,
      description: 'A plastic chair for children',
      isFeatured: true,
      banner: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594094/banner2_dvibxa.jpg',
    },
    {
      name: 'pyramid chidren',
      slug: 'pyramid chidren',
      category: 'Chair',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698065939/pyramid_children_chair_di13af.jpg',
      price: 350,
      brand: 'Pyramid',
      countInStock: 100,
      description: 'A plastic chair for children',
      isFeatured: true,
      banner: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1689594059/banner1_tsl0jc.jpg',
    },
    {
      name: 'pyramid chidren chair',
      slug: 'pyramid chidren chair',
      category: 'Chair',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698065939/pyramid_children_chair_di13af.jpg',
      price: 350,
      brand: 'Pyramid',
      countInStock: 100,
      description: 'A plastic chair for children',
    },
    {
      name: 'Vida children chair',
      slug: 'Vida children chair',
      category: 'Chair',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698065949/vida_children_chair_2_oifjdt.jpg',
      price: 450,
      brand: 'Vida',
      countInStock: 20,
      description: 'A high quality plastic Chair for children ',
    },
    {
      name: 'Vida Duka',
      slug: 'Vida Duka',
      category: 'Duka',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698071308/Glass_Duka_3_ywiisy.jpg',
      price: 250,
      brand: 'Vida',
      countInStock: 100,
      description: 'A high quality medium size duka',
    },
    {
      name: 'A tall zig-zag vase',
      slug: 'A tall zig-zag vase',
      category: 'Vase',
      image: 'https://res.cloudinary.com/dxxzqmxu5/image/upload/v1698043425/vase_tz_yjiynw.jpg',
      price: 450,
      brand: 'Vase',
      countInStock: 100,
      description: 'A zid-zag shaped tall flower vase',
    },
  ],
  
};

export default data;
