import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'search-reports',
  templateUrl: 'search-reports.widget.html',
  styleUrls: ['search-reports.widget.css'],
  standalone: true,
  imports: [MatExpansionModule]
})
export class SearchReports {
  panelOpenState = false;
  constructor() {}
}
