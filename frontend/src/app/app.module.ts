import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { HttpClientModule }    from '@angular/common/http';
import { ServerService } from './server.service';
import { TableComponent } from './table/table.component';
import { SecondTableComponent } from './second-table/second-table.component';

//for Tooltip purpose
import { TooltipOverviewExampleComponent } from './tooltip-overview-example/tooltip-overview-example.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material';

// for autocomplete purpose
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EventComponent } from './second-table/event/event.component';
import { ArtistTeamsComponent } from './second-table/artist-teams/artist-teams.component';
import { VenueComponent } from './second-table/venue/venue.component';
import { UpcomingEventsComponent } from './second-table/upcoming-events/upcoming-events.component';
import { NorecordComponent } from './no-record/no-record.component';
import { ErrorComponent } from './error/error.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { FavoriteComponent } from './favorite/favorite.component';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    TableComponent,
    SecondTableComponent,
    TooltipOverviewExampleComponent,
    EventComponent,
    ArtistTeamsComponent,
    VenueComponent,
    UpcomingEventsComponent,
    NorecordComponent,
    ErrorComponent,
    ProgressBarComponent,
    FavoriteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatAutocompleteModule,
    RoundProgressModule,
    // ReactiveFormsModule,
    // MatInputModule,
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
