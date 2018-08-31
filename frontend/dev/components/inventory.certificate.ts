import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { ProductCertificateInventoryModalComponent } from './modal.inventory.certificate.product'

@Component({
  templateUrl: '../templates/inventory.certificate.html'
})
export class CertificateInventoryComponent implements OnInit {
  suppliers: Array<{
    id: number,
    name: string
  }> = []

  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService
  ) {
  }

  ngOnInit(): void {
    this.server.read(
      'list-certificate-products',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code == 0) {
          this.suppliers = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-suppliers',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read()
  }

  onAddSupplierButtonClick(): void {
    this.modalManager.open(ProductCertificateInventoryModalComponent, {
      parent: this
    })
  }
}