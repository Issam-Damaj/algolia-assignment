import fs from "fs";
import csv from "csv-parser";
import algoliasearch from "algoliasearch";
import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
// 1. Algolia setup
const client = algoliasearch(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_ADMIN_KEY);

const index = client.initIndex(
        process.env.ALGOLIA_INDEX_NAME);

// 2. Helpers
function safeNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

function normalizeString(value) {
    return typeof value === "string" ? value.trim() : "";
}

// Canonical payment values only
const allowedPayments = new Set(["AMEX", "Visa", "MasterCard", "Discover"]);

function transformPayments(options = []) {
    const mapping = {
        "Diners Club": "Discover",
        "Carte Blanche": "Discover",
        "American Express": "AMEX",
        AMEX: "AMEX",
        MasterCard: "MasterCard",
        Visa: "Visa",
        Discover: "Discover",
    };

    const normalized = Array.isArray(options)
         ? options
         : typeof options === "string"
         ? options.split(",").map(s => s.trim())
         : [];

    return [
        ...new Set(
            normalized
            .map(opt => mapping[opt])
            .filter(opt => allowedPayments.has(opt))),
    ];
}

// 3. Load CSV
async function loadCSV(path) {
    return new Promise((resolve, reject) => {
        const map = {};

        fs.createReadStream(path)
        .pipe(csv({
                separator: ";"
            }))
        .on("data", (row) => {
            if (!row.objectID)
                return;
            map[row.objectID] = row;
        })
        .on("end", () => resolve(map))
        .on("error", reject);
    });
}

// 4. Merge logic
function mergeRecords(jsonData, csvData) {
    return jsonData.map((rest) => {
        const extra = csvData[rest.objectID] || {};

        return {
            objectID: rest.objectID,

            // Core
            name: normalizeString(rest.name || extra.name),
            food_type: normalizeString(rest.food_type || extra.food_type),

            // Ratings
            stars_count: safeNumber(extra.stars_count || rest.stars_count),
            reviews_count: safeNumber(extra.reviews_count || rest.reviews_count),

            // Location
            neighborhood: normalizeString(extra.neighborhood || rest.neighborhood),
            address: normalizeString(rest.address || extra.address),
            city: normalizeString(rest.city || extra.city),
            state: normalizeString(rest.state || extra.state),
            country: normalizeString(rest.country || extra.country),
            postal_code: normalizeString(rest.postal_code || extra.postal_code),
            area: normalizeString(rest.area || extra.area),

            // Contact
            phone_number: normalizeString(
                rest.phone_number || extra.phone || extra.phone_number),

            // Pricing
            price_range: normalizeString(rest.price_range || extra.price_range),
            price: safeNumber(rest.price || extra.price),
            dining_style: normalizeString(rest.dining_style || extra.dining_style),

            // Payments
            payment_options: transformPayments(
                rest.payment_options || extra.payment_options || []),

            // Geo
            _geoloc:
            rest._geoloc && typeof rest._geoloc.lat === "number"
             ? rest._geoloc
             : extra._geoloc || null,

            // UI fields
            image_url: rest.image_url || extra.image_url || null,
            mobile_reserve_url:
            rest.mobile_reserve_url || extra.mobile_reserve_url || null,
            reserve_url: rest.reserve_url || extra.reserve_url || null,
        };
    });
}

// 5. Indexing
async function indexData(records) {
    console.log(`Indexing ${records.length} records...`);

    // clean index before push
    await index.clearObjects();

    const {
        objectIDs
    } = await index.saveObjects(records);

    console.log(`Indexed ${objectIDs.length} restaurants`);
}

// 6. MAIN PIPELINE
async function runPipeline() {
    try {
        console.log("Starting Indexing pipeline...");

        await index.setSettings({
            searchableAttributes: ["name", "food_type", "neighborhood"],
            attributesForFaceting: [
                "food_type",
                "payment_options",
                "stars_count",
            ],
        });

        const jsonData = JSON.parse(
                fs.readFileSync("../dataset/restaurants_list.json", "utf8"));

        const csvData = await loadCSV(
                "../dataset/restaurants_info.csv");

        console.log(`Loaded JSON: ${jsonData.length}, CSV: ${Object.keys(csvData).length}`);

        const merged = mergeRecords(jsonData, csvData);

        // safety check before indexing
        const invalidPayments = merged.filter(r =>
                r.payment_options.some(p => !allowedPayments.has(p)));

        if (invalidPayments.length > 0) {
            console.warn(`Found invalid payment normalization cases: ${invalidPayments.length}`);
        }

        await indexData(merged);

        console.log("Indexing completed successfully");
    } catch (err) {
        console.error("Indexing failed:", err);
    }
}

runPipeline();
