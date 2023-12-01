import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoworkingPageComponent } from './coworking-home/coworking-home.component';
import { AmbassadorPageComponent } from './ambassador-home/ambassador-home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PublicStatsComponent } from './public-stats/public-stats.component';
import { PersonalStatsSpecComponent } from './personal-stats-spec/personal-stats-spec.component';
const routes: Routes = [
  CoworkingPageComponent.Route,
  ReservationComponent.Route,
  AmbassadorPageComponent.Route,
  StatisticsComponent.Route,
  PublicStatsComponent.Route,
  PersonalStatsSpecComponent.Route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoworkingRoutingModule {}
