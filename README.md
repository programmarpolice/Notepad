# Guided Practice - Notepad

This repo contains a barebones API that tracks a list of notes. In this guided practice, you'll set up error handling middleware and refactor the existing routes into a separate router.

## Getting Started

1. Create a new repository using this one as a template.
2. Clone down your repository and run `npm install` to install the dependencies.
3. Start the development server with `npm run dev`.
4. Test the requests in `.http`. They should all be working, _except_ for the POST request!

## Adding Middleware

1. Right before `app.listen`, add a catch-all middleware that calls `next` with a status of 404 and the message "Endpoint not found". This will be the default 404 middleware.

   <details>
   <summary>See solution</summary>

   ```js
   app.use((req, res, next) => {
     next({ status: 404, message: "Endpoint not found." });
   });
   ```

  </details>

2.  Right _after_ your new 404 middleware but _before_ `app.listen`, add a default error-handling middleware. Log the error to the console with `console.error`. The response status should default to 500, unless the error has a status. Similarly, the response message should default to "Sorry, something went wrong!", unless the error has a message.

    <details>
    <summary>See solution</summary>

    ```js
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(err.status ?? 500);
      res.json(err.message ?? "Sorry, something went wrong!");
    });
    ```

    </details>

3.  The handlers for `GET /notes/:id` and `POST /notes` directly send an error response when the request fails. Refactor them to call `next` instead with the corresponding status and message.

    <details>
    <summary>See solution</summary>

    ```diff
    - res.status(404).send(`Note with id ${id} does not exist.`);
    + next({ status: 404, message: `Note with id ${id} does not exist.` });
    ```

    ```diff
    - res.status(400).send(`New note must have text.`);
    + next({ status: 400, message: `New note must have text.` });
    ```

    </details>

4.  Add middleware near the _top_ of the file to parse JSON. The `POST` request in `.http` should now work.

    <details>
    <summary>See solution</summary>

    ```js
    app.use(express.json());
    ```

    </details>

At this point, every request in `.http` should work. Add more requests to make sure errors are handled correctly!

## Refactoring to Router

1. In `api/notes.js`, create a new Express Router and export it.

   <details>
   <summary>See solution</summary>

   ```js
   const express = require("express");
   const router = express.Router();
   module.exports = router;
   ```

   </details>

2. Remove the `notes` import from `server.js`. Import the `notes` array into `api/notes.js` instead.

   <details>
   <summary>See solution</summary>

   ```js
   const notes = require("../data/notes");
   ```

   </details>

3. Move the 3 `/notes` middleware from `server.js` into `api/notes.js`. Use the `router` variable instead of `app`, and remove `/notes` from the path of each middleware.

   <details>
   <summary>See solution</summary>

   ```js
   router.get("/", (req, res) => {
     // unchanged
   });

   router.get("/:id", (req, res, next) => {
     // unchanged
   });

   router.post("/", (req, res, next) => {
     // unchanged
   });
   ```

   </details>

4. In `server.js`, where the `/notes` middleware used to be, add middleware to route `/notes` to the router exported from `api/notes.js`.

   <details>
   <summary>See solution</summary>

   ```js
   app.use("/notes", require("./api/notes"));
   ```

   </details>

5. Test the requests in `.http` to ensure that they all still work.

## Solution

The final solution code can be viewed in the `solution` branch of the starter repository.
