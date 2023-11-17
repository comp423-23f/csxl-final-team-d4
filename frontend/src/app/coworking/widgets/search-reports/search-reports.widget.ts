
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Query {
  id: number;
  name: string;
  start_date: Date;
  end_date: Date;
  compare_start_date?: Date;
  compare_end_date?: Date;
  share: boolean;
}
@Component({
  selector: 'search-reports',
  templateUrl: './search-reports.widget.html',
  styleUrls: ['./search-reports.widget.css']
})
export class SearchReports implements OnInit {
  panelOpenState = false;
  queries: Query[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveQueries();
  }

  retrieveQueries(): void {
    this.http.get<Query[]>('/api/coworking/queries/get-all-queries').subscribe({
      next: (response) => {
        this.queries = response.map((query) => ({
          ...query,
          start_date: new Date(query.start_date),
          end_date: new Date(query.end_date),
          compare_start_date: query.compare_start_date
            ? new Date(query.compare_start_date)
            : undefined,
          compare_end_date: query.compare_end_date
            ? new Date(query.compare_end_date)
            : undefined
        }));
      },
      error: (error) => console.error('Error retrieving queries:', error)
    });
  }

  saveReport(
    reportName: string,
    startDate: Date,
    endDate: Date,
    compareStartDate?: Date,
    compareEndDate?: Date
  ): void {
    if (reportName) {
      const requestData = {
        name: reportName,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        compare_start_date: compareStartDate
          ? compareStartDate.toISOString()
          : null,
        compare_end_date: compareEndDate ? compareEndDate.toISOString() : null
      };
      this.http
        .post('/api/coworking/queries/save-reports', requestData)
        .subscribe({
          next: () => window.alert('Report saved successfully.'),
          error: (error) => window.alert(error.error.detail)
        });
    } else {
      window.alert('You must enter a name for the report.');
    }
  }

  updateShare(query: Query): void {
    query.share = !query.share; // Toggle the share state optimistically
    const endpoint = query.share ? 'update-share' : 'undo-share';
    this.http.get(`/api/coworking/queries/${endpoint}/${query.id}`).subscribe({
      next: () =>
        console.log(
          `Share status updated successfully for query ID: ${query.id}`
        ),
      error: (error) => {
        console.error('Error updating share status:', error);
        query.share = !query.share; // Revert the share state on error
        window.alert(error.error.detail);
      }
    });
  }

  formatDates(query: Query): string {
    const startDate = query.start_date.toLocaleDateString();
    const endDate = query.end_date.toLocaleDateString();
    let compareDates = '';
    if (query.compare_start_date && query.compare_end_date) {
      const compareStartDate = query.compare_start_date.toLocaleDateString();
      const compareEndDate = query.compare_end_date.toLocaleDateString();
      compareDates = `, compare: ${compareStartDate} to ${compareEndDate}`;
    }
    return `${query.name}, original: ${startDate} to ${endDate}${compareDates}`;
  }
}
