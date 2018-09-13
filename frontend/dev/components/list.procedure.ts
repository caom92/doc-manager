import { Component } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'


@Component({
  selector: 'list-procedure',
  templateUrl: '../templates/list.procedure.html'
})
export class ProcedureSearchResultsListComponent 
  extends SearchResultsListComponent {

  get documentName(): string {
    return 'SOP/PROCEDIMIENTOS'
  }

  get baseName(): string {
    return 'procedure'
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
