import { Component, Input } from '@angular/core';

@Component({
  selector: 'stats-table',
  templateUrl: './stats-table.widget.html',
  styleUrls: ['./stats-table.widget.css']
})
export class StatsTable {
  @Input() originalData_0: any[] = [];
  @Input() compareData_0: any[] = [];

  originalData = this.originalData_0.filter(
    (item): item is number => typeof item === 'number'
  );
  compareData = this.compareData_0.filter(
    (item): item is number => typeof item === 'number'
  );

  constructor() {}

  get mean() {
    return {
      original: this.computeMean(this.originalData),
      compare: this.compareData ? this.computeMean(this.compareData) : null
    };
  }

  private computeMean(values: number[]): number {
    return values.reduce((a, b) => a + b) / values.length;
  }
}
