import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { LOADING_IMG_PATH } from '../../constants';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  imagePath = LOADING_IMG_PATH;
}
