import { HttpInterceptorFn } from '@angular/common/http';

export const retryLoginInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST') {}
  return next(req);
};
