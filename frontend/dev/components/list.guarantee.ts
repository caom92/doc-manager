import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'


@Component({
  selector: 'list-guarantee',
  templateUrl: '../templates/list.guarantee.html'
})
export class GuaranteeSearchResultsListComponent 
  extends SearchResultsListComponent {

  get documentName(): string {
    return 'CARTAS DE GARANTÍA'
  }

  get baseName(): string {
    return 'guarantee'
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
