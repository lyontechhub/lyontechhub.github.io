function dynamicFilter(inputId) {
    // Declare variables
    var input, filter, items, i, txtValue;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    items = document.getElementsByClassName('filterable');

    for (i = 0; i < items.length; i++) {
        txtValue = items[i].getAttribute('data-filter-value');
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = '';
        } else {
            items[i].style.display = 'none';
        }
    }
}

function fetchEvents(patterns, minDate, maxDate) {
    return Promise.all(patterns.map((p) =>
        fetch("https://www.googleapis.com/calendar/v3/calendars/ck2ruq6cqfch3t4gshbd6vdnd4@group.calendar.google.com/events?key=AIzaSyAHKI9T7fhK68b2eggUCHlu9eOwsdFUrhg&singleEvents=true"
            + "&q=" + p
            + "&timeMin=" + minDate.toISOString()
            + "&timeMax=" + maxDate.toISOString())
            .then((response) => response.json())))
        .then((results) => {
            var mapEvents = (googleEvent) => {
                var startDate = Date.parse(googleEvent.start.dateTime);
                var endDate = Date.parse(googleEvent.end.dateTime);
                var parsedStartDate = new Date(startDate);
                var parsedEndDate = new Date(endDate);
                var format = (d) => d.toString().padStart(2, '0');
                var formatHour = (d) => format(d.getHours()) + 'H' + format(d.getMinutes())
                var months = ['Jan', 'Fev', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
                return {
                    id: googleEvent.id,
                    title: googleEvent.summary,
                    description: googleEvent.description,
                    hasDescription: googleEvent.description && googleEvent.description.length > 0,
                    location: googleEvent.location,
                    startDate: startDate,
                    endDate: endDate,
                    url: googleEvent.htmlLink,
                    startDateMonth: months[parsedStartDate.getMonth()],
                    startDateDay: format(parsedStartDate.getDay()),
                    startDateHour: formatHour(parsedStartDate),
                    endDateHour: formatHour(parsedEndDate)
                }
            };

            var removeDuplicates = (events) => {
                var tmpEvents = {};
                for (var i = 0, n = events.length; i < n; i++) {
                    tmpEvents[events[i].id] = events[i];
                }
                var i = 0;
                events = [];
                for (var id in tmpEvents) {
                    events[i++] = tmpEvents[id];
                }
                return events;
            };

            return Promise.resolve(removeDuplicates(results
                .reduce((events, result) => events.concat(result.items.map(mapEvents)), [])
            ));
        });
}

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
