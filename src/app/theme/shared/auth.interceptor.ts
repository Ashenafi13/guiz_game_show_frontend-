import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.getToken();

    console.log('🔐 Auth Interceptor - URL:', req.url);
    console.log('🔑 Token from localStorage:', token);

    // Skip adding token for login endpoint
    if (req.url.includes('/login')) {
      console.log('⏭️ Skipping token for login endpoint');
      return next.handle(req);
    }

    // Clone the request and add authorization header if token exists
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Request with Authorization header:', clonedRequest.headers.get('Authorization'));
      return next.handle(clonedRequest);
    } else {
      console.warn('⚠️ No token found in localStorage!');
    }

    return next.handle(req);
  }
}

