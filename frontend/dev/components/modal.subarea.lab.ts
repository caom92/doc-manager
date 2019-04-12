import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MzBaseModal } from 'ngx-materialize'

import { BackendResponse, BackendService } from '../services/app.backend'
import { LanguageService } from '../services/app.language'
import { ToastService } from '../services/app.toast'
import { SearchComponent } from './app.search'

@Component({
  templateUrl: '../templates/modal.subarea.lab.html'
})

export class LabSubAreaReassignComponent
  extends MzBaseModal
  implements OnInit {

  @Input() document: any

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

    const data = new FormData()
    data.append('area', String(this.document.area_id))

    this.server.write(
      'list-subareas-of-area',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
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
    const data = new FormData()
    data.append('document', String(this.document.id))
    data.append('subarea', this.captureForm.controls.subarea.value)

    this.server.write(
      'edit-lab-subarea',
      data,
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.document.area_id = response.data.area_id
          this.document.area_name = response.data.area_name
          this.document.subarea_id = response.data.subarea_id
          this.document.subarea_name = response.data.subarea_name
        }
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
