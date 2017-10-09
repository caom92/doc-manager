import { Injectable } from '@angular/core'

// Este servicio se encarga de administrar los textos que se despliegan en la 
// pagina en el idioma elegido por el usuario
@Injectable()
export class LanguageService
{
  // La lista de traducciones para todos los textos del sistema
  private translations = {
    es: { // Español
      global: {
        wait: 'Por favor espere...',
        selectPlaceholder: 'Elija una opción',
        submit: 'Enviar',
        close: 'Cerrar',
        datePickerConfig: {
          closeOnSelect: true,
          closeOnClear: false,
          monthsFull: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ],
          monthsShort: [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep',
            'Oct', 'Nov', 'Dec'
          ],
          weekdaysFull: [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
            'Sábado'
          ],
          weekdaysShort: [
            'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
          ],
          weekdaysLetter: [
            'D', 'L', 'M', 'R', 'J', 'V', 'S'
          ],
          today: 'Hoy',
          clear: 'Borrar',
          close: 'Cerrar',
          formatSubmit: "yyyy-mm-dd"
        }
      },
      sideNav: {
        search: 'Buscar',
        upload: 'Capturar',
        documents: 'Tipos de Documento'
      },
      upload: {
        lab: {
          analysisLabel: 'Solicitud de Estudio',
          resultLabel: 'Resultado de Estudio',
          labNameLabel: 'Nombre del Laboratorio'
        },
        title: 'Captura de Documento',
        typeLabel: 'Tipo de Documento',
        zoneLabel: 'Zona',
        ranchLabel: 'Rancho',
        areaLabel: 'Área o Producto',
        notesLabel: 'Notas o Comentarios',
        producerLabel: 'Productor',
        docDateLabel: 'Fecha del Documento',
        fileLabel: 'Archivo del Documento',
        fileButtonLabel: 'Subir',
        errors: {
          documentDate: {
            required: 'Este campo es obligatorio'
          },
          zone: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe ser de 3 caracteres de largo',
            maxlength: 'Este campo debe ser de 3 caracteres de largo'
          },
          ranch: {
            required: 'Este campo es obligatorio',
            maxlength: 'Este campo no debe ser mas de 255 caracteres de largo'
          },
          notes: {
            maxlength: 'Este campo no debe ser mas de 65535 caracteres de largo'
          }
        }
      },
      search: {
        title: 'Buscar Documento',
        startDateLabel: 'Fecha de Inicio',
        endDateLabel: 'Fecha Final',
        buttonLabel: 'Buscar',
        noSearchResults: 'No se encontraron documentos con esas características'
      },
      display: {
        title: 'Visualizar Documento',
        lab: {
          tabs: [
            'Solicitud',
            'Resultados'
          ]
        }
      },
      documents: {
        title: 'Tipos de Documento',
        tableHeaders: [
          'Nombre'
        ],
        nameLabel: 'Nombre del Tipo',
        addButtonLabel: 'Agregar',
        errors: {
          name: {
            required: 'Este campo es obligatorio',
            maxlength: 'Este campo no debe tener más de 255 caracteres'
          }
        }
      },
      'capture-default': {
        0: 'Documento capturado con éxito',
        1: 'Error al subir el documento'
      },
      'capture-lab': {
        0: 'Documento capturado con éxito',
        1: 'Error al subir el documento'
      },
      'add-doc-type': {
        0: 'Tipo de documento agregado con éxito',
        1: 'Error al crear el tipo; el nombre ya está ocupado'
      },
      100: 'No se pudo reconocer el servicio solicitado',
      101: 'Faltó enviar una entrada al servidor',
      102: 'Una entrada enviada al servidor no es un valor numérico',
      103: 'Una entrada enviada al servidor esta fuera del intervalo correcto',
      104: 'Una entrada enviada al servidor no es un número entero',
      105: 'Una entrada enviada al servidor no es un número real',
      106: 'Una entrada enviada al servidor no tiene la longitud de caracteres correcta',
      107: 'La longitud de caracteres de una entrada enviada al servidor no esta dentro del intervalo apropiado',
      108: 'Una entrada enviada al servidor no es una cadena',
      109: 'Una entrada enviada al servidor no es una cadena de correo electrónico',
      110: 'Una entrada enviada al servidor no es un valor lógico',
      111: 'Una entrada enviada al servidor no es una fecha o el formato es incorrecto',
      112: 'Una entrada enviada al servidor es un arreglo vacío',
      113: 'Un archivo enviado al servidor no es un documento',
      114: 'Un archivo enviado al servidor no es una imagen',
      115: 'No se pudo enviar un archivo al servidor',
      116: 'Una entrada enviada al servidor no es un número telefónico',
      200: 'Fallo al instanciar un DAO'
    },
    en: { // Ingles
      global: {
        wait: 'Please wait...',
        selectPlaceholder: 'Choose an option',
        submit: 'Send',
        close: 'Close',
        datePickerConfig: {
          closeOnSelect: true,
          closeOnClear: false,
          formatSubmit: "yyyy-mm-dd"
        }
      },
      sideNav: {
        search: 'Search',
        upload: 'Upload',
        documents: 'Document Types'
      },
      upload: {
        lab: {
          analysisLabel: 'Analysis Request Document',
          resultLabel: 'Result Document',
          labNameLabel: "Lab's Name"
        },
        title: 'Document Upload',
        typeLabel: 'Document Type',
        zoneLabel: 'Zone',
        ranchLabel: 'Ranch',
        areaLabel: 'Area or Product',
        notesLabel: 'Notes or Comments',
        producerLabel: 'Producer',
        docDateLabel: 'Document Date',
        fileLabel: 'Document File',
        fileButtonLabel: 'Upload',
        errors: {
          documentDate: {
            required: 'This field is required'
          },
          zone: {
            required: 'This field is required',
            minlength: 'This field must be 3 characters long',
            maxlength: 'This field must be 3 characters long'
          },
          ranch: {
            required: 'This field is required',
            maxlength: 'This field must not be longer than 255 characters'
          },
          notes: {
            maxlength: 'This field must not be longer than 65535 characters'
          }
        }
      },
      search: {
        title: 'Search Document',
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date',
        buttonLabel: 'Search',
        noSearchResults: 'No documents with those criteria were found'
      },
      display: {
        title: 'Display Document',
        lab: {
          tabs: [
            'Request',
            'Results'
          ]
        }
      },
      documents: {
        title: 'Document Types',
        tableHeaders: [
          'Name'
        ],
        nameLabel: 'Type Name',
        addButtonLabel: 'Add',
        errors: {
          name: {
            required: 'This field is required',
            maxlength: 'This field must not exceed 255 characters length'
          }
        }
      },
      'capture-default': {
        0: 'Document uploaded successfully',
        1: 'Failed to upload the document file'
      },
      'capture-lab': {
        0: 'Document uploaded successfully',
        1: 'Failed to upload the document file'
      },
      'add-doc-type': {
        0: 'Document type added successfully',
        1: 'Failed to add document type; the name is already taken'
      },
      100: 'Unable to recognize the requested service',
      101: 'A server input argument was not send',
      102: 'A server input argument is not a numeric value',
      103: 'A server input argument is outside the correct interval',
      104: 'A server input argument is not an integer',
      105: 'A server input argument is not a real number',
      106: "A server input argument doesn't have the proper character length",
      107: 'The character length of a server input argument is not within the proper interval',
      108: 'A server input argument is not a string',
      109: 'A server input argument is not an email string',
      110: 'A server input argument is not a boolean value',
      111: 'A server input argument is not a date or the format is incorrect',
      112: 'A server input argument is an empty array',
      113: 'A file sent to the server is not a document',
      114: 'A file sent to the server is not an image',
      115: 'A file could not be sent to the server',
      116: 'A server input argument is not a phone number',
      200: 'Failed to create an instance of a DAO'
    }
  }

  // Las interfaces publicas a todos los textos del sistema; el sistema 
  // desplegara cualquier texto que este almacenado aqui
  messages = {
    global: {
      selectPlaceholder: null,
      submit: null,
      datePickerConfig: null
    },
    sideNav: {
      search: null,
      upload: null,
      documents: null
    },
    upload: {
      lab: {
        analysisLabel: null,
        resultLabel: null,
        labNameLabel: null
      },
      title: null,
      typeLabel: null,
      zoneLabel: null,
      ranchLabel: null,
      areaLabel: null,
      producerLabel: null,
      notesLabel: null,
      docDateLabel: null,
      fileLabel: null,
      fileButtonLabel: null,
      errors: {
        documentDate: {
          required: null
        },
        zone: {
          required: null,
          minlength: null,
          maxlength: null
        },
        ranch: {
          required: null,
          maxlength: null
        },
        notes: {
          maxlength: null
        }
      }
    },
    search: {
      title: null,
      startDateLabel: null,
      endDateLabel: null,
      buttonLabel: null,
      noSearchResults: null
    },
    display: {
      title: null,
      lab: {
        tabs: [ null, null ]
      }
    },
    documents: {
      title: null,
      tableHeaders: [ null ],
      nameLabel: null,
      addButtonLabel: null,
      errors: {
        name: {
          required: null,
          maxlength: null
        }
      }
    },

  }

  // Inicializa todos los textos de la aplicacion con el idioma que este 
  // seleccionado en ese momento, cualquiera que sea
  initMessages(): void {
    for (let msg in this.messages) {
      this.messages[msg] = this.translations[localStorage.lang][msg]
    }
  }

  // Cambia los textos del sistema para que correspondan al idioma especificado
  // [in]   lang: el idioma elegido por el usuario, debe ser una opcion de:
  //        'en' o 'es'
  changeLanguage(lang: string): void {
    localStorage.lang = lang
    for (let msg in this.messages) {
      this.messages[msg] = this.translations[lang][msg]
    }
  }

  // Retorna el texto en el idioma elegido que sea adecuado para la combinacion 
  // de nombre de servicio y codigo de resultado especificados
  // [in]   service: el nombre del servicio cuyo mensaje queremos obtener
  // [in]   code: el codigo de resultado obtenido tras solicitar dicho servicio
  // [out]  return: el texto correspondiente al resultado obtenido por el 
  //        servicio especificado en el idioma seleccionado
  getServiceMessage(service: string, code: number): string {
    // inicializamos el almacenamiento temporal para el mensaje resultante
    let message = null
    
    if (this.translations[localStorage.lang][service] !== undefined) {
      // si existe la combinacion de servicio y codigo de resultado 
      // especificados, retornamos ese
      message = this.translations[localStorage.lang][service][code]
    } else if (this.translations[localStorage.lang][code] !== undefined) {
      // si la combinacion no existe, buscamos el mensaje que corresponda 
      // unicamente el codigo de resultado especificado
      message = this.translations[localStorage.lang][code]
    } else {
      // si no se encontro un texto apropiado para ninguno de los dos casos, 
      // retornamos uno generico
      message = (localStorage.lang == 'en') ?
        'An unknown error occurred'
        : 'Ocurrió un error desconocido'
    }

    // retornamos el texto obtenido
    return message
  }
}