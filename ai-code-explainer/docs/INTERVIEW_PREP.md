# AI Code Explainer: Interview Preparation

**1. What is GenAI?**
Generative AI is AI that creates new content (text, code, images) instead of only classifying data. Large Language Models learn patterns from huge datasets and generate answers from a prompt.

**2. What is the Gemini API?**
Google's API for its Gemini models. We send a prompt over HTTPS and get a generated response as JSON.

**3. What is an API?**
Application Programming Interface: a defined way for one program to talk to another, such as our backend calling Gemini.

**4. What is a REST API?**
An API style over HTTP using URLs for resources and methods like GET, POST, PUT, DELETE, usually exchanging JSON. Ours is `POST /api/code/explain`.

**5. Why Spring Boot?**
It removes setup work: embedded Tomcat, auto-configuration, easy REST controllers, dependency injection, and it is widely used in industry for Java jobs.

**6. How does the frontend communicate with the backend?**
With the browser Fetch API: JavaScript sends an HTTP POST with a JSON body to `http://localhost:8080/api/code/explain` and reads the JSON reply.

**7. How does the app communicate with Gemini?**
`AIService` uses Spring `RestClient` to send an HTTPS POST with the prompt and the API key header to Gemini's `generateContent` endpoint, then parses the JSON.

**8. Where is the API key stored?**
In the `GEMINI_API_KEY` environment variable on the server machine; `application.properties` reads it with `${GEMINI_API_KEY:}`.

**9. Why not expose the key in the frontend?**
Anyone can view frontend code (View Source / DevTools) and steal the key, then use my quota or incur cost. The backend acts as a safe middle layer.

**10. What happens when the user clicks Explain Code?**
JS validates the input → shows spinner → POSTs JSON → controller validates → `AIService` builds the prompt and calls Gemini → Gemini returns JSON → service maps it to `CodeResponse` → controller returns it → JS renders the cards and hides the spinner.

**11. What is JSON?**
JavaScript Object Notation: a lightweight text format of key-value pairs, used to exchange data between systems.

**12. What is a POST request?**
An HTTP method that sends data in the request body. I use it because the code can be long and shouldn't be placed in the URL.

**13. What is CORS?**
Cross-Origin Resource Sharing: a browser rule that blocks requests between different origins (different port/domain) unless the server allows it. I used `@CrossOrigin` to allow `http://localhost:5500`.

**14. What is dependency injection?**
Instead of writing `new AIService()` inside the controller, Spring creates the object (a bean) and passes it through the constructor. This gives loose coupling and easier testing.

**15. What challenges did you face?**
Examples: CORS errors between ports 5500 and 8080; keeping the API key out of the frontend; getting consistent structured output from the AI (solved with a JSON response schema); handling timeouts and API errors gracefully.

**16. How did you handle API errors?**
The controller catches `ResourceAccessException` (network/timeouts), `RestClientResponseException` (Gemini HTTP errors), and general exceptions, and returns a friendly message with the right status code. The frontend also handles network failure and invalid JSON.

**17. How can you improve it in the future?**
Add a database for history, user login, rate limiting, syntax highlighting, streaming responses, unit tests with a mocked AI service, and deployment.

**18. Why did you choose this project?**
It combines my Java/Spring Boot skills with GenAI, solves a real problem (understanding code), and shows REST APIs, frontend-backend integration, security and error handling in one small project.

**Bonus: Is the submitted code executed?**
No. It is only inserted into a text prompt and analyzed. Executing user code would be a serious security risk.

## 60-second project explanation

"My project is **AI Code Explainer**, a GenAI web app that helps beginners understand code. The user pastes code, selects a language like Java or Python, and clicks Explain Code. The frontend, written in HTML, CSS and JavaScript, sends the code as JSON to a **Spring Boot REST API** using the Fetch API. The controller validates the input, then calls an **AIService** class. That service builds a prompt, calls the **Google Gemini API** using Spring's RestClient, and receives a structured response with a simple explanation, line-by-line breakdown, time and space complexity, possible errors, and an improved version of the code. The result is returned to the frontend and shown in clean sections. I kept the **API key on the backend** in an environment variable, configured **CORS**, validated the input, and the app **never executes** the submitted code. I handled errors like empty input, network failure and API errors with friendly messages. In future I want to add a database for history, login and syntax highlighting."
