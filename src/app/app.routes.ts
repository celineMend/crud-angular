import { Routes } from '@angular/router';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import {  ArticleFormComponent } from'./article-form/article-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' }, // Redirection vers la liste des articles par défaut
  { path: 'articles', component: ArticleListComponent }, // Route pour la liste des articles
  { path: 'articles/:id', component: ArticleDetailsComponent }, // Route pour les détails d'un article (avec un paramètre d'identifiant)
  { path: 'create', component: ArticleFormComponent }, // Route pour le formulaire de création d'article
  { path: 'articles/edit/:id', component: ArticleFormComponent }

];
