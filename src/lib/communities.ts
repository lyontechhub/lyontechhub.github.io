export interface SocialLink {
    url: string;
    name?: string;
    icon?: string;
}
export interface ExternalCalendar {
    prefixTag?: string
    url: string
}

export interface FileCommunity {
    name: string;
    shortDescription: string;
    image: string;
    tags: string[];
    patternsGoogleCalendar?: string[];
    socialLinks: SocialLink[];
    slackChannels?: string[]
    calendars?: ExternalCalendar[]
}

export interface Community extends Omit<FileCommunity, "patternsGoogleCalendar"> {
    key: string;
    patternsGoogleCalendar: string[];
}

const keyPattern = /([^\/]+?)(\.[^.]*$|$)/;

export function getList(): Community[] {
    const files: Record<string, FileCommunity> =
        import.meta.glob(['../../data/*.json', '!**/conferences.json'], { eager: true });
    return Object.keys(files)
            .map((path: string) => {
                const community = files[path]
                const key = (path.match(keyPattern) ?? [path, path])[1]
                return {
                    key: key,
                    ...community,
                    patternsGoogleCalendar: [key, ...(community.patternsGoogleCalendar || [])]
                };
            });
}

type SocialDisplayData = { icon: string, tooltip: string }
const knownSocialHosts: Record<string, SocialDisplayData> = {
    'twitter.com': { icon: "fab fa-twitter", tooltip: "Twitter" },
    'meetup.com': { icon: "fas fa-calendar", tooltip: "Groupe Meetup" },
    'github.com': { icon: "fab fa-github", tooltip: "Github" },
    'linkedin.com': { icon: "fab fa-linkedin", tooltip: "LinkedIn" },
    'facebook.com': { icon: "fab fa-facebook", tooltip: "Facebook" },
    'youtube.com': { icon: "fab fa-youtube", tooltip: "Youtube channel" },
}

function extractMainDomain(url: string) {
    return new URL(url).hostname.replace('www.', '');
}

export function getSocialDisplayData(socialLink: SocialLink): SocialDisplayData {
    const hostname = extractMainDomain(socialLink.url)

    const defaultResult = knownSocialHosts[hostname] || { icon: "fas fa-link", tooltip: "Web site" }

    return {
        icon: socialLink.icon || defaultResult.icon,
        tooltip: socialLink.name || defaultResult.tooltip,
    };
}

export function extractCalendars(community: Community) {
    return community.socialLinks.flatMap(socialLink => {
        const hostname = extractMainDomain(socialLink.url);

        if(hostname === 'meetup.com') {
            const path = new URL(socialLink.url).pathname.split('/');
            const meetupKey = path[1] === 'fr-FR' ? path[2] : path[1];
            return [
                { tag: community.key, url: `https://www.meetup.com/${meetupKey}/events/ical/` }
            ];
        }

        return [];
    }).concat((community.calendars || []).map(c => {
        return { tag: c.prefixTag || community.key, url: c.url }
    }))

}
