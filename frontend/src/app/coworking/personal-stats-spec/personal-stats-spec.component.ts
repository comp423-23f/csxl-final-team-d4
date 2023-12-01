import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Query } from '../coworking.models';
import { Route } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Profile, ProfileService } from '../../profile/profile.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { permissionGuard } from 'src/app/permission.guard';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { Observable, Subscription, map, mergeMap, tap, timer } from 'rxjs';
import { Reservation } from '../coworking.models';
import { PersonalStatsSpecService } from './personal-stats-spec.service';

@Component({
  selector: 'app-personal-stats-spec',
  templateUrl: './personal-stats-spec.component.html',
  styleUrls: ['./personal-stats-spec.component.css']
})
export class PersonalStatsSpecComponent implements OnInit, OnDestroy {
  public static Route: Route = {
    path: 'personal-stats-spec',
    component: PersonalStatsSpecComponent,
    title: 'Personal Statistics'
  };
  reservations$: Observable<Reservation[]>;

  columnsToDisplay = ['id', 'date', 'start', 'end', 'seat', 'state'];

  private refreshSubscription!: Subscription;

  constructor(public personalStatsSpecService: PersonalStatsSpecService) {
    this.reservations$ = this.personalStatsSpecService.reservations$;
  }

  ngOnInit(): void {
    this.refreshSubscription = timer(0, 5000)
      .pipe(tap((_) => this.personalStatsSpecService.fetchReservations()))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }
}
