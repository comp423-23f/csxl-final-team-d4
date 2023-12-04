import { Injectable } from '@angular/core';
import { RxReservations } from '../ambassador-home/rx-reservations';
import { Observable } from 'rxjs';
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

  private apiBaseUrl = '/api/coworking';

  constructor(private http: HttpClient) {}

  fetchReservations(): void {
    this.http
      .get<ReservationJSON[]>(
        `${this.apiBaseUrl}/statistics/get_personal_statistical_history`
      )
      .subscribe((reservations) => {
        this.reservations.set(reservations.map(parseReservationJSON));
      });
  }

  getMeanStayTime(timeRange: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiBaseUrl}/statistics/mean-stay-time/${timeRange}`
    );
  }

  getLongerStayPercentage(timeRange: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiBaseUrl}/statistics/longer-stay-percentage/${timeRange}`
    );
  }
}
