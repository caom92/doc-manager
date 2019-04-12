import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchResultsListComponent } from './list.default'
import { MzModalService } from 'ngx-materialize'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { SignDocumentConfirmationModalComponent } from './modal.confirmation.sign'
import { LabSubAreaReassignComponent } from './modal.subarea.lab'

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
    modalManager: MzModalService,
    server: BackendService,
    toastManager: ToastService
  ) {
    super(global, langManager, modalManager, server, toastManager)
  }

  onAssignSubProductClicked(document: any): void {
    this.modalManager.open(LabSubAreaReassignComponent, {
      document: document
    })
  }

  onSignDocumentRequested(document: any): void {
    this.modalManager.open(SignDocumentConfirmationModalComponent, {
      title: this.langManager.messages.signConfirmation.title,
      message: this.langManager.messages.signConfirmation.message,
      document: document
    })
  }
}
