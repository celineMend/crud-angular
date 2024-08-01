import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { Article } from './article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'https://jsonplaceholder.typicode.com';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  create: any;

  constructor(private httpClient: HttpClient) { }

  // Get all articles
  getAll():Observable<any>{
    return this.httpClient.get(this.apiUrl+'/posts/')
    .pipe(
      catchError(this.errorHandler)
    );
  }

  // Get a single article by ID
  getArticle(id: number): Observable<Article> {
    return this.httpClient.get<Article>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  // Create a new article
  createArticle(article: Article): Observable<Article> {
    return this.httpClient.post<Article>(this.apiUrl, article, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  // Update an existing article
  updateArticle(id: number, article: Article): Observable<Article> {
    return this.httpClient.put<Article>(`${this.apiUrl}/${id}`, article, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  // Delete an article
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  // Error handling
  private errorHandler(error: HttpErrorResponse) {
    console.error('An error occurred', error);
    return throwError('Something bad happened; please try again later.');
  }
}
