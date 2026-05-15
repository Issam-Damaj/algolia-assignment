# Algolia Restaurants Search

A custom restaurants search experience built with Vanilla JavaScript and Algolia APIs to demonstrate the benefits of a fast, intuitive, and highly customizable search experience.

This project was built as part of the Algolia Senior Solutions Engineer assignment and focuses on:
- Search UX
- Data indexing and normalization
- Custom search state management
- Geolocation-based ranking
- Faceted filtering
- Lightweight frontend architecture

---

# Deployment
The project deployed using GitHub Pages.
Live Demo:
[ADD_GITHUB_PAGES_LINK_HERE]

---

# Features
## Search Experience
- As-you-type search
- Debounced search requests
- Highlighted search results
- Pagination with "Show More"
- Search statistics
- Empty state handling
- Responsive UI
- Simple URL state synchronization

## Filters
- Cuisine / Food Type filtering
- Payment Options filtering
- Rating filtering

## Geolocation
- Uses browser geolocation to prioritize nearby restaurants

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
- Parcel

## Backend / Indexing
- Node.js
- csv-parser
- dotenv

---

# Project Structure
project/
├── .env.example
├── package.json
├── index.html
├── index.js
├── index.css
│
├── scripts/
│   └── indexing.js
│
├── dataset/
│   ├── restaurants_list.json
│   └── restaurants_info.csv
│
└── assets/

---

# Setup
## Install Dependencies
npm install

## Environment Variables
Create a `.env` file at the project root based on `.env.example`.

## Run Indexing Pipeline
npm run index

## Start Frontend Development Server
npm start

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
Accessibility improvements
Skeleton loading states
