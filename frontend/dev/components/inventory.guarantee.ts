import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { SupplierGuaranteeInventoryModalComponent } from './modal.inventory.guarantee.supplier'

@Component({
  templateUrl: '../templates/inventory.guarantee.html'
})
export class GuaranteeInventoryComponent implements OnInit {
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
      'list-suppliers',
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
    this.modalManager.open(SupplierGuaranteeInventoryModalComponent, {
      parent: this
    })
  }
}