import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchComponent } from './app.search'
import { SearchResultsListComponent } from './list.default'


@Component({
  templateUrl: '../templates/list.certificate.html'
})
export class CertificateSearchResultsListComponent 
  extends SearchResultsListComponent
{
  constructor(
    global: GlobalElementsService,
    langManager: LanguageService
  ) {
    super(global, langManager)
  }
}