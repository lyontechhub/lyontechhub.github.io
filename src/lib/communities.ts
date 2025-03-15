import { parse as parseUrl } from 'url';

export interface SocialLink {
    url: string;
    name?: string;
    icon?: string;
}

export interface FileCommunity {
    name: string;
    shortDescription: string;
    image: string | null;
    patternsGoogleCalendar?: string[];
    socialLinks: SocialLink[];
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

export function getSocialDisplayData(socialLink: SocialLink): SocialDisplayData {
    const hostname = parseUrl(socialLink.url).hostname.replace('www.', '')

    const defaultResult = knownSocialHosts[hostname] || { icon: "fas fa-link", tooltip: "Web site" }

    return {
        icon: socialLink.icon || defaultResult.icon,
        tooltip: socialLink.name || defaultResult.tooltip,
    };
}
