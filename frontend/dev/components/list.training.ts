import { Component } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'


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
    modalManager: MzModalService,
    server: BackendService,
    toastManager: ToastService
  ) {
    super(global, langManager, modalManager, server, toastManager)
  }
}
