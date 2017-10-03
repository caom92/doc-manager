import { Component, OnInit, Injector } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { StateService } from '@uirouter/angular'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'

type AutoCompleteObject = {
  data: {
    [key: string]: string
  },
  limit: number
}

// Este componente define el comportamiento por defecto necesario para que el 
// usuario capture un documento en el sistema
@Component({
  selector: 'default-document-upload',
  templateUrl: '../templates/document.upload.default.html'
})
export class DefaultDocumentUploadComponent implements OnInit
{
  zoneSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  ranchSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  producerSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private injector: Injector,
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService
  ) {
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    $('.datepicker').pickadate()

    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          for (let zone of response.data) {
            this.zoneSuggestions = {
              data: {},
              limit: 4
            }
            this.zoneSuggestions.data[zone.name] = null
          }
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-zones',
              response.meta.return_code
            )
          )
        }
      }
    )
  }

  onZoneSelected(event: any): void {
    this.server.read(
      'list-ranches-of-zone',
      {
        zone_name: event.target.value
      },
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          for (let ranch of response.data) {
            this.ranchSuggestions = {
              data: {},
              limit: 4
            }
            this.ranchSuggestions.data[ranch.name] = null
          }
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-zones-ranches-of-zone',
              response.meta.return_code
            )
          )
        }
      }
    )
  }

  onRanchSelected(event: any): void {
    this.server.read(
      'list-producers-of-ranch',
      {
        ranch_name: event.target.value
      },
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          for (let producer of response.data) {
            this.producerSuggestions = {
              data: {},
              limit: 4
            }
            this.producerSuggestions.data[producer.name] = null
          }
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-producers-of-ranch',
              response.meta.return_code
            )
          )
        }
      }
    )
  }
}
