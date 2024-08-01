import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  selectedArticle: Article | null = null; // Pour stocker les détails de l'article

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadArticles();

    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  loadArticles(): void {
    this.articleService.getAll().subscribe((data: Article[]) => {
      this.articles = data;
    });
  }

  openModal(editMode: boolean = false, article?: Article): void {
    this.isModalOpen = true;
    this.isEditMode = editMode;

    if (editMode && article) {
      this.articleForm.patchValue({
        title: article.title,
        body: article.body
      });
      this.currentArticleId = article.id;
    } else {
      this.articleForm.reset();
      this.currentArticleId = null;
    }
  }

  openDetailModal(article: Article): void {
    this.articleService.getArticleById(article.id).subscribe(
      (data: Article) => {
        this.selectedArticle = data;
        this.isModalOpen = true;
        this.isEditMode = false; // Mode lecture seule
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'article', error);
        alert(`Erreur lors de la récupération des détails de l'article: ${error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'}`);
      }
    );
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentArticleId = null;
    this.selectedArticle = null; // Réinitialiser les détails de l'article
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
            this.articleForm.reset();
            const index = this.articles.findIndex(a => a.id === this.currentArticleId);
            if (index !== -1) {
              this.articles[index] = res;
            }
            this.closeModal();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de l\'article', error);
            alert(`Erreur lors de la mise à jour de l'article: ${error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'}`);
          }
        );
      } else {
        this.articleService.createArticle(article).subscribe(
          (res: Article) => {
            alert("Article ajouté avec succès ☺");
            this.articleForm.reset();
            this.articles.unshift(res);
            this.closeModal();
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de l\'article', error);
            alert(`Erreur lors de l'ajout de l'article: ${error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'}`);
          }
        );
      }
    } else {
      console.error('Le formulaire est invalide');
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
        (error) => {
          console.error('Erreur lors de la suppression de l\'article', error);
          alert(`Erreur lors de la suppression de l'article: ${error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.'}`);
        }
      );
    }
  }
}
