import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService } from '../article/article.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css'] // Corrected styleUrls
})
export class ArticleDetailsComponent implements OnInit {
  article: any;
  comments: any[] = []; // Added to hold comments

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticle(id).subscribe(
      data => {
        this.article = data;
        this.articleService.getCommentsForArticle(id).subscribe(
          commentsData => this.comments = commentsData,
          error => console.error('Erreur lors de la récupération des commentaires', error)
        );
      },
      error => console.error('Erreur lors de la récupération des détails de l\'article', error)
    );
  }
}
