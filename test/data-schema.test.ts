import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, test, expect } from 'vitest'
import Ajv2020 from 'ajv/dist/2020'

const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url))
const read = (p: string) => JSON.parse(readFileSync(p, 'utf-8'))

const ajv = new Ajv2020({ allErrors: true })
const validateCommunity = ajv.compile(read(dir('../schema/community.json')))
const validateConferences = ajv.compile(read(dir('../schema/conferences.json')))

const dataDir = dir('../data')
const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'))

describe('data files match their JSON schema', () => {
    test.each(files)('%s is valid', (file) => {
        const validate = file === 'conferences.json' ? validateConferences : validateCommunity
        const valid = validate(read(`${dataDir}/${file}`))

        expect(valid, ajv.errorsText(validate.errors)).toBe(true)
    })
})
