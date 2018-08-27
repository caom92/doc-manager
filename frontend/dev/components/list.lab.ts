import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'


// El componente que lista los resultados de busqueda de documentos
@Component({
  templateUrl: '../templates/list.lab.html'
})
export class LabSearchResultsListComponent extends SearchResultsListComponent {

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    global: GlobalElementsService,
    langManager: LanguageService
  ) {
    super(global, langManager)
  }
}
