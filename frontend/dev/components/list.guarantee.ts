import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'


@Component({
  templateUrl: '../templates/list.guarantee.html'
})
export class GuaranteeSearchResultsListComponent 
  extends SearchResultsListComponent {

  constructor(
    global: GlobalElementsService,
    langManager: LanguageService
  ) {
    super(global, langManager)
  }
}
