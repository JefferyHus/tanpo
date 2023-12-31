Certainly! Here's the updated markdown documentation with TypeScript usage examples for each utility function:

---

# Logger Utilities Documentation

## Overview
The logger utilities provide robust error logging and handling capabilities, integrated with Winston for local logging and Sentry for remote error tracking.

## Main Functions

### `logger`
- **Purpose**: Logs errors or information based on specified log levels.
- **Usage Example**:
  ```typescript
  import { logger, LogLevelsEnum } from '@/path/to/logger';

  try {
    // Your code here
  } catch (error) {
    logger(LogLevelsEnum.ERROR, error, { additional: 'context' });
  }
  ```

### `handleErrorMessage`
- **Purpose**: Formats an error message into a consistent structure.
- **Usage Example**:
  ```typescript
  import { handleErrorMessage } from '@/path/to/logger';

  app.use((err, req, res, next) => {
    const errorObject = handleErrorMessage(err);
    res.status(errorObject.code).json(errorObject);
  });
  ```

## Integration and Best Practices

- Integrate `logger` into catch blocks for effective error logging.
- Utilize `handleErrorMessage` to standardize the structure of error responses sent to clients.