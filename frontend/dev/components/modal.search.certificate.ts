import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentSearchModalComponent, NoParentElement, SingleParentElement } from './modal.search.default'


@Component({
  templateUrl: '../templates/modal.search.certificate.html'
})
export class CertificateDocumentSearchModalComponent
  extends DefaultDocumentSearchModalComponent
  implements OnInit {
  products: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

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
          this.products = this.products.concat(response.data)
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

    this.searchForm = this.formBuilder.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      zone: [
        (this.global.roleName !== 'Director') ?
          {
            value: this.global.zone,
            disabled: true
          }
          : {
            value: null,
            disabled: false
          }
      ],
      product: [null]
    })
  }

  onLetterDocumentSearch(): void {
    let data = new FormData()
    data.append(
      'document_type_id',
      this.selectedDocumentTypeID.toString()
    )
    data.append(
      'start_date',
      this.searchForm.controls.startDate.value
    )
    data.append(
      'end_date',
      this.searchForm.controls.endDate.value
    )

    let selectedZone =
      <NoParentElement>this.searchForm.controls.zone.value
    if (selectedZone && selectedZone != this.noParentOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    let selectedProduct =
      <NoParentElement>this.searchForm.controls.product.value
    if (selectedProduct && selectedProduct != this.noParentOptionAll) {
      data.append('product_id', selectedProduct.id.toString())
    }

    let modal = this.modalManager.open(ProgressModalComponent)

    this.server.write(
      'search-certificate',
      data,
      (response: BackendResponse) => {
        modal.instance.modalComponent.close()

        if (response.meta.return_code == 0) {
          this.parent.searchResults = response.data.documents
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-lab',
              response.meta.return_code
            )
          )
        }
      }
    )
  }
}