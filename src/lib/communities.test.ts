import { expect, test, describe, beforeEach } from 'vitest'
import { extractCalendars, getSocialDisplayData, type Community } from './communities'

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

    describe('extractCalendars should', () => {
        const defaultCommunity: Community = {
            key: 'CommuA',
            name: 'Community A',
            shortDescription: 'Great Community A',
            image: 'comma.jpg',
            tags: ['tagA'],
            patternsGoogleCalendar: ['CommuA', 'CommuB'],
            socialLinks: [],
        }

        test('return empty if no calendar', () => {
            const result = extractCalendars(defaultCommunity)

            expect(result).toEqual([])
        })

        test.each([
            { link: { url: 'https://twitter.com/xxx'}, expected: []},
            { link: { url: 'https://www.meetup.com/fr-FR/tada/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/fr-FR/tada'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/tada/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/tada'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/fr-FR/tada/fsdfsf'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/fr-FR/tada/fsdfsf/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/fr/tada/fsdfsf/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/en/tada/fsdfsf/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/fr-fr/tada/fsdfsf/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
            { link: { url: 'https://www.meetup.com/en-us/tada/fsdfsf/'}, expected: [{ tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' }]},
        ])('return meetup if meetup in social link', ({link, expected}) => {
            const result = extractCalendars({ ...defaultCommunity, socialLinks: [link] })

            expect(result).toEqual(expected)
        })

        test('return calendars', () => {
            const result = extractCalendars({
                ...defaultCommunity,
                calendars: [
                    { url: 'http://custom/tada.ical' },
                    { url: 'http://custom/tada2.ical', prefixTag: 'customA' },
                ]
            })

            expect(result).toEqual([
                { tag: defaultCommunity.key, url: 'http://custom/tada.ical' },
                { tag: 'customA', url: 'http://custom/tada2.ical' }
            ])
        })

        test('merge all calendars', () => {
            const result = extractCalendars({
                ...defaultCommunity,
                calendars: [
                    { url: 'http://custom/tada.ical' }
                ],
                socialLinks: [
                    { url: 'https://www.meetup.com/fr-FR/tada/'}
                ]
            })

            expect(result).toEqual([
                { tag: defaultCommunity.key, url: 'https://www.meetup.com/tada/events/ical/' },
                { tag: defaultCommunity.key, url: 'http://custom/tada.ical' },
            ])
        })
    })
})
