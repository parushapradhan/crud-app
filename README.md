<div align="center"><strong>Products Admin Dashboard</strong></div>
<br />
<div align="center">
<a href="https://crud-app-eta-two.vercel.app/?tab=all">Demo</a>


<span>
</div>

## Overview
https://www.loom.com/share/b5e0b0096e984a82bdabb0284cf42985?sid=3d0bd6f6-d2ca-46e0-bc0d-ea63ad07faf4

## Features:
- Create, Read, Update, Delete products
- Form validation for product fields
- Filter and view products by status
-  Search Items


This project is using the following stack:

- Framework - [Next.js](https://nextjs.org)
- Language - [TypeScript](https://www.typescriptlang.org)
- Database - [Postgres](https://vercel.com/postgres)
- Database Hosting - [Neon](https://neon.com/)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn UI](https://ui.shadcn.com/)


## Getting Started


### Key Directories Explained:

- **`app/`** – Main app pages and API routes .  
- **`components/`** – Reusable UI components like forms, tables, badges.  
- **`lib/`** – Database setup and validation logic.  
- **`public/`** – Static files served directly.  
- **`.env.example`** – Template for required environment variables.  

Copy the `.env.example` file to `.env` and update the values of POSTGRES_URL to your postgres database url


Create a table based on the schema defined in this repository.

```
CREATE TYPE status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  name TEXT NOT NULL,
  status status NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  available_at TIMESTAMP NOT NULL
);
```

Then, uncomment `app/api/seed.ts` and hit `http://localhost:3000/api/seed` to seed the database with products.



Finally, run the following commands to start the development server:

```
pnpm install
pnpm dev
```

You should now be able to access the application at http://localhost:3000.
