import { HttpInterceptorFn } from '@angular/common/http';

export const retryLoginInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
