const app = require('../app');
const {
  myEndPointMiddlewares,
} = require('../Middlewares/Route-Middlewares/expressRateLimit.middleware');
const Joi = require('joi');
const {
  processMappers,
} = require('../../../sub-systems/Microservice-1/Process-Mappers/processMappers');

// API specific Rate-limiting Middleware
app.post(
  '/myEndPoint',
  myEndPointMiddlewares.expressRateLimiterMiddleware,
  async (req, res, next) => {
    debugger;
    try {
      const schema = Joi.object({
        name: Joi.string().valid('Anirudh', 'Nayak').default(null),
        demand: Joi.string()
          .valid('Highest', 'High', 'Medium', 'Low')
          .default(null),
        myTaskStatus: Joi.string()
          .valid('Not Started', 'In Progress', 'Completed', 'Unassigned')
          .default(null),
      });
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        res.sendStatus(400);
      } else {
        const response = await processMappers.process1(validationResult.value);
        res.sendStatus(200);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  }
);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
