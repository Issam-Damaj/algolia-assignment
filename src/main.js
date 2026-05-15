import algoliasearch from "algoliasearch";
import algoliasearchHelper from "algoliasearch-helper";

//  1. ALGOLIA SETUP
const client = algoliasearch(
        "DP83UZHF76",
        "9e30712685948f7417b06999f0a21f92");

const helper = algoliasearchHelper(client, "restaurants", {
    facets: ["food_type", "payment_options"],
    hitsPerPage: 3,

    attributesToRetrieve: [
        "name",
        "food_type",
        "neighborhood",
        "price_range",
        "reviews_count",
        "stars_count",
        "image_url"
    ]
});

helper.on("error", (err) => {
    console.error("Search error:", err);

    if (DOM.showMore) {
        DOM.showMore.disabled = false;
        DOM.showMore.innerText = "Show More";
    }
});

// 2. DOM ELEMENTS
const DOM = {
    searchInput: document.getElementById("search-input"),
    hits: document.getElementById("hits"),
    clearBtn: document.getElementById("clear-search"),
    stats: document.getElementById("stats"),
    showMore: document.getElementById("show-more"),
};

// 3. UTILITIES
function debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function updateURL(query) {
    const url = new URL(window.location);
    if (query)
        url.searchParams.set("q", query);
    else
        url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
}

//    4. SEARCH CORE
function runSearch(query) {
    helper.setQuery(query).search();
}

//    5. SEARCH EVENTS
DOM.searchInput.addEventListener(
    "input",
    debounce((e) => {
        const query = e.target.value;

        DOM.clearBtn.classList.toggle("show", query.length > 0);
        helper.setPage(0);
        runSearch(query);
        updateURL(query);
    }, 200));

DOM.clearBtn.addEventListener("click", () => {
    DOM.searchInput.value = "";
    DOM.clearBtn.classList.remove("show");
    helper.setPage(0);
    runSearch("");
    updateURL("");

    DOM.searchInput.focus();
});

DOM.showMore.addEventListener("click", () => {
    DOM.showMore.innerText = "Loading...";
    DOM.showMore.disabled = true;

    helper.nextPage().search();
});

// 6. RESULTS RENDER

helper.on("result", ({
        results
    }) => {
    renderResults(results);
    renderStats(results);
    renderFacets(results);
});

function renderResults(results) {
    const template = document.getElementById("result-template").innerHTML;
    const noResultsTemplate =
        document.getElementById("no-results-template").innerHTML;

    if (results.nbHits === 0) {
        DOM.hits.innerHTML = noResultsTemplate.replace(
                "{{query}}",
                results.query);

        DOM.stats.innerHTML = `<strong>0 results found</strong>`;
        DOM.showMore.style.display = "none";
        return;
    }

    const html = results.hits
        .map((hit) =>
            template
            .replace(
                /{{name}}/g,
                hit._highlightResult?.name?.value || `<strong>${hit.name}</strong>`)
            .replace(/{{food_type}}/g, hit.food_type || "")
            .replace(/{{neighborhood}}/g, hit.neighborhood || "")
            .replace(/{{price_range}}/g, hit.price_range || "")
            .replace(/{{reviews_count}}/g, hit.reviews_count || 0)
            .replace(/{{stars_html}}/g, renderStars(hit.stars_count))
            .replace(/{{stars_count}}/g, hit.stars_count)
            .replace(/{{image_url}}/g, hit.image_url || ""))
        .join("");

    if (results.page === 0) {
        DOM.hits.innerHTML = html;
    } else {
        DOM.hits.insertAdjacentHTML("beforeend", html);
    }

    const hasMorePages = results.page < results.nbPages - 1;

    if (results.nbPages <= 1 || !hasMorePages) {
        DOM.showMore.style.display = "none";
    } else {
        DOM.showMore.style.display = "block";
        DOM.showMore.disabled = false;
        DOM.showMore.innerText = "Show More";
    }
}

function renderStats(results) {
    if (!DOM.stats)
        return;

    DOM.stats.innerHTML = `
    <span class="stats-count">
      ${results.nbHits.toLocaleString()} restaurants found
    </span>
    <span class="stats-time">
      in ${results.processingTimeMS} ms
    </span>
  `;
}

// 7. FACETS
function renderFacets(results) {
    renderFacet(results, "food_type", "cuisine-facet", 7);
    renderFacet(results, "payment_options", "payment-facet");
    renderRatingFacet("rating-facet");
}

function renderFacet(results, attribute, containerId, limit) {
    const container = document.getElementById(containerId);
    const values = results.getFacetValues(attribute);
    if (!container || !values)
        return;

    container.innerHTML = values
        .slice(0, limit)
        .map(
            (facet) => `
      <div class="filter__label ${
            facet.isRefined ? "filter__label--active" : ""
}"
        data-attribute="${attribute}"
        data-value="${facet.name}">
        <span class="filter__label-text">${facet.name}</span>
        <span class="filter__label-number">${facet.count}</span>
      </div>
    `)
        .join("");

    attachFacetListeners(container);
}

function attachFacetListeners(container) {
    container.querySelectorAll(".filter__label").forEach((el) => {
        el.addEventListener("click", () => {
            helper
            .toggleFacetRefinement(el.dataset.attribute, el.dataset.value)
            .search();
        });
    });
}

//    8. RATING FACET
function renderRatingFacet(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
        return;

    // Read active refinement correctly
    const refinements = helper.state.numericRefinements["stars_count"] || {};
    const activeRating = refinements[">="] ? refinements[">="][0] : null;

    const ratings = [1, 2, 3, 4, 5];

    container.innerHTML = ratings
        .map(
            (r) => `
      <div class="filter__label rating-filter ${
            r === activeRating ? "filter__label--active" : ""
}"
        data-rating="${r}">
        <span class="filter__label-text">
          ${renderFacetStars(r)}
        </span>
      </div>
    `)
        .join("");

    attachRatingListeners(container, activeRating);
}

function attachRatingListeners(container, activeRating) {
    container.onclick = (e) => {
        const item = e.target.closest(".rating-filter");
        if (!item)
            return;

        const rating = Number(item.dataset.rating);

        // Clear previous refinements
        helper.clearRefinements("stars_count");

        // Toggle logic
        if (activeRating !== rating) {
            helper.addNumericRefinement("stars_count", ">=", rating);
        }

        helper.search();
    };
}

//  9. GEOLOCATION
function initGeoSearch() {
    if (!navigator.geolocation) {
        helper.setQueryParameter("aroundLatLng", undefined).search();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
        const {
            latitude,
            longitude
        } = pos.coords;
        helper.setQueryParameter("aroundLatLng", `${latitude},${longitude}`).search();
    },
        () => {
        console.warn("Geolocation denied — using default ranking.");
        helper.setQueryParameter("aroundLatLng", undefined).search();
    });

}

//   10. START APP
function initApp() {
    initGeoSearch();
}

document.addEventListener("DOMContentLoaded", initApp);

//   11. HELPERS
function renderStars(count) {
    const rating = Number(count) || 0;
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            html += `<span class="result__rating">★</span>`; // full star
        } else if (rating >= i - 0.5) {
            html += `<span class="result__rating_half">★</span>`; // half star
        } else {
            html += `<span class="result__rating_off">★</span>`; // empty star
        }
    }

    return html;
}

function renderFacetStars(rating) {
    return Array.from({
        length: 5
    }, (_, i) => {
        const active = i < rating;
        return `<span class="${
        active ? "result__rating" : "result__rating_off"
}">★</span>`;
    }).join("");
}

//   12.MOBILE FILTERS TOGGLE
const filterToggle = document.querySelector('.mobile-filter-toggle');
const filterPanel = document.querySelector('.filter');

let overlay = document.createElement('div');
overlay.classList.add('filter-overlay');
document.body.appendChild(overlay);

filterToggle.addEventListener('click', () => {
    filterPanel.classList.add('open');
    overlay.classList.add('show');
});

overlay.addEventListener('click', () => {
    filterPanel.classList.remove('open');
    overlay.classList.remove('show');
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.filter__label')) {
        filterPanel.classList.remove('open');
        overlay.classList.remove('show');
    }
});
const filterCloseBtn = document.querySelector('.filter-close-btn');

if (filterCloseBtn) {
  filterCloseBtn.addEventListener('click', () => {
    filterPanel.classList.remove('open');
    overlay.classList.remove('show');
  });
}
