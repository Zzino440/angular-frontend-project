import {HttpInterceptorFn} from '@angular/common/http';

export const httpSecurityInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const newReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  })
  return next(newReq);
};
