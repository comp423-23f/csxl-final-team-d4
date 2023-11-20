import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';

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
  selector: 'app-coworking-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  public static Route: Route = {
    path: 'statistics',
    component: StatisticsComponent,
    title: 'Registration Statistics'
  };
  panelOpenState = false;
  queries: Query[] = [];
  public displayChart = false;
  startDate!: Date | null;
  endDate!: Date | null;
  compareStartDate!: Date | null;
  compareEndDate!: Date | null;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.retrieveQueries();
  }

  title = 'Registration statistics';
  public lineChartLabels: string[] = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  endDateFilter = (d: Date | null): boolean => {
    if (this.startDate && d) {
      return d.getTime() >= this.startDate.getTime();
    }
    return true;
  };
  endcompareDateFilter = (d: Date | null): boolean => {
    if (this.compareStartDate && d) {
      return d.getTime() >= this.compareStartDate.getTime();
    }
    return true;
  };

  private formatDateComponents(date: Date): [number, number, number] {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    return [year, month, day];
  }

  //change the the enddate time to be 23:59:59 instead of 00:00:00 after selecting end date
  onEndDateChange(event: MatDatepickerInputEvent<Date>, signal: boolean): void {
    if (signal) {
      if (event.value) {
        event.value.setHours(23, 59, 59);
        this.endDate = event.value;
      }
    } else {
      if (event.value) {
        event.value.setHours(23, 59, 59);
        this.compareEndDate = event.value;
      }
    }
  }
  getDayDifference = (start: Date, end: Date) => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };
  //method after clicking the the search, checks for alert, initilize and show graph
  fetchData(): void {
    if (!this.startDate || !this.endDate) {
      window.alert('Start date and end date cannot be empty');
      return;
    }

    if (this.startDate > this.endDate) {
      window.alert('End date cannot precede start date');
      return;
    }

    if (
      this.compareStartDate &&
      this.compareEndDate &&
      this.compareStartDate > this.compareEndDate
    ) {
      window.alert('Comparison end date cannot precede comparison start date');
      return;
    }

    this.displayChart = false;
    let mainDataRangeLength = this.getDayDifference(
      this.startDate,
      this.endDate
    );
    let compareDataRangeLength =
      this.compareStartDate && this.compareEndDate
        ? this.getDayDifference(this.compareStartDate, this.compareEndDate)
        : 0;
    let maxLength = Math.max(mainDataRangeLength, compareDataRangeLength);
    const labels = Array.from({ length: maxLength }, (_, i) => `Day ${i + 1}`);
    this.lineChartData.labels = labels;

    const [startYear, startMonth, startDay] = this.formatDateComponents(
      this.startDate
    );
    const [endYear, endMonth, endDay] = this.formatDateComponents(this.endDate);
    const mainEndpoint = `/api/coworking/statistics/get-daily?year_start=${startYear}&month_start=${startMonth}&day_start=${startDay}&year_end=${endYear}&month_end=${endMonth}&day_end=${endDay}`;

    const mainData$ = this.http.get(mainEndpoint);
    let compareData$: any;

    if (this.compareStartDate && this.compareEndDate) {
      const [compareStartYear, compareStartMonth, compareStartDay] =
        this.formatDateComponents(this.compareStartDate);
      const [compareEndYear, compareEndMonth, compareEndDay] =
        this.formatDateComponents(this.compareEndDate);
      const compareEndpoint = `/api/coworking/statistics/get-daily?year_start=${compareStartYear}&month_start=${compareStartMonth}&day_start=${compareStartDay}&year_end=${compareEndYear}&month_end=${compareEndMonth}&day_end=${compareEndDay}`;

      compareData$ = this.http.get(compareEndpoint);
    } else {
      compareData$ = of(null);
    }

    forkJoin({ mainData: mainData$, compareData: compareData$ }).subscribe({
      next: (results) => {
        const datasets = [
          {
            data: Object.values(results.mainData),
            label: 'Registration',
            fill: false,
            tension: 0.5,
            borderColor: 'pink',
            backgroundColor: 'rgba(255,0,0,0.3)'
          }
        ];

        if (results.compareData) {
          datasets.push({
            data: Object.values(results.compareData),
            label: 'Comparison',
            fill: false,
            tension: 0.5,
            borderColor: 'blue',
            backgroundColor: 'rgba(0,0,255,0.3)'
          });
        }

        this.lineChartData.datasets = datasets;
        this.displayChart = true;
      },
      error: (error) => {
        console.error('There was an error fetching the data', error);
        this.displayChart = false;
      }
    });
  }
  saveReport(): void {
    if (!this.startDate || !this.endDate) {
      window.alert('Start date and end date cannot be empty');
      return;
    }
    const reportName = window.prompt('Please name this report: ');
    if (reportName && reportName.trim() !== '') {
      // Helper function to subtract hours from a date
      const subtractHours = (date: Date, hours: number): Date => {
        return new Date(date.getTime() - hours * 60 * 60 * 1000);
      };

      const requestData = {
        name: reportName.trim(),
        start_date: subtractHours(this.startDate, 5).toISOString(),
        end_date: subtractHours(this.endDate, 5).toISOString(),
        compare_start_date: this.compareStartDate
          ? subtractHours(this.compareStartDate, 5).toISOString()
          : null,
        compare_end_date: this.compareEndDate
          ? subtractHours(this.compareEndDate, 5).toISOString()
          : null
      };
      if (requestData.start_date == null || requestData.end_date == null) {
        window.alert('Start Date or End Date cannot be empty!');
        return;
      }
      if (
        requestData.compare_end_date == null ||
        requestData.compare_start_date == null
      ) {
        requestData.compare_end_date = null;
        requestData.compare_start_date = null;
      }
      this.http
        .post<Query>('/api/coworking/queries/save-reports', requestData)
        .subscribe({

          next: (response) => {
            window.alert('Report saved successfully.');
            this.queries.push(response);
          },

          error: (error) => window.alert(error.error.detail)
        });
    } else if (reportName === '') {
      window.alert('You must enter a name for the report.');
    }
  }
  //..............for the adding widget
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

  updateShare(query: Query): void {
    query.share = !query.share; // Toggle the share state optimistically
    const endpoint = query.share ? 'update-share' : 'undo-share';
    this.http
      .get(`/api/coworking/queries/update-share/${query.name}`)
      .subscribe({
        next: (flag) => {
          if (flag) {
            window.alert('Shared successfully');
          } else {
            window.alert('Undo Share successfully');
          }
        },
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

  selectReportAndFetchData(report: Query): void {
    // Set the dates based on the selected report
    this.startDate = new Date(report.start_date);
    this.endDate = new Date(report.end_date);

    // Handle nullable compare dates
    this.compareStartDate = report.compare_start_date
      ? new Date(report.compare_start_date)
      : null;
    this.compareEndDate = report.compare_end_date
      ? new Date(report.compare_end_date)
      : null;

    // Fetch the data as if the search button was clicked
    this.fetchData();
  }
  deleteQuery(query: Query): void {
    this.http
      .delete(`/api/coworking/queries/delete-query/${query.name}`)
      .subscribe({
        next: () => {
          this.queries = this.queries.filter((q) => q.id !== query.id);
          window.alert('Query deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting query:', error);
          window.alert('Error deleting query');
        }
      });
  }

  getColor(report: Query): string {
    return report.share ? 'primary' : 'accent';
  }
}
