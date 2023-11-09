import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-coworking-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  public static Route: Route = {
    path: 'statistics',
    component: StatisticsComponent,
    title: 'Registration Statistics'
  };

  public displayChart = false;
  startDate!: Date | null;
  endDate!: Date | null;
  compareStartDate!: Date | null;
  compareEndDate!: Date | null;

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

  constructor(private http: HttpClient) {}
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

    // Format dates for API endpoint
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
}
