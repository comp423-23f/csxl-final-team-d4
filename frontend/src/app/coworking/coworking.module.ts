import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoworkingRoutingModule } from './coworking-routing.module';
import { CoworkingPageComponent } from './coworking-home/coworking-home.component';
import { AmbassadorPageComponent } from './ambassador-home/ambassador-home.component';
import { MatCardModule } from '@angular/material/card';
import { CoworkingReservationCard } from './widgets/coworking-reservation-card/coworking-reservation-card';
import { MatDividerModule } from '@angular/material/divider';
import { CoworkingDropInCard } from './widgets/dropin-availability-card/dropin-availability-card.widget';
import { MatListModule } from '@angular/material/list';
import { CoworkingHoursCard } from './widgets/operating-hours-panel/operating-hours-panel.widget';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ReservationComponent } from './reservation/reservation.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { StatsTable } from './widgets/stats-table/stats-table.widget';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Form, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchReports } from './widgets/search-reports/search-reports.widget';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    CoworkingPageComponent,
    ReservationComponent,
    AmbassadorPageComponent,
    CoworkingDropInCard,
    CoworkingReservationCard,
    CoworkingHoursCard,
    StatisticsComponent,
    StatsTable
  ],
  imports: [
    CommonModule,
    CoworkingRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule,
    AsyncPipe,
    NgChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    SearchReports,
    MatSlideToggleModule
  ],
  providers: [{ provide: NgChartsConfiguration }]
})
export class CoworkingModule {}
