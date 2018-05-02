import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentUploadModalComponent, AutoCompleteObject } from './modal.upload.default'
import { NoParentElement, SingleParentElement } from './modal.search.default'

@Component({
  templateUrl: '../templates/modal.upload.certificate.html'
})
export class CertificateDocumentUploadModalComponent
  extends DefaultDocumentUploadModalComponent
  implements OnInit {
  products: Array<SingleParentElement> = []

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
      'list-certificate-products',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.products = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-products',
              response.meta.return_code
            )
          )
        }
      }
    )

    this.uploadForm = this.formBuilder.group({
      documentDate: [null, Validators.required],
      zone: [
        {
          value: this.global.zone,
          disabled: true
        },
        Validators.compose([
          Validators.required
        ])
      ],
      product: [null, Validators.required],
      notes: [null, Validators.maxLength(65535)]
    })
  }

  onCertificateFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedDocumentFile = null

    // recuperamos el archivo elegido
    let files = event.target.files

    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedDocumentFile = files[0]
    }
  }

  onCertificateDocumentUpload(): void {
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date',
      this.uploadForm.controls.documentDate.value
    )

    let selectedProduct =
      <NoParentElement>this.uploadForm.controls.product.value
    data.append('product', selectedProduct.id.toString())

    let selectedZone =
      <NoParentElement>this.uploadForm.controls.zone.value
    data.append('zone', selectedZone.id.toString())

    if (this.uploadForm.controls.notes.value) {
      data.append(
        'notes',
        this.uploadForm.controls.notes.value
      )
    }

    data.append(
      'certificate_file',
      this.selectedDocumentFile,
      this.selectedDocumentFile.name
    )

    let modal = this.modalManager.open(ProgressModalComponent)
    this.server.write(
      'capture-certificate',
      data,
      (response: BackendResponse) => {
        modal.instance.modalComponent.close()

        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-default',
            response.meta.return_code
          )
        )

        if (response.meta.return_code == 0) {
          this.uploadForm.reset()
        }
      }
    )
  }
}