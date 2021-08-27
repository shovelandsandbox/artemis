/*
  Copyright © 20219 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base'
// import chalk from 'chalk'
// import stringify from 'fast-safe-stringify'
import consola, { JSONReporter } from 'consola'
// import loglevel from 'loglevelnext'
import { customAlphabet } from 'nanoid'

export type LogMutateData = Record<string, string>

export interface LogOptions {
  events: { [name: string]: boolean }
  mutate: (data: LogMutateData) => LogMutateData
  prefix: string
  timestamp: boolean
}

const defaults: LogOptions = {
  events: {
    didEncounterErrors: true,
    didResolveOperation: false,
    executionDidStart: false,
    parsingDidStart: false,
    responseForOperation: false,
    validationDidStart: false,
    willSendResponse: true,
  },
  mutate: (data: LogMutateData) => data,
  prefix: 'apollo',
  timestamp: false,
}
const nanoid = customAlphabet('1234567890abcdef', 6)
const ignoredOps = ['IntrospectionQuery']

// const getLog = (options: LogOptions) => {
//   const template = `${options.timestamp ? '[{{time}}] ' : ''}{{level}} `
//   const prefix = {
//     level: ({ level }: { level: string }) =>
//       chalk[level === 'info' ? 'blue' : 'red'](
//         chalk`{inverse ${options.prefix}}`
//       ),
//     template,
//     time: () => new Date().toTimeString().split(' ')[0],
//   }
//   const log = loglevel.create({ level: 'info', name: 'artemis', prefix })

//   return (id: string, data: unknown) => {
//     const mutated = options.mutate?.(data as LogMutateData)
//     log[(data as any).errors ? 'error' : 'info'](
//       chalk`{dim ${id}}`,
//       stringify(mutated)
//     )
//   }
// }

export const ArtemisLoggingPlugin = (
  opts?: Partial<LogOptions>
): ApolloServerPlugin => {
  const options: LogOptions = Object.assign({}, defaults, opts)
  const log = consola.create({
    reporters: [new JSONReporter()],
  })

  return {
    requestDidStart(context) {
      const operationId = nanoid()
      const ignore = ignoredOps.includes(context.operationName || '')

      log.withDefaults({
        tag: `${operationId} [${
          context.operationName ? context.operationName : 'N/A'
        }]`,
      })

      if (!ignore) {
        const query = context.request.query?.replace(/\n/g, '')
        const variables = Object.keys(context.request.variables || {})
        log.info({
          message: query,
          args: variables,
        })
      }

      const { events } = options
      const handlers: GraphQLRequestListener = {
        didEncounterErrors({ errors }) {
          if (events.didEncounterErrors) {
            log.withTag('didEncounterErrors')
            log.error({
              message: errors,
              args: errors,
            })
          }
        },

        didResolveOperation({ metrics, operationName }) {
          if (events.didResolveOperation) {
            log.withTag('didResolveOperation')
            log.info({ metrics, operationName })
          }
        },

        executionDidStart({ metrics }) {
          if (events.executionDidStart) {
            log.withTag('executionDidStart')
            log.info({ metrics })
          }
        },

        parsingDidStart({ metrics }) {
          if (events.parsingDidStart) {
            log.withTag('parsingDidStart')
            log.info({ metrics })
          }
        },

        responseForOperation({ metrics, operationName }) {
          if (events.responseForOperation) {
            log.withTag('responseForOperation')
            log.info(operationId, {
              metrics,
              operationName,
            })
          }
          return null
        },

        validationDidStart({ metrics }) {
          if (events.validationDidStart) {
            log.withTag('validationDidStart')
            log.info({ metrics })
          }
        },

        willSendResponse({ metrics }) {
          if (options.events.willSendResponse) {
            log.withTag('willSendResponse')
            log.info({ event: 'response', metrics })
          }
        },
      }

      return handlers
    },
  }
}
