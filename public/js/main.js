function dynamicFilter(inputId) {
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
}

const toDescription = component => {
    const description = component.getFirstPropertyValue('description');
    if (description === null) {
        return '';
    }
    return description;
};

const meetupUrlFor = description => {
    const matching = description.match(/(https:\/\/www.meetup.com\/[a-zA-Z0-9-]+\/events\/[0-9]+)/g);
    if (matching && matching.length > 0) {
        return matching[matching.length - 1];
    }
    return undefined;
};

const toEvent = (component) => {
    const description = toDescription(component);
    const startDate = component.getFirstPropertyValue('dtstart').toJSDate();
    const endDate = component.getFirstPropertyValue('dtend').toJSDate();
    const format = (d) => d.toString().padStart(2, '0');
    const formatHour = (d) => format(d.getHours()) + 'H' + format(d.getMinutes());
    const months = ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    const url = meetupUrlFor(description);
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
        endDateHour: formatHour(endDate)
    }
}

const matchPatternForEvent = event => pattern => event.title.toLowerCase().includes(`[${pattern.toLowerCase()}]`);

const matchForPatterns = patterns => event => patterns.some(matchPatternForEvent(event));

const filterForPeriod = (minDate, maxDate) => event => event.startDate >= minDate && event.endDate <= maxDate;

const listVEventComponents = raw => new ICAL.Component(ICAL.parse(raw)).getAllSubcomponents('vevent');

const fetchEvents = (patterns, minDate, maxDate) => fetch('https://www.lyontechhub.org/Lyon-Tech-Hub-Calendar/calendar.ics').then((response) => response.text()).then((raw) =>
    listVEventComponents(raw)
        .map(toEvent)
        .filter(filterForPeriod(minDate, maxDate))
        .filter(matchForPatterns(patterns)));

function displayEvents(template, element, events) {
    if (element) {
        element.innerHTML = template({
            paneTitle: element.getAttribute('data-pane-title')
            , noEventCaption: element.getAttribute('data-no-event-caption')
            , events: events
            , hasEvents: events.length > 0
            , noEvent: events.length == 0
        });
    }
}

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
                    displayEvents(
                        compiledTemplate,
                        pastEventsElement,
                        items.filter((item) => item.startDate < now).toSorted((a, b) => b.startDate - a.startDate)
                    );
                    displayEvents(
                        compiledTemplate,
                        upcomingEventsElement,
                        items.filter((item) => item.startDate >= now).toSorted((a, b) => a.startDate - b.startDate)
                    );
                });
            });
    }
}
