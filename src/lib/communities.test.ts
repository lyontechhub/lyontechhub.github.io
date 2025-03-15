import { expect, test, describe, beforeEach } from 'vitest'
import { getSocialDisplayData } from './communities'

describe('communities', () => {
    describe('getSocialDisplayData should', () => {
        test('return default website', () => {
            const result = getSocialDisplayData({ url: 'https://www.example.com/tada' })

            expect(result).toEqual({ icon: 'fas fa-link', tooltip: 'Web site' })
        })

        test.each([
            { url: 'https://twitter.com/xxx', expected: { icon: 'fab fa-twitter', tooltip: 'Twitter' }},
            { url: 'https://meetup.com/fr/xxx', expected: { icon: 'fas fa-calendar', tooltip: 'Groupe Meetup' }},
        ])('use specific icon and tooltip if unknown website', ({ url, expected }) => {
            const result = getSocialDisplayData({ url })

            expect(result).toEqual(expected)
        })

        test.each([
            { url: 'https://www.twitter.com/xxx', expected: { icon: 'fab fa-twitter', tooltip: 'Twitter' }},
            { url: 'https://www.meetup.com/fr/xxx', expected: { icon: 'fas fa-calendar', tooltip: 'Groupe Meetup' }},
        ])('ignore www prefix', ({ url, expected }) => {
            const result = getSocialDisplayData({ url })

            expect(result).toEqual(expected)
        })

        test.each([
            { link: { url: 'https://twitter.com/xxx', name: '@xxx'}, expected: { icon: 'fab fa-twitter', tooltip: '@xxx' }},
            { link: { url: 'https://www.example.com/tada', name: 'tada website'}, expected: { icon: 'fas fa-link', tooltip: 'tada website' }},
        ])('allow to override tooltip', ({ link, expected }) => {
            const result = getSocialDisplayData(link)

            expect(result).toEqual(expected)
        })

        test.each([
            { link: { url: 'https://twitter.com/xxx', icon: 'fab fa-weixin'}, expected: { icon: 'fab fa-weixin', tooltip: 'Twitter' }},
            { link: { url: 'https://www.example.com/tada', icon: 'fab fa-weixin'}, expected: { icon: 'fab fa-weixin', tooltip: 'Web site' }},
        ])('allow to override icon', ({ link, expected }) => {
            const result = getSocialDisplayData(link)

            expect(result).toEqual(expected)
        })
    })
})
