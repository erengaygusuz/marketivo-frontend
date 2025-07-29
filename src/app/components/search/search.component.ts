import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  standalone: false
})
export class SearchComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
