import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArticleService } from '../article/article.service';
import { Article } from '../article/article';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  [x: string]: any;
  articles: Article[] = [];
  articleForm!: FormGroup;
  isEditMode: boolean | undefined;
  article: Article | undefined;

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getAll().subscribe((data: Article[]) => {
      this.articles = data;
      console.log(this.articles);
    });

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  deleteArticle(articleId: number): void {
    this.articleService.delete(articleId).subscribe(() => {
      // Gérer la suppression réussie
      this.articles = this.articles.filter(item => item.id !== articleId);
    }, error => {
      // Gérer l'erreur
      console.error('Erreur lors de la suppression de l\'article', error);
    });
  }

  get f() {
    return this.articleForm.controls;
  }

  submit(): void {
    if (this.articleForm.valid) {
      const article: Article = this.articleForm.value;
      this.articleService.createArticle(article).subscribe(
        (res: any) => {
          alert("Article ajouté avec succès ☺");
          this.articleForm.reset(); // Réinitialiser le formulaire
          this.articles.push(res); // Ajouter l'article à la liste
          localStorage.setItem('articles', JSON.stringify(this.articles)); // Sauvegarder dans le localStorage
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'article', error);
          alert(`Erreur lors de l'ajout de l'article: ${error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'}`);
        }
      );
    } else {
      console.error('Le formulaire est invalide');
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

}
