import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';
import { Article } from './article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Correction de l'URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Get all articles
  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  // Get a single article by ID
  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`http://localhost:4200/api/articles/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des détails de l\'article', error);
        return throwError(() => new Error('Une erreur est survenue lors de la récupération des détails de l\'article'));
      })
    );
  }

  // Create a new article
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  // Update an existing article
  updateArticle(id: number, article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, article, this.httpOptions).pipe(
      catchError(this.errorHandler)
    );
  }

  // Delete an article
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.errorHandler)
    );
  }

  // Error handling
  private errorHandler(error: HttpErrorResponse) {
    console.error('An error occurred', error);
    return throwError('Something bad happened; please try again later.');
  }
}
