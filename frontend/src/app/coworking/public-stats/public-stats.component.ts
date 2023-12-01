import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Query } from '../coworking.models';
import { Route } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Profile, ProfileService } from '../../profile/profile.service';

@Component({
  selector: 'app-public-stats',
  templateUrl: './public-stats.component.html',
  styleUrls: ['./public-stats.component.css']
})
export class PublicStatsComponent implements OnInit {
  profile: Profile | undefined;
  personalselectedQuery: Query | null = null;
  personalQueries: Query[] = [];
  selectedQuery: Query | null = null;
  sharedQueries: Query[] = [];
  displayChart = false;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;

  ngOnInit(): void {
    this.retrieveSharedQueries();
  }
  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {
    this.profileService.profile$.subscribe((profile: Profile | undefined) => {
      if (profile) {
        this.profile = profile;
      }
    });
  }
  public static Route: Route = {
    path: 'public-stats',
    component: PublicStatsComponent,
    title: 'Public Statistics'
  };

  retrieveSharedQueries(): void {
    this.http.get<Query[]>('/api/admin/queries/get_shared_queries').subscribe({
      next: (response) => {
        this.sharedQueries = response;
      },
      error: (error) => console.error('Error retrieving shared queries:', error)
    });
  }

  fetchDataForQuery(query: Query): void {
    if (!query.start_date || !query.end_date) {
      window.alert('Start date and end date cannot be empty');
      return;
    }

    this.displayChart = false;
    const startDate = new Date(query.start_date);
    const endDate = new Date(query.end_date);
    const compareStartDate = query.compare_start_date
      ? new Date(query.compare_start_date)
      : null;
    const compareEndDate = query.compare_end_date
      ? new Date(query.compare_end_date)
      : null;

    let mainDataRangeLength = this.getDayDifference(startDate, endDate);
    let compareDataRangeLength =
      compareStartDate && compareEndDate
        ? this.getDayDifference(compareStartDate, compareEndDate)
        : 0;

    let maxLength = Math.max(mainDataRangeLength, compareDataRangeLength);
    this.lineChartData.labels = Array.from(
      { length: maxLength },
      (_, i) => `Day ${i + 1}`
    );

    const [startYear, startMonth, startDay] =
      this.formatDateComponents(startDate);
    const [endYear, endMonth, endDay] = this.formatDateComponents(endDate);
    const mainEndpoint = `/api/coworking/statistics/get_daily?year_start=${startYear}&month_start=${startMonth}&day_start=${startDay}&year_end=${endYear}&month_end=${endMonth}&day_end=${endDay}`;

    const mainData$ = this.http.get(mainEndpoint);
    let compareData$: any;

    if (compareStartDate && compareEndDate) {
      const [compareStartYear, compareStartMonth, compareStartDay] =
        this.formatDateComponents(compareStartDate);
      const [compareEndYear, compareEndMonth, compareEndDay] =
        this.formatDateComponents(compareEndDate);
      const compareEndpoint = `/api/coworking/statistics/get_daily?year_start=${compareStartYear}&month_start=${compareStartMonth}&day_start=${compareStartDay}&year_end=${compareEndYear}&month_end=${compareEndMonth}&day_end=${compareEndDay}`;

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

  private getDayDifference(
    startDate: Date | null,
    endDate: Date | null
  ): number {
    if (startDate == null || endDate == null) {
      return 0;
    }
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private formatDateComponents(date: Date): [number, number, number] {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day];
  }

  selectQueryAndFetchData(query: Query | null): void {
    if (query == null) {
      return;
    }
    this.fetchDataForQuery(query);
  }
}
