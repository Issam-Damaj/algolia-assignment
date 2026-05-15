# Question 1: Hello,

I'm new to search engines, and there are a lot of concepts I'm not educated on. To make my onboarding smoother, it'd help if you could provide me with some definitions of the following concepts:

Records
Indexing
I'm also struggling with understanding what types of metrics would be useful to include in the "Custom Ranking."

Cheers, George

# Answer 1
Hi George,

Thanks for the questions, happy to help clarify.

Records
A record is is one searchable item that you send to Algolia as search engine. For example, in an e-commerce site, each product (name, price, description, etc.) is one record.

Indexing
Custom ranking helps Algolia decide how to order results when multiple records are similarly relevant to a query.

Common ranking metrics include:
- Popularity (sales, clicks, views)
- Ratings or reviews
- Recency (newer content first)
- Availability (in-stock items first)

Cheers,
Issam

---

# Question 2: Hello,

Sorry to give you the kind of feedback that I know you do not want to hear, but I really hate the new dashboard design. Clearing and deleting indexes are now several clicks away. I am needing to use these features while iterating, so this is inconvenient.

Regards, Matt

# Answer 2
Hi Matt,

Thanks for the feedback, we really appreciate you sharing it.

You’re right that clearing or deleting an index now requires an extra confirmation step. This was an intentional change because these actions are destructive and irreversible, and we’ve seen cases where users accidentally removed production indexes.

That said, we completely understand that during development and iteration, speed matters.

One idea we’ve been discussing internally — and your feedback supports it — is introducing a testing/development mode where actions like clearing or deleting indexes could be done more quickly.

I’ve passed your feedback along to the product team, including your suggestion. In the meantime, if helpful, I can also share API-based alternatives that can speed up these operations during development.

Thanks again for taking the time to share your thoughts.

Regards,
Issam

---

 # Question 3: Hi,

I'm looking to integrate Algolia in my website. Will this be a lot of development work for me? What's the high level process look like?

Regards, Leo

# Answer 3
Hi Leo,

Thanks for reaching out.

Integrating Algolia is usually very straightforward, and the amount of development work mainly depends on how advanced you want the search experience to be.

At a high level, the process looks like this:

1. Send your data to Algolia
You upload your records (products, articles, listings, etc.) using the API or one of Algolia’s client libraries.

2. Add the Algolia client to your application
Algolia provides libraries for JavaScript, React, Vue, PHP, iOS, Android, and more.

3. Build the search experience
This typically includes the search bar, search results, filters, sorting, and pagination.

4. Connect the UI to Algolia
As users type, your application sends queries to Algolia and displays results in real time.

5. Tune relevance
You can customize ranking, synonyms, filters, and other settings to improve search quality.

You can also add advanced features like geolocation, analytics, or personalization later on if needed.

In terms of effort:
- A basic integration can take a few hours
- A more advanced production-ready search experience may take a few days depending on complexity

Algolia is designed to remove completely of search as a service while client focus and spend most of efforts on the frontend and UX side.

Let me know if you'd like a starter example or implementation guidance.

Regards,
Issam