# Project Happy Thoughts API

The Happy Thoughts API is a backend API that serves as the data layer for managing and interacting with "thoughts." Users can post new thoughts, view the most recent thoughts, and "like" (increment hearts) their thoughts. This API is designed to work  with a frontend project that mimics the Happy Thoughts interface.

## The process

I started by creating a schema that mirrors the properties expected by the frontend of Happy Thoughts Vite. Each thought has the following structure:
- message: The text content of a thought which is a required string, with a minimum length of 5 characters and a maximum length of 140 characters.
- hearts: The number of "likes" (hearts) the thought has received. The default is set to 0 and can be incremented using a patch request.
- createdAt: The date when the thought was created, which has a default set to the current date and time when the thought is created.

The API includes the following routes:
- Main app "/": Displays a list of all available routes using the listEndpoints package.
- GET "/thoughts": Fetches the 20 most recent thoughts. The thoughts are sorted by their createdAt timestamp, with the newest thoughts appearing first.
- POST "/thoughts": Creates a new thought. You need to provide the message property in the request body. The hearts field is automatically set to 0 and cannot be manually set.
- PATCH "/thoughts/:id/like": Increments the hearts count by 1 for a specific thought. The thought is identified using its id in the URL path. The mongoDB $inc operator is used to increment the hearts value.

Error Handling
Error handling is implemented using a try-catch block. If any error occurs during the fetching, posting, or patching of a thought, the system will respond with an appropriate error message:

- 404: If a thought is not found when trying to patch it.
- 400: If there's an error during the creation of a thought or when updating the hearts count.

Connecting to the frontend:

First, I tested the routes using Postman to ensure they were working correctly. After that, I deployed the API to Render with MongoDB Atlas and updated the frontend to use the new URL. Both the GET and POST methods were functional, but to increment the "likes," I modified the POST request for likes to use the PATCH method instead.

During testing, I noticed that the time displayed when a thought was created was incorrect. Instead of showing "0 seconds ago," it showed "-1 seconds ago." This issue arose because my timeAgo function was not handling the time correctly. To resolve this, I switched to using the external library date-fns to handle the createdAt timestamp properly.

## View it live

https://project-happy-thoughts-api-vhov.onrender.com

