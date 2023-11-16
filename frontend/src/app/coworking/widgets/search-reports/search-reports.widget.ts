import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'search-reports',
  templateUrl: 'search-reports.widget.html',
  styleUrls: ['search-reports.widget.css'],
  standalone: true,
  imports: [MatExpansionModule]
})
export class SearchReports {
  panelOpenState = false;
  constructor(private http: HttpClient) {}
  query_name = '1-2'; // remove this line after declaring the proper input value

  updateShare() {
    console.log('frontend fucntion called');
    this.http
      .get(`/api/coworking/queries/update-share/${this.query_name}`)
      .subscribe({
        next: (response) => {
          if (response) {
            window.alert('Shared successfully');
          } else {
            window.alert('Undo Share successfully');
          }
        },
        error: (error) => window.alert(error.error.detail)
      });
  }
}
