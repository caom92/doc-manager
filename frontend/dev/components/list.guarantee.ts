import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { DefaultDocumentDisplayModalComponent } from './modal.display.default';


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
    modalManager: MzModalService
  ) {
    super(global, langManager, modalManager)
  }
}
