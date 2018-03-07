import { Injectable } from '@angular/core'

// Este servicio contiene los atributos y metodos declarados en el componente 
// de la pantalla principal para que puedan ser accesibles a otros componentes 
// derivados del mismo
@Injectable()
export class GlobalElementsService
{
  // Bandera que indica si se debe desplegar el menu lateral
  private _showSideNav = false
  get showSideNav() {
    return this._showSideNav
  }

  // Despliega el menu lateral
  displaySideNav() {
    this._showSideNav = true
  }

  // Oculta el menu lateral
  hideSideNav() {
    this._showSideNav = false
  }

  // Bandera que indica si se debe desplegar la animacion de carga en la 
  // pantalla o no
  private _showSpinner = true
  get showSpinner() {
    return this._showSpinner
  }
  
  displaySpinner() {
    this._showSpinner = true
  }

  hideSpinner() {
    this._showSpinner = false
  }

  // El ID del usuario que tiene registrado en la base de datos
  private _userID: number = 
    (localStorage.user_id !== undefined) ?
      localStorage.user_id
      : null
  set userID(value: number) {
    this._userID = value
    localStorage.user_id = value
  }
  get userID() {
    return this._userID
  }

  // El nombre del rol del usuario
  private _roleName: string = 
    (localStorage.role_name !== undefined) ?
      localStorage.role_name
      : null
  set roleName(value: string) {
    this._roleName = value
    localStorage.role_name = value
  }
  get roleName() {
    return this._roleName
  }

  // El numero de indentificacion del empleado en la empresa
  private _employeeNum: string = 
    (localStorage.employee_num !== undefined) ?
      localStorage.employee_num
      : null
  set employeeNum(value: string) {
    this._employeeNum = value
    localStorage.employee_num = value
  }
  get employeeNum() {
    return this._employeeNum
  }

  // El nombre completo del usuario que sera desplegado en el menu lateral
  private _userFullName: string = (localStorage.user_full_name !== undefined) ?
    localStorage.user_full_name
    : null
  set userFullName(value: string) {
    this._userFullName = value
    localStorage.user_full_name = value
  }
  get userFullName() {
    return this._userFullName
  }

  // El nombre de cuenta del usuario para iniciar sesion
  private _loginName: string = 
    (localStorage.login_name !== undefined) ?
      localStorage.login_name
      : null
  set loginName(value: string) {
    this._loginName = value
    localStorage.login_name = value
  }
  get loginName() {
    return this._loginName
  }

  // Informacion de la compañia
  private _company = {
    name: (localStorage.company_name !== undefined) ? 
      localStorage.company_name : null,
    logo: (localStorage.company_logo !== undefined) ? 
      localStorage.company_logo : null,
    address: (localStorage.company_address !== undefined) ? 
      localStorage.company_address : null
  }
  set companyName(value: string) {
    this._company.name = value
    localStorage.company_name = value
  }
  set companyLogo(value: string) {
    this._company.logo = value
    localStorage.company_logo = value
  }
  set companyAddress(value: string) {
    this._company.address = value
    localStorage.company_address = value
  }
  get company() {
    return this._company
  }

  // Informacion de la zona del usuario
  private _zone = {
    id: (localStorage.zone_id !== undefined) ? 
      localStorage.zone_id : null,
    name: (localStorage.zone_name !== undefined) ? 
      localStorage.zone_name : null
  }
  set zoneID(value: number) {
    this._zone.id = value
    localStorage.zone_id = value
  }
  set zoneName(value: string) {
    this._zone.name = value
    localStorage.zone_name = value
  }
  get zone() {
    return this._zone
  }

  get lang(): string {
    return localStorage.lang
  }

  set lang(value: string) {
    localStorage.lang = value
  }

  // Retorna la fecha de hoy en una cadena con formato AAAA-MM-DD
  getFormattedDate(): string {
    // primero obtenemos la fecha de hoy 
    let today = new Date()

    // luego obtenemos el año, el mes y el dia individualmente como cadenas
    let year = today.getUTCFullYear().toString()
    let month = (today.getMonth() + 1).toString()
    let day = today.getUTCDate().toString()

    // el mes y el dia no estan precedidos por un 0 cuando son valores menores 
    // a 10, para corregir esto, le agregamos el 0 al principio y luego 
    // recuperamos los ultimos 2 caracteres; si el valor es menor a 10, 
    // agregarle el 0 hara que la cadena tenga solo 2 caracteres, por lo que la 
    // funcion slice() retornara la cadena completa, en cambio si el valor es 
    // mayor a 10, agregarle el 0 hara que la cadena tenga 3 caracteres y la 
    // funcion slice retornara los ultimos 2 caracteres, borrando el cero que 
    // le habiamos agregado
    month = ('0' + month).slice(-2)
    day = ('0' + day).slice(-2)

    // retornamos la cadena de fecha formateada
    return `${ year }-${ month }-${ day }`
  }

  // Convierte la fecha en formato YYYY-MM-DD a formato DD-mmm-YY, donde mmm
  // son las primeras 3 letras del mes en cuestión en el idioma elegido por lang
  translateDate(date: string, lang: string) {
    const translations = {
      es: {
        '01': 'Ene',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Abr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Ago',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dic'
      },
      en: {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      }
    }

    const dateParts = date.split('-')
    const year = dateParts[0].slice(-2)
    const month = translations[lang][dateParts[1]]
    const day = dateParts[2]

    return `${ day }-${ month }-${ year }`
  }
} // export class HomeElementsService