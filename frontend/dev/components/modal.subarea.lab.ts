import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MzBaseModal } from 'ng2-materialize'

import { BackendResponse, BackendService } from '../services/app.backend'
import { LanguageService } from '../services/app.language'
import { ToastService } from '../services/app.toast'
import { SearchComponent } from './app.search'

@Component({
  templateUrl: '../templates/modal.subarea.lab.html'
})

export class LabSubAreaReassignComponent
  extends MzBaseModal
  implements OnInit
{
  @Input() areaID: number
  @Input() documentID: number
  @Input() parent: SearchComponent

  modalOptions = {
    dismissible: true
  }

  subareas: Array<{
    id: number,
    name: string
  }> = []

  captureForm: FormGroup

  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private langManager: LanguageService,
    private formBuilder: FormBuilder
  ) {
    super()
  }

  ngOnInit(): void {
    this.captureForm = this.formBuilder.group({
      subarea: [null, Validators.required]
    })

    let data = new FormData()
    data.append('area', String(this.areaID))

    this.server.write(
      'list-subareas-of-area',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.subareas = response.data
        } else {
          // TODO: Cambiar el mensaje de error
          this.langManager.getServiceMessage(
            'list-analysis-subtypes-of-type',
            response.meta.return_code
          )
        }
      }
    )
  }

  onFormSubmit(): void {    
    let data = new FormData()
    data.append('document', String(this.documentID))
    data.append('subarea', this.captureForm.controls.subarea.value)

    this.server.write(
      'edit-lab-subarea',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.parent.updateSearch()
        }
        // notificamos al usuario del resultado cuando el servidor responda
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'edit-lab-subarea',
            response.meta.return_code
          )
        )
      }
    )
  }
}