import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  imports: [IconFieldModule, InputIconModule, InputTextModule, TranslateModule ]
})
export class SearchComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    this.router.navigateByUrl(`/search/${value}`);
  }
}
