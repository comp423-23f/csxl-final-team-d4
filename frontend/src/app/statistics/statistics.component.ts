import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  public displayChart = false;
  startDate!: Date | null;
  endDate!: Date | null;
  title = 'Registration statistics';
  public lineChartLabels: string[] = [];
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Registration',
        fill: false,
        tension: 0.5,
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  public lineChartLegend = true;

  endDateFilter = (d: Date | null): boolean => {
    if (this.startDate && d) {
      return d.getTime() > this.startDate.getTime();
    }
    return true;
  };

  constructor() {}
  onEndDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      event.value.setHours(23, 59, 59);
      this.endDate = event.value;
    }
  }
  fetchData(): void {
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        window.alert('Enddate cannot precede startDate');
      }
    } else {
      window.alert('StartDate and endDate cannot be empty');
    }
    console.log(this.startDate);
    console.log(this.endDate);
    this.displayChart = false;
    this.lineChartLabels = [
      '10-1',
      '10-2',
      '10-3',
      '10-4',
      '10-5',
      '10-6',
      '10-7'
    ];
    this.lineChartData.labels = this.lineChartLabels;
    this.lineChartData.datasets[0].data = [15, 9, 10, 21, 6, 5, 20];
    setTimeout(() => {
      this.displayChart = true;
    }, 0);
  }
}
