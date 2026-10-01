import express, { type Express } from "express";
import { env } from "@config/env.js";
import { authMiddleware } from "@middleware/authMiddleware.js"
import { errorHandler } from "@middleware/errorHandler.js";
import { sessionsRouter } from "@routes/sessions/routes.js";
import { healthcheckRouter } from "@routes/healthcheck/routes.js";
import { ingredientsRouter } from "@routes/ingredients/routes.js";
import { librariesRouter } from "@routes/libraries/routes.js";
// import { recipesRouter } from "@routes/recipes/routes.js";
import { tagsRouter } from "@routes/tags/routes.js";

const app: Express = express();

app.use(express.json());

app.use("/api/sessions", sessionsRouter);

app.use(authMiddleware);
app.use("/api/healthcheck", healthcheckRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/libraries", librariesRouter);
// app.use("/api/recipes", recipesRouter);
app.use("/api/tags", tagsRouter);
// app.use("/api/users", usersRouter);

app.use(errorHandler);

app.listen(env.port, () => {
    console.log(`ForkIt-server listening on http://localhost:${env.port} (${env.nodeEnv})`)
});
