## Project Overview

As a platform, WorkWhile is responsible for serving data about available shifts to workers. Imagine today that you will be implementing a piece of the system.

In particular, you'll collect data about workers and shifts and return a filtered set of relevant data.

For the purposes of this exercise, you can use the following two API endpoints to collect the data that you need and you can "return" the final list by printing to the console.

1. All future shifts

**Request:**
```http
GET https://ww-backend-project.replit.app/backend/shifts
```

**Example response:**
```javascript
{
  "shifts": [
    {
      "id": 1,
      "lat": 37.777647547986106,
      "long": -122.4050936975254,
      "name": "Company 1",
      "shift_start": "2024-12-10 20:39:03.745332",
      "shift_end": "2024-12-11 04:39:03.745332",
      "workers_requested": 5,
      "workers_scheduled": 1,
      "pay": 18.89
    },
    ...
  ]
}
```

2. Details about a user's preferences:

**Request:**
```http
GET https://ww-backend-project.replit.app/backend/user_preferences/:user_id
```

**Example response:**
```javascript
{
  "user_id": 5,
  "sort_preference": "pay",
  ...
}
```


#### Objectives

1. The basics — Write a function that returns all open shifts.
2. Implement date filtering — Workers are often looking for work in a certain time frame. Extend the function from part 1 to take optional date specification
3. Integrate the `user_preferences` endpoint:
  - The `user_preferences` endpoint returns the user's preferred sort order, either `pay` or `starts_soonest` or `starts_latest`. Use this information to sort the returned shifts.
  - The `user_preferences` endpoint will return an HTTP 404 for non-existent users or users who do not have sort preferences saved. Handle this case appropriately
4. Optimize performance — Assume that both the `shifts` and `user_preferences` endpoints can exhibit latency spikes. Implement your service to handle these varying latencies efficiently, ensuring that responses are returned as quickly as possible.
5. Implement error handling — Additionally, both endpoints can fail and return 500s. Implement your service in such a way that it can handle these errors gracefully and with retries.
6. Implement distance filtering — Extend your implementation to support distance filtering. Add parameters for `worker_lat`, `worker_long` and `max_distance` and filter accordingly.