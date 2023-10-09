
declare global {
  namespace Express {
    express: any
    interface Request {
      session?: Record<string,any>,
      'body-parser' ?: any,
      express: any
    }
  }
}