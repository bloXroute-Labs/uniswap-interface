/* eslint-env node */

require('dotenv').config({ path: '.env.production' })
const child_process = require('child_process')
const fs = require('fs/promises')
const { promisify } = require('util')
const dataConfig = require('../graphql.data.config')
const thegraphConfig = require('../graphql.thegraph.config')

const exec = promisify(child_process.exec)

const BX_FETCH_SCHEMA_URL = 'https://api.swap.live/v1/graphql'

function fetchSchema(url, outputFile) {
  exec(`yarn --silent get-graphql-schema --h Origin=https://app.uniswap.org ${url}`)
    .then(({ stderr, stdout }) => {
      if (stderr) {
        throw new Error(stderr)
      } else {
        fs.writeFile(outputFile, stdout)
      }
    })
    .catch((err) => {
      console.error(err)
      console.error(`Failed to fetch schema from ${url}`)
    })
}

fetchSchema(process.env.THE_GRAPH_SCHEMA_ENDPOINT, thegraphConfig.schema)
fetchSchema(BX_FETCH_SCHEMA_URL, dataConfig.schema)
