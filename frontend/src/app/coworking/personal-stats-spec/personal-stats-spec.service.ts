import { Injectable } from '@angular/core';
import { RxReservations } from '../ambassador-home/rx-reservations';
import { Observable, map } from 'rxjs';
import {
  Reservation,
  ReservationJSON,
  parseReservationJSON
} from '../coworking.models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PersonalStatsSpecService {
  private reservations: RxReservations = new RxReservations();
  public reservations$: Observable<Reservation[]> = this.reservations.value$;

  constructor(private http: HttpClient) {}

  fetchReservations(): void {
    this.http
      .get<ReservationJSON[]>(
        '/api/coworking/statistics/get_personal_statistical_history'
      )
      .subscribe((reservations) => {
        this.reservations.set(reservations.map(parseReservationJSON));
      });
  }
}
