import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reservation } from '../coworking.models';
import { PersonalStatsSpecService } from './personal-stats-spec.service';

@Component({
  selector: 'app-personal-stats-spec',
  templateUrl: './personal-stats-spec.component.html',
  styleUrls: ['./personal-stats-spec.component.css']
})
export class PersonalStatsSpecComponent implements OnInit, OnDestroy {
  public static Route = {
    path: 'personal-stats-spec',
    component: PersonalStatsSpecComponent,
    title: 'Personal Statistics'
  };

  reservations$: Observable<Reservation[]>;
  columnsToDisplay = ['id', 'date', 'start', 'end', 'seat', 'state'];
  private refreshSubscription!: Subscription;
  timeRange: 'day' | 'week' | 'month' | 'year' = 'day';
  timeRangeOptions: string[] = ['day', 'week', 'month', 'year'];
  meanStayTime: number = 0;
  longerStayPercentage: number = 0;
  statsFetched = false;

  constructor(private personalStatsSpecService: PersonalStatsSpecService) {
    this.reservations$ = this.personalStatsSpecService.reservations$;
  }

  ngOnInit(): void {
    this.refreshSubscription = timer(0, 300000)
      .pipe(tap(() => this.fetchReservationsAndStats()))
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  fetchReservationsAndStats(): void {
    this.personalStatsSpecService.fetchReservations();
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    this.personalStatsSpecService
      .getMeanStayTime(this.timeRange)
      .subscribe((meanTime) => {
        this.meanStayTime = meanTime;
        this.statsFetched = true;
      });
    this.personalStatsSpecService
      .getLongerStayPercentage(this.timeRange)
      .subscribe((percentage) => {
        this.longerStayPercentage = percentage;
        this.statsFetched = true;
      });
  }

  changeTimeRange(newRange: 'day' | 'week' | 'month' | 'year'): void {
    this.statsFetched = false;
    this.timeRange = newRange;
    this.fetchStatistics();
  }

  getColorForPercentage(percentage: number): string {
    return percentage < 40 ? 'red' : 'green';
  }
}
