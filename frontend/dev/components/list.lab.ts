import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { LabDocumentDisplayModalComponent } from './modal.display.lab'


// El componente que lista los resultados de busqueda de documentos
@Component({
  selector: 'list-lab',
  templateUrl: '../templates/list.lab.html'
})
export class LabSearchResultsListComponent extends SearchResultsListComponent {

  get documentName(): string {
    return 'LABORATORIOS'
  }

  get baseName(): string {
    return 'lab'
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService
  ) {
    super(global, langManager, modalManager)
  }
}
