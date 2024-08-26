export interface SocialLink {
    icon: string;
    url: string;
    tooltip: string;
}

export interface FileCommunity {
    name: string;
    shortDescription: string;
    image: string | null;
    patternsGoogleCalendar: string[];
    socialLinks: SocialLink[];
}

export interface Community extends FileCommunity {
    key: string;
}

const keyPattern = /([^\/]+?)(\.[^.]*$|$)/;

export function getList(): Community[] {
    const files: Record<string, FileCommunity> =
        import.meta.glob(['../../data/*.json', '!**/conferences.json'], { eager: true });
    return Object.keys(files)
            .map((path: string) => {
                return {
                    key: (path.match(keyPattern) ?? [path, path])[1],
                    ...files[path]
                };
            });
}
