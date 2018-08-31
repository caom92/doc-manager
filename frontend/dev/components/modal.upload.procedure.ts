import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, Validators } from '@angular/forms'
import { DefaultDocumentUploadModalComponent } from './modal.upload.default'
import { NoParentElement, SingleParentElement } from './modal.search.default'


@Component({
  templateUrl: '../templates/modal.upload.procedure.html'
})
export class ProcedureDocumentUploadModalComponent 
  extends DefaultDocumentUploadModalComponent implements OnInit {

  sections: Array<SingleParentElement> = []

  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder
  ) {
    super(server, toastManager, global, langManager, modalManager, formBuilder)
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.server.read(
      'list-sections',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.sections = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-suppliers',
              response.meta.return_code
            )
          )
        }
      }
    )

    this.uploadForm = this.formBuilder.group({
      documentDate: [ null, Validators.required ],
      zone: [
        {
          value: this.global.zone,
          disabled: true
        },
        Validators.compose([
          Validators.required
        ])
      ],
      documentName: [ null, Validators.compose([
        Validators.required, Validators.maxLength(255)
      ])],
      section: [ null, Validators.compose([
        Validators.required, Validators.maxLength(255)
      ])],
      notes: [ null, Validators.maxLength(65535)]
    })
  }

  onProcedureFileSelected(event: any): void {
    this.selectedDocumentFile = null
    const files = event.target.files
    if (files.length > 0) {
      this.selectedDocumentFile = files[0]
    }
  }

  onProcedureFileUpload(): void {
    const data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      this.uploadForm.controls.documentDate.value
    )

    const selectedZone =
      <NoParentElement> this.uploadForm.controls.zone.value
    data.append('zone', selectedZone.id.toString())

    data.append('document_name', this.uploadForm.controls.documentName.value)

    const selectedSection =
      <NoParentElement> this.uploadForm.controls.section.value
    data.append('section_id', selectedSection.id.toString())

    if (this.uploadForm.controls.notes.value) {
      data.append(
        'notes',
        this.uploadForm.controls.notes.value
      )
    }

    data.append(
      'procedure_file', 
      this.selectedDocumentFile, 
      this.selectedDocumentFile.name
    )

    const modal = this.modalManager.open(ProgressModalComponent)
    this.server.write(
      'capture-procedure',
      data,
      (response: BackendResponse) => {
        modal.instance.modalComponent.closeModal()

        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-default',
            response.meta.return_code
          )
        )

        if (response.meta.return_code === 0) {
          this.uploadForm.reset()
        }
      }
    )
  }
}
