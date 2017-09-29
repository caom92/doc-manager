import { Injectable } from '@angular/core'
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http'
import { Observable } from 'rxjs/Rx'

// Servicio que proporciona la interfaz con la cual el backend puede 
// comunicarse con el backend de la aplicacion
@Injectable()
export class BackendService 
{
  // El URL a donde se enviaran las peticiones de servicio al backend de la 
  // aplicacion
  private static url = 'http://localhost/doc-manager/backend/services/'

  // Los encabezados del paquete HTTP que sera enviado
  private static headers = new Headers({ 
    'Accept': 'application/json'  // esperamos recibir un JSON de respuesta
  })

  // La funcion que sera ejecutada en caso de que la comunicacion con el 
  // servidor falle
  private static defaultErrorCallback = 
    (error: any, caught: Observable<void>) => {
      // simplimente arrojamos una excepcion para que sea capturada en una 
      // parte mas alta del programa
      Observable.throw(error)
      return []
    }

  // El constructor de este servicio
  constructor(private http: Http) {
    // haremos uso de la interfaz HTTP de Angular
  }

  // Envia una solicitud al servidor por el metodo PUT
  // [in]   service: el nombre del servicio que sera solicitado al servidor
  // [in]   data: los datos que van a ser enviados junto con la peticion
  // [in]   successCallback: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor se haya realizado con exito
  // [in]   [errorCallback]: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor haya fallado
  create(
    service: string, 
    data: URLSearchParams, 
    successCallback: (response: any) => void, 
    errorCallback = BackendService.defaultErrorCallback
  ): void {
    this.http
      .put(
        BackendService.url + service,
        new RequestOptions({
          headers: BackendService.headers,
          body: data,
          withCredentials: true
        })
      )
      .map((response: Response) => {
        // convertimos el resultado en JSON 
        let result = JSON.parse(response['_body'].toString())

        // invocamos la funcion de exito especificada por el usuario
        successCallback(result)
      })
      .catch(errorCallback)
      .subscribe()
  }

  // Solicita datos del servidor por el metodo GET
  // [in]   service: el nombre del servicio que sera solicitado al servidor
  // [in]   data: los datos que van a ser enviados junto con la peticion
  // [in]   successCallback: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor se haya realizado con exito
  // [in]   [errorCallback]: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor haya fallado
  read(
    service: string, 
    data: URLSearchParams, 
    successCallback: (response: any) => void, 
    errorCallback = BackendService.defaultErrorCallback
  ): void {
    this.http
      .get(
        BackendService.url + service,
        new RequestOptions({
          headers: BackendService.headers,
          body: data,
          withCredentials: true
        })
      )
      .map((response: Response) => {
        // convertimos el resultado en JSON 
        let result = JSON.parse(response['_body'].toString())

        // invocamos la funcion de exito especificada por el usuario
        successCallback(result)
      })
      .catch(errorCallback)
      .subscribe()
  }

  // Envia datos al servidor por el metodo POST
  // [in]   service: el nombre del servicio que sera solicitado al servidor
  // [in]   data: los datos que van a ser enviados junto con la peticion
  // [in]   successCallback: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor se haya realizado con exito
  // [in]   [errorCallback]: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor haya fallado
  update(
    service: string, 
    data: FormData, 
    successCallback: (response: any) => void, 
    errorCallback = BackendService.defaultErrorCallback
  ): void {
    this.http
      .post(
        BackendService.url + service,
        data,
        new RequestOptions({
          headers: BackendService.headers,
          withCredentials: true
        })
      )
      .map((response: Response) => {
        // convertimos el resultado en JSON 
        let result = JSON.parse(response['_body'].toString())

        // invocamos la funcion de exito especificada por el usuario
        successCallback(result)
      })
      .catch(errorCallback)
      .subscribe()
  }

  // Envia una solicitud al servidor por el metodo DELETE
  // [in]   service: el nombre del servicio que sera solicitado al servidor
  // [in]   data: los datos que van a ser enviados junto con la peticion
  // [in]   successCallback: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor se haya realizado con exito
  // [in]   [errorCallback]: la funcion a ejecutarse en caso de que la 
  //        comunicacion con el servidor haya fallado
  delete(
    service: string, 
    data: URLSearchParams, 
    successCallback: (response: any) => void, 
    errorCallback = BackendService.defaultErrorCallback
  ): void {
    this.http
      .get(
        BackendService.url + service,
        new RequestOptions({
          headers: BackendService.headers,
          body: data,
          withCredentials: true
        })
      )
      .map((response: Response) => {
        // convertimos el resultado en JSON 
        let result = JSON.parse(response['_body'].toString())

        // invocamos la funcion de exito especificada por el usuario
        successCallback(result)
      })
      .catch(errorCallback)
      .subscribe()
  }
}