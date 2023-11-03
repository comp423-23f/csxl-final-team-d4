import { Component, Input } from '@angular/core';

@Component({
  selector: 'stats-table',
  templateUrl: './stats-table.widget.html',
  styleUrls: ['./stats-table.widget.css']
})
export class StatsTable {
  @Input() originalData_0: any[] = [];
  @Input() compareData_0: any[] = [];
  @Input() displaySignal!: boolean;

  constructor() {}

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
        this.originalData.length > 0 ? this.computeMean(this.originalData) : 0,
      compare:
        this.compareData.length > 0 ? this.computeMean(this.compareData) : 0
    };
  }

  private computeMean(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}
