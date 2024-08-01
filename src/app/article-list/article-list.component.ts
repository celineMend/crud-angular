import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importez Router
import { ArticleService } from '../article/article.service';
import { Article } from '../article/article';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  articleForm!: FormGroup;
  isModalOpen = false;
  isEditMode = false;
  currentArticleId: number | null = null;

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe(data => {
      this.articles = data;
    });
  }

  openModal(editMode: boolean = false, article?: Article): void {
    this.isModalOpen = true;
    this.isEditMode = editMode;
    if (editMode && article) {
      this.articleForm.patchValue(article);
      this.currentArticleId = article.id;
    } else {
      this.articleForm.reset();
      this.currentArticleId = null;
    }
  }

  openDetail(article: Article): void {
    this.router.navigate(['/articles', article.id]);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentArticleId = null;
  }

  get f() {
    return this.articleForm.controls;
  }

  submit(): void {
    if (this.articleForm.valid) {
      const article: Article = this.articleForm.value;
      if (this.isEditMode && this.currentArticleId !== null) {
        this.articleService.updateArticle(this.currentArticleId, article).subscribe(
          (res: Article) => {
            alert("Article mis à jour avec succès ☺");
            this.loadArticles(); // Recharger la liste après la mise à jour
            this.closeModal();
          },
          error => alert(`Erreur lors de la mise à jour de l'article: ${error.message || 'Une erreur est survenue.'}`)
        );
      } else {
        this.articleService.createArticle(article).subscribe(
          (res: Article) => {
            alert("Article ajouté avec succès ☺");
            this.articles.unshift(res);
            this.closeModal();
          },
          error => alert(`Erreur lors de l'ajout de l'article: ${error.message || 'Une erreur est survenue.'}`)
        );
      }
    } else {
      alert('Veuillez remplir correctement le formulaire.');
    }
  }

  deleteArticle(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      this.articleService.delete(id).subscribe(
        () => {
          this.articles = this.articles.filter(article => article.id !== id);
          alert('Article supprimé avec succès');
        },
        error => alert(`Erreur lors de la suppression de l'article: ${error.message || 'Une erreur est survenue.'}`)
      );
    }
  }
}
