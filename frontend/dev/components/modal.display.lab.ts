import { DefaultDocumentDisplayModalComponent } from './modal.display.default'
import { Component } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { LanguageService } from '../services/app.language'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'

@Component({
  templateUrl: '../templates/modal.display.default.html'
})
export class LabDocumentDisplayModalComponent
  extends DefaultDocumentDisplayModalComponent
{
  constructor(
    langManager: LanguageService,
    sanitizer: DomSanitizer,
    server: BackendService,
    toastManager: ToastService
  ) {
    super(langManager, sanitizer, server, toastManager)
    this.countsPhysicalCopies = true
    this.checkboxLabel = {
      en: 'Has original analysis document?',
      es: '¿Tiene documento de análisis original?'
    }
  }
}