import { Component } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'


@Component({
  templateUrl: '../templates/list.certificate.html'
})
export class CertificateSearchResultsListComponent 
  extends SearchResultsListComponent {

  get documentName(): string {
    return 'PERMISOS Y CERTIFICADOS (SAGARPA/FDA/' +
      'SENASICA/USDA/CTPAT/TRAZABILIDAD)'
  }

  get baseName(): string {
    return 'certificate'
  }

  constructor(
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService
  ) {
    super(global, langManager, modalManager)
  }
}
