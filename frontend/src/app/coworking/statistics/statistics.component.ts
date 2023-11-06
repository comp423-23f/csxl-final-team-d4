import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Route } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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
  public switchState: boolean = false;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  title = 'Registration statistics';
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Registration'
        }
      }
    }
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

  constructor() {}
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
    if (!this.switchState) {
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
      this.lineChartData.datasets = [
        {
          data: [15, 19, 10, 21, 92, 5, 90, 5, 7],
          label: 'Registration',
          fill: false,
          tension: 0.5,
          borderColor: 'pink',
          backgroundColor: 'rgba(255,0,0,0.3)'
        }
      ];

      if (this.compareStartDate && this.compareEndDate) {
        this.lineChartData.datasets.push({
          data: [0, 15, 8, 88, 79, 10, 25, 1, 0],
          label: 'Comparison',
          fill: false,
          tension: 0.5,
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.3)'
        });
      }
    } else {
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
      this.lineChartData.datasets = [
        {
          data: [65, 19, 10, 21, 12, 5, 10],
          label: 'Registration',
          fill: false,
          tension: 0.5,
          borderColor: 'pink',
          backgroundColor: 'rgba(255,0,0,0.3)'
        }
      ];

      if (this.compareStartDate && this.compareEndDate) {
        this.lineChartData.datasets.push({
          data: [0, 5, 8, 18, 9, 70, 5],
          label: 'Comparison',
          fill: false,
          tension: 0.5,
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.3)'
        });
      }
    }
    setTimeout(() => {
      this.displayChart = true;
    }, 0);
  }

  onSwitchChange(event: MatSlideToggleChange): void {
    this.switchState = event.checked;
    this.fetchData();
  }
}