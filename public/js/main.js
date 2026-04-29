const dynamicFilter = inputId => {
    // Declare variables
    var input, filter, items, i, txtValue;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    items = document.getElementsByClassName('filterable');

    for (i = 0; i < items.length; i++) {
        txtValue = items[i].getAttribute('data-key');
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = '';
        } else {
            items[i].style.display = 'none';
        }
    }
};

const toDescription = component => {
    const description = component.getFirstPropertyValue('description');
    if (description === null) {
        return '';
    }
    return description;
};

const toEvent = (component, index) => {
    const description = toDescription(component);
    const startDate = component.getFirstPropertyValue('dtstart').toJSDate();
    const endDate = component.getFirstPropertyValue('dtend').toJSDate();
    const format = (d) => d.toString().padStart(2, '0');
    const formatHour = (d) => format(d.getHours()) + 'H' + format(d.getMinutes());
    const months = ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    const url = component.getFirstPropertyValue('url');
    return {
        id: component.getFirstPropertyValue('uid'),
        title: component.getFirstPropertyValue('summary'),
        description: description,
        hasDescription: description && description.length > 0,
        url,
        hasUrl: url !== undefined,
        startDate,
        endDate,
        location: component.getFirstPropertyValue('location'),
        startDateMonth: months[startDate.getMonth()],
        startDateDay: format(startDate.getDate()),
        startDateHour: formatHour(startDate),
        endDateHour: formatHour(endDate),
        isNotFirst: index > 0
    }
}

const matchPatternForEvent = event => pattern => event.title.toLowerCase().includes(`[${pattern.toLowerCase()}]`);

const matchForPatterns = patterns => event => patterns.some(matchPatternForEvent(event));

const filterForPeriod = (minDate, maxDate) => event => event.startDate < maxDate && event.endDate > minDate;

const listVEventComponents = raw => new ICAL.Component(ICAL.parse(raw)).getAllSubcomponents('vevent');

const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const safeUrl = (url) => {
    if (!url) return '';
    let parsed;
    try { parsed = new URL(url, document.baseURI); } catch { return ''; }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.href;
};

const calendarICSUrl = 'https://www.lyontechhub.org/Lyon-Tech-Hub-Calendar/calendar.ics';

let _icsEventsP;
const fetchAllRawEvents = () => {
    if (!_icsEventsP) {
        _icsEventsP = fetch(calendarICSUrl)
            .then((response) => response.text())
            .then((raw) => listVEventComponents(raw).map(toEvent));
    }
    return _icsEventsP;
};

const fetchEvents = (patterns, minDate, maxDate) => fetchAllRawEvents().then((events) =>
    events
        .filter(filterForPeriod(minDate, maxDate))
        .filter(matchForPatterns(patterns)));

const displayEvents = (template, element, events) => {
    if (element) {
        element.innerHTML = template({
            paneTitle: element.getAttribute('data-pane-title'),
            noEventCaption: element.getAttribute('data-no-event-caption'),
            events: events,
            hasEvents: events.length > 0,
            noEvent: events.length == 0
        });
    }
};

const loadCommunities = () =>
    fetch('/communities.json')
        .then((response) => response.text())
        .then((body) => JSON.parse(body));

const refreshCurrentMonth = (calendar) =>{
    let dateRangeStart = calendar.getDate();
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    document.querySelector('#calendarDate').textContent = monthNames[dateRangeStart.getMonth()] + ' ' + dateRangeStart.getFullYear();
}

const loadCalendar = async () => {
    const communities = await loadCommunities();
    const communitiesCalendars =
        communities
            .map((community) => {
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += (Math.floor(Math.random() * 100) % 16).toString(16);
                }
                return { id: community.key, name: community.name, backgroundColor: color };
            });

    const Calendar = tui.Calendar;
    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    const dateFmt = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const timeFmt = new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit', minute: '2-digit', hour12: false
    });
    const formatFrTime = (d) => timeFmt.format(d).replace(':', 'h');
    const toJsDate = (d) => (d && typeof d.toDate === 'function') ? d.toDate() : new Date(d);

    const calendar = new Calendar('#calendar', {
        usageStatistics: false,
        defaultView: 'month',
        isReadOnly: true,
        useDetailPopup: true,
        month: {
            dayNames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            startDayOfWeek: 1,
        },
        timezone: {
            zones: [
                {
                    timezoneName: 'Europe/Paris',
                },
            ],
        },
        template: {
            popupDetailDate({ start, end, isAllday }) {
                const startDate = toJsDate(start);
                const endDate = toJsDate(end);
                const datePart = capitalize(dateFmt.format(startDate));
                if (isAllday) return datePart;
                return `${datePart}, ${formatFrTime(startDate)} - ${formatFrTime(endDate)}`;
            },
        },
        calendars: [
          {
            id: 'default',
            name: 'Default',
            // backgroundColor: '#03bd9e',
          },
          ...communitiesCalendars
        ],
    });

    // Workaround Toast UI Calendar 2.1.3 popup offset bug: the lib writes
    // document-relative top/left on a popup whose CSS containing block is
    // whatever the closest positioned ancestor happens to be (here Bulma's
    // .container, since the popup is portalled into a floating-layer that is
    // a sibling of the calendar layout, not a descendant). We re-anchor by
    // subtracting the popup's actual offsetParent's document offset.
    const calendarRoot = document.querySelector('#calendar');
    if (calendarRoot) {
        const fixPopupPosition = () => {
            const popup = calendarRoot.querySelector('.toastui-calendar-popup-container');
            if (!popup || !popup.style.top || !popup.style.left) return;
            const op = popup.offsetParent;
            if (!op) return;
            const r = op.getBoundingClientRect();
            const dy = r.top + window.scrollY;
            const dx = r.left + window.scrollX;
            const key = popup.style.top + '|' + popup.style.left;
            if (popup.dataset.lthPosKey === key) return;
            const t = parseFloat(popup.style.top);
            const l = parseFloat(popup.style.left);
            if (Number.isNaN(t) || Number.isNaN(l)) return;
            popup.style.top = (t - dy) + 'px';
            popup.style.left = (l - dx) + 'px';
            popup.dataset.lthPosKey = popup.style.top + '|' + popup.style.left;
        };
        const attachObserver = () => {
            const layer = calendarRoot.querySelector('.toastui-calendar-floating-layer');
            if (!layer) {
                setTimeout(attachObserver, 50);
                return;
            }
            new MutationObserver(fixPopupPosition).observe(layer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style'],
            });
        };
        attachObserver();
    }

    refreshCurrentMonth(calendar);
    fetchAllRawEvents()
        .then((items) => {
            calendar.createEvents(
                items.map((item) => {
                    var title = item.title;
                    var calendarId = 'default';
                    const match = title.match(/^\[(.*?)\] (.+)$/);
                    if (match) {
                        for (var i = 0; i < communities.length; i++) {
                            const patterns = communities[i].patternsGoogleCalendar;
                            if (patterns) {
                                for (var j = 0; j < patterns.length; j++) {
                                    if (match[1].localeCompare(patterns[j], 'en', { sensitivity: 'base' }) === 0) {
                                        title = '[' +  match[1] + '] ' + match[2];
                                        calendarId = communities[i].key;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    function formatWithLink(text, url) {
                        const safeText = escapeHtml(text);
                        const href = safeUrl(url);
                        return href
                            ? `<a class="calendar-popup-text" href="${escapeHtml(href)}">${safeText}</a>`
                            : safeText;
                    }

                    const safeItemUrl = safeUrl(item.url);
                    const truncated = truncate(item.description, 200);
                    const truncatedHtml = escapeHtml(truncated || '');
                    const linkHtml = safeItemUrl
                        ? `<div class="calendar-popup-link-wrap"><a class="calendar-popup-link" href="${escapeHtml(safeItemUrl)}" target="_blank" rel="noopener">En savoir plus <i class="fa fa-external-link-alt"></i></a></div>`
                        : '';
                    const body = truncatedHtml && linkHtml
                        ? `${truncatedHtml}${linkHtml}`
                        : (truncatedHtml || linkHtml);

                    return {
                        calendarId: calendarId,
                        id: item.id,
                        title: formatWithLink(title, safeItemUrl),
                        body,
                        start: item.startDate,
                        end: item.endDate,
                        location: item.location,
                        state: '',
                        raw: { url: safeItemUrl },
                        isReadOnly: true,
                    }
                })
            );
        })
    ;

    document.querySelector('#calendarToday').onclick = () => {
        calendar.today();
        refreshCurrentMonth(calendar);
    };
    document.querySelector('#calendarNext').onclick = () => {
        calendar.next();
        refreshCurrentMonth(calendar);
    };
    document.querySelector('#calendarPrevious').onclick = () => {
        calendar.prev();
        refreshCurrentMonth(calendar);
    };

};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const truncate = (text, max) =>
    text && text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

const fetchAllEvents = (minDate, maxDate) =>
    fetchAllRawEvents().then((events) => events.filter(filterForPeriod(minDate, maxDate)));

const loadCalendarMobileList = async () => {
    const el = document.getElementById('calendarMobileList');
    if (!el) return;
    const rangeEl = document.getElementById('calendarMobileRange');
    const prevEl = document.getElementById('calendarMobilePrevious');
    const nextEl = document.getElementById('calendarMobileNext');
    const todayEl = document.getElementById('calendarMobileToday');

    const template = Handlebars.compile(
        await fetch('/js/communityEvents.html').then((r) => r.text())
    );

    const WINDOW_DAYS = 14;
    const monthLabels = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const formatRange = (start, endExclusive) => {
        const last = new Date(endExclusive);
        last.setDate(last.getDate() - 1);
        return `${start.getDate()} ${monthLabels[start.getMonth()]}`;
    };

    let windowStart = startOfDay(new Date());
    let renderToken = 0;

    const render = async (start) => {
        const myToken = ++renderToken;
        const windowEnd = new Date(start);
        windowEnd.setDate(windowEnd.getDate() + WINDOW_DAYS);
        if (rangeEl) rangeEl.textContent = formatRange(start, windowEnd);
        const events = (await fetchAllEvents(start, windowEnd))
            .toSorted((a, b) => a.startDate - b.startDate)
            .map((ev, i) => {
                const url = safeUrl(ev.url);
                return {
                    ...ev,
                    url,
                    hasUrl: Boolean(url),
                    description: truncate(ev.description, 200),
                    isNotFirst: i > 0,
                };
            });
        if (myToken !== renderToken) return;
        displayEvents(template, el, events);
    };

    const shiftBy = (days) => {
        const next = new Date(windowStart);
        next.setDate(next.getDate() + days);
        windowStart = next;
        render(windowStart);
    };

    prevEl?.addEventListener('click', () => shiftBy(-1));
    nextEl?.addEventListener('click', () => shiftBy(1));
    todayEl?.addEventListener('click', () => {
        windowStart = startOfDay(new Date());
        render(windowStart);
    });

    render(windowStart);
};

window.onload = () => {
    var communityDetailsEventsElement = document.getElementById('communityDetails');
    var pastEventsElement = document.getElementById('pastEvents');
    var upcomingEventsElement = document.getElementById('upcomingEvents');
    if (communityDetailsEventsElement && (pastEventsElement || upcomingEventsElement)) {
        fetch('/js/communityEvents.html')
            .then((response) => response.text())
            .then((template) => {
                var compiledTemplate = Handlebars.compile(template);

                var now = new Date();
                var fourMonthAgo = new Date();
                fourMonthAgo.setDate(fourMonthAgo.getDate() - 4 * 30);
                var fourMonthLater = new Date();
                fourMonthLater.setDate(fourMonthLater.getDate() + 4 * 30);

                return fetchEvents(
                    JSON.parse(communityDetailsEventsElement.getAttribute('data-patterns-google-calendar')),
                    fourMonthAgo,
                    fourMonthLater
                ).then((items) => {
                    const sanitized = items.map((item) => {
                        const url = safeUrl(item.url);
                        return { ...item, url, hasUrl: Boolean(url) };
                    });
                    displayEvents(
                        compiledTemplate,
                        pastEventsElement,
                        sanitized.filter((item) => item.startDate < now).toSorted((a, b) => b.startDate - a.startDate)
                    );
                    displayEvents(
                        compiledTemplate,
                        upcomingEventsElement,
                        sanitized.filter((item) => item.startDate >= now).toSorted((a, b) => a.startDate - b.startDate)
                    );
                });
            });
    }

    var calendarElement = document.getElementById('calendar');
    if (calendarElement) {
        loadCalendar();
    }
    loadCalendarMobileList();
}
