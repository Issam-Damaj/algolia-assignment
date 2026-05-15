# Algolia Restaurants Search

A custom restaurants search experience built with Vanilla JavaScript and Algolia APIs to demonstrate the benefits of a fast, intuitive, and highly customizable search experience.

This project was built as part of the Algolia Senior Solutions Engineer assignment and focuses on:
- Search UX & relevance
- Data indexing and normalization
- Custom search state management
- Geolocation-based ranking
- Faceted filtering
- Lightweight frontend architecture

---

# GitHub Repo
The project source code under GitHub Repo.
Repo Url:
https://github.com/Issam-Damaj/algolia-assignment.git

---

# Deployment
The project deployed using GitHub Pages.
Live Demo:
https://issam-damaj.github.io/algolia-assignment/

---

# Features
## Search Experience
- As-you-type search
- Debounced requests to reduce API calls
- Highlighted search results
- Pagination with "Show More"
- Search statistics
- Empty state handling
- Responsive layout
- Basic URL state synchronization

## Filters
- Cuisine / Food Type
- Payment Options
- Rating
- Mobile‑friendly sliding filter panel

## Geolocation
- Uses browser geolocation to prioritize nearby restaurants  (when allowed)

## Data Pipeline
- Merges JSON and CSV datasets using `objectID`
- Normalizes payment methods
- Cleans numeric and string fields
- Applies Algolia index settings
- Pushes cleaned records into Algolia

---

# Architecture
The project is split into two independent parts:
## 1. Frontend Search UI
Built with Vanilla JavaScript and Algolia JS Helper.

Responsible for:
- Search state management
- Rendering results
- Faceted filtering
- Pagination
- Geolocation search behavior
- Custom UI interactions
- Mobile filter drawer

## 2. ETL / Indexing Pipeline
Built with Node.js.

Responsible for:
- Loading datasets
- Merging CSV + JSON records
- Data normalization
- Applying Algolia index settings
- Indexing records into Algolia

---

# Tech Stack
## Frontend
- Vanilla JavaScript
- Algolia Search Client
- Algolia JS Helper
- HTML/CSS

## Tooling
- Vite

## Backend / Indexing
- Node.js
- csv-parser
- dotenv

---

# Project Structure
project/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env.example
│
├── src/
│   ├── main.js
│   └── style.css
│
├── scripts/
│   └── indexing.js
│
├── dataset/
│   ├── restaurants_list.json
│   └── restaurants_info.csv
│
├── public/
│   └── (static assets)
│
├── assets/
│   └── images, icons, backgrounds
│
└── docs/
    └── (GitHub Pages deployment output)

---

# Setup
## Install Dependencies
npm install

## Environment Variables
Create a `.env` file at the project root based on `.env.example`.

## Run Indexing Pipeline
npm run index

## Start Frontend Development Server
npm run dev

# Build for deployment
npm run build

## Algolia Index Settings
The ETL pipeline configures the following settings:

searchableAttributes: [
  "name",
  "food_type",
  "neighborhood"
]

attributesForFaceting: [
  "food_type",
  "payment_options",
  "stars_count"
]

attributesToRetrieve: [
  "name",
  "food_type",
  "neighborhood",
  "price_range",
  "reviews_count",
  "stars_count",
  "image_url"
]

## Payment Normalization
Diners Club      --> Discover   
Carte Blanche    --> Discover   
American Express --> AMEX       

---

# Future Improvements
Query suggestions / autocomplete
Search analytics insights
Full URL state synchronization
Sorting functionality
