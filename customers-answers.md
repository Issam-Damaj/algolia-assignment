# Question 1: Hello,

I'm new to search engines, and there are a lot of concepts I'm not educated on. To make my onboarding smoother, it'd help if you could provide me with some definitions of the following concepts:

Records
Indexing
I'm also struggling with understanding what types of metrics would be useful to include in the "Custom Ranking."

Cheers, George

# Answer 1
Hi George,

Thanks for the questions—happy to help clarify.

Records
A record is is one searchable item that you send to Algolia as search engine. For example, in an e-commerce site, a product (name, price, description, etc.) is one record.

Indexing
Indexing is the process of sending your records to Algolia so they become searchable. Once indexed, Algolia can instantly return and rank them when someone types a query.

Custom Ranking (what metrics to use)
Custom ranking tells Algolia how to sort results when multiple items are equally relevant.
Common examples include:
	- Popularity (sales, views, clicks)
	- Rating (higher‑rated items first)
	- Recency (newer items first)
	- Availability (in‑stock items first)

Cheers,
Issam

---

# Question 2: Hello,

Sorry to give you the kind of feedback that I know you do not want to hear, but I really hate the new dashboard design. Clearing and deleting indexes are now several clicks away. I am needing to use these features while iterating, so this is inconvenient.

Regards, Matt

# Answer 2
Hi Matt,

Thanks for the feedback, this is very helpful we appreciate you sharing it.

You’re right that clearing or deleting an index now requires an extra confirmation step. This was an intentional change on our side: these actions are destructive and irreversible, and we’ve seen users accidentally wipe production indexes with a single click. Adding a second step helps prevent those situations while we completely understand that during development and iteration, speed matters.

One idea we’ve been exploring internally — and your message supports it — is introducing a “testing mode” or “development workspace” where actions like clearing or deleting an index can be done in a single click. 

I’ve passed your feedback along to the product team, including the suggestion. If you’d like, I can share some faster alternatives like API shortcuts that let you clear or delete indexes instantly without going through the dashboard.

Thanks again for your feedback — it really does help us improve.

Regards,
Issam

---

 # Question 3: Hi,

I'm looking to integrate Algolia in my website. Will this be a lot of development work for me? What's the high level process look like?

Regards, Leo

# Answer 3
Hi Leo,

Thanks for asking, actually integrating Algolia is very straightforward, and the amount of work depends on how complex your search experience needs to be.

Here’s the high‑level process:

1. Send your data to Algolia via the API: You push your records (products, articles, listings, etc.) to Algolia using our REST API or one of our client libraries. This creates your index.

2. Install the Algolia client in your project: Depending on your stack, you can use JavaScript, React, Vue, iOS, Android, PHP, etc.

3. Build your search UI: This includes the search bar, results list, filters, and optional components like sorting or pagination.

4. Connect your UI to Algolia’s Search API: Each keystroke triggers a search request, and Algolia returns results instantly.

5. Tune relevance and ranking: You adjust ranking rules, attributes, synonyms, and filters to match your business logic.

6. Add optional features: Things like facets, geolocation, analytics, personalization.

Effort level:
Simple search: a few hours to a day
Full production search with filters and UX tuning: a few days to a couple of weeks based on complexity.

Algolia is designed to remove completely of search as a service while client focus and spend most of efforts on the frontend and UX side.

Let me know if you want examples or a quick starter template.

Regards,
Issam