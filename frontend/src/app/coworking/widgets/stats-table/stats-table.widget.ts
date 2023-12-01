import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'stats-table',
  templateUrl: './stats-table.widget.html',
  styleUrls: ['./stats-table.widget.css']
})
export class StatsTable implements OnChanges {
  @Input() originalData_0: any[] = [];
  @Input() compareData_0: any[] = [];
  @Input() startDate!: Date | null;
  @Input() endDate!: Date | null;
  @Input() compareStartDate: Date | null = null;
  @Input() compareEndDate: Date | null = null;
  meanStayTime: string = '';
  mostCommonCheckinDay: string = '';
  mostCommonCheckinHour: string = '';
  c_meanStayTime: string = '';
  c_mostCommonCheckinDay: string = '';
  c_mostCommonCheckinHour: string = '';

  constructor(private http: HttpClient) {}
  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['startDate'] ||
      changes['endDate'] ||
      changes['compareStartDate'] ||
      changes['compareEndDate']
    ) {
      this.fetchData();
    }
  }

  get originalData(): number[] {
    return this.originalData_0.filter(
      (item): item is number => typeof item === 'number'
    );
  }

  get compareData(): number[] {
    return this.compareData_0.filter(
      (item): item is number => typeof item === 'number'
    );
  }

  get mean() {
    return {
      original:
        this.originalData.length > 0
          ? this.computeMean(this.originalData).toFixed(1)
          : 0,
      compare:
        this.compareData.length > 0
          ? this.computeMean(this.compareData).toFixed(1)
          : 0
    };
  }

  get median() {
    return {
      original:
        this.originalData.length > 0
          ? this.computeMedian(this.originalData).toFixed(1)
          : 0,
      compare:
        this.compareData.length > 0
          ? this.computeMedian(this.compareData).toFixed(1)
          : 0
    };
  }

  get sd() {
    return {
      original:
        this.originalData.length > 0
          ? this.computeSD(this.originalData).toFixed(1)
          : 0,
      compare:
        this.compareData.length > 0
          ? this.computeSD(this.compareData).toFixed(1)
          : 0
    };
  }

  get outliers() {
    return {
      original: this.findOutliers(this.originalData),
      compare: this.findOutliers(this.compareData)
    };
  }

  private computeMean(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private computeMedian(values: number[]): number {
    const sortedValues = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 !== 0
      ? sortedValues[mid]
      : (sortedValues[mid - 1] + sortedValues[mid]) / 2;
  }

  private computeSD(values: number[]): number {
    const mean = this.computeMean(values);
    return Math.sqrt(
      values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
        values.length
    );
  }

  private findOutliers(values: number[]): string[] {
    const sortedValues = [...values].sort((a, b) => a - b);

    const q1 = this.quantile(sortedValues, 0.25);
    const q3 = this.quantile(sortedValues, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outLiers = values
      .map((value, index) => {
        const isOutlier = value < lowerBound || value > upperBound;
        return isOutlier ? `Day ${index + 1}` : null;
      })
      .filter((v) => v !== null) as string[];
    return outLiers;
  }

  private quantile(sortedValues: number[], q: number): number {
    const position = (sortedValues.length - 1) * q;
    const base = Math.floor(position);
    const rest = position - base;
    if (sortedValues[base + 1] !== undefined) {
      return (
        sortedValues[base] +
        rest * (sortedValues[base + 1] - sortedValues[base])
      );
    } else {
      return sortedValues[base];
    }
  }
  subtractHours = (date: Date, hours: number): Date => {
    return new Date(date.getTime() - hours * 60 * 60 * 1000);
  };
  fetchData(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    const start_date = this.subtractHours(this.startDate, 5).toISOString();
    const end_date = this.subtractHours(this.endDate, 5).toISOString();
    const compare_start_date = this.compareStartDate
      ? this.subtractHours(this.compareStartDate, 5).toISOString()
      : null;
    const compare_end_date = this.compareEndDate
      ? this.subtractHours(this.compareEndDate, 5).toISOString()
      : null;
    this.http
      .get<any>(`/api/statistics/get_stats/${start_date}/${end_date}`)
      .subscribe({
        next: (data) => {
          this.meanStayTime = data.mean_stay_time.split('.')[0];
          this.mostCommonCheckinDay = String(data.most_common_checkin_day);
          this.mostCommonCheckinHour = String(data.most_common_checkin_hour);
        },
        error: (err) => {
          console.error('Error fetching origin data: ', err);
        }
      });
    if (compare_end_date != null && compare_start_date != null) {
      this.http
        .get<any>(
          `/api/statistics/get_stats/${compare_start_date}/${compare_end_date}`
        )
        .subscribe({
          next: (data) => {
            this.c_meanStayTime = data.mean_stay_time.split('.')[0];
            this.c_mostCommonCheckinDay = String(data.most_common_checkin_day);
            this.c_mostCommonCheckinHour = String(
              data.most_common_checkin_hour
            );
          },
          error: (err) => {
            console.error('Error fetching compare data: ', err);
          }
        });
    }
  }
}
