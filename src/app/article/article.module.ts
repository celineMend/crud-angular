import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ArticleService } from './article.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArticleFormComponent,
    RouterModule
  ],
  providers: [],
})
export class ArticleModule { }
