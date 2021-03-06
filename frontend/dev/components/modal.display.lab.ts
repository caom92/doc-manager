import { DefaultDocumentDisplayModalComponent } from './modal.display.default'
import { Component } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { LanguageService } from '../services/app.language'
import { environment } from '../environments/environment'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'


@Component({
  templateUrl: '../templates/modal.display.lab.html'
})
export class LabDocumentDisplayModalComponent
  extends DefaultDocumentDisplayModalComponent {
  environment = environment

  constructor(
    langManager: LanguageService,
    sanitizer: DomSanitizer,
    server: BackendService,
    toastManager: ToastService,
    globals: GlobalElementsService
  ) {
    super(langManager, sanitizer, server, toastManager, globals)
    this.isSignable = true
    this.countsPhysicalCopies = true
    this.checkboxLabel = {
      en: 'Has original analysis document?',
      es: '¿Tiene documento de análisis original?'
    }
  }
}
