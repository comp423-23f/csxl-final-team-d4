import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';

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
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        window.alert('Enddate cannot precede startDate');
      }
    } else {
      window.alert('StartDate and endDate cannot be empty');
    }
    if (
      this.compareEndDate &&
      this.compareStartDate &&
      this.compareStartDate > this.compareEndDate
    ) {
      window.alert(
        'Even if the compare is optional, it does not mean you can put end date ahead of startdate :)'
      );
    }
    this.displayChart = false;
    let mainDataRangeLength = this.getDayDifference(
      this.startDate!,
      this.endDate!
    );
    let compareDataRangeLength =
      this.compareStartDate && this.compareEndDate
        ? this.getDayDifference(this.compareStartDate!, this.compareEndDate!)
        : 0;
    let maxLength = Math.max(mainDataRangeLength, compareDataRangeLength);
    const labels: string[] = [];
    for (let i = 1; i <= maxLength; i++) {
      labels.push(`Day ${i}`);
    }
    this.lineChartData.labels = labels;
    let startYear, startMonth, startDay;
    let endYear, endMonth, endDay;
    if (this.startDate && this.endDate) {
      [startYear, startMonth, startDay] = this.formatDateComponents(
        this.startDate
      );
      [endYear, endMonth, endDay] = this.formatDateComponents(this.endDate);
    }
    const endpoint = `/api/coworking/statistics/get-daily?year_start=${startYear}&month_start=${startMonth}&day_start=${startDay}&year_end=${endYear}&month_end=${endMonth}&day_end=${endDay}`;
    let firstdata: any[] = [];
    let comparedata: any[] = [];
    this.http.get(endpoint).subscribe({
      next: (data) => {
        console.log(data);
        this.lineChartData.datasets = [
          {
            data: Object.values(data),
            label: 'Registration',
            fill: false,
            tension: 0.5,
            borderColor: 'pink',
            backgroundColor: 'rgba(255,0,0,0.3)'
          }
        ];
      },
      error: (error) => {
        console.error('There was an error fetching the data', error);
      }
    });

    if (this.compareStartDate && this.compareEndDate) {
      this.lineChartData.datasets.push({
        data: [0, 15, 8, 18, 9, 10, 25],
        label: 'Comparison',
        fill: false,
        tension: 0.5,
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.3)'
      });
    }
    setTimeout(() => {
      this.displayChart = true;
    }, 450);
  }
}
