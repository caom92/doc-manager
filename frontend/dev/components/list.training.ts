import { Component } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'


@Component({
  selector: 'list-training',
  templateUrl: '../templates/list.training.html'
})
export class TrainingSearchResultsListComponent
  extends SearchResultsListComponent {

  get documentName(): string {
    return 'CAPACITACIONES'
  }

  get baseName(): string {
    return 'training'
  }

  constructor(
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService
  ) {
    super(global, langManager, modalManager)
  }
}
