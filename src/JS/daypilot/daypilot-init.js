import DayPilot from '/src/JS/daypilot/daypilot-all.min.js'

const startHour = 8;
const endHour = 20;
const dp = new DayPilot.Calendar("dp", {
    locale: "it-it",
    viewType: "Week",
    headerDateFormat: "dddd",
    timeRangeSelectedHandling: "Disabled",
    eventMoveHandling: "Disabled", //Update, Disabled
    eventResizeHandling: "Disabled",
    eventClickHandling: "ContextMenu",
    theme: "cakrro",
    startDate: "2024-06-24",
    businessBeginsHour: 8,
    businessEndsHour: 20,
    heightSpec: "BusinessHoursNoScroll",
    contextMenu: new DayPilot.Menu({
        items: [
            {
                text: "Delete", onClick: (args) => {
                    const dp = args.source.calendar;
                    // dp.events.remove(args.source);
                    console.log(dp.events);
                    alert(dp.events);
                }
            }
        ]
    }),
});

dp.events.list = [
    {
        id: "1",
        // start: DayPilot.Date.today().addHours(4),
        // end: DayPilot.Date.today().addHours(5),
        start: "2024-06-28T09:00:00",
        end: "2024-06-28T10:00:00",
        text: "Event 1"
    },
    {
        id: "2",
        start: "2024-06-24T10:00:00",
        end: "2024-06-24T12:00:00",
        text: "Event 2"
    },
    {
        id: "3",
        start: "2024-07-01T10:00:00",
        end: "2024-07-01T12:00:00",
        text: "Event 2"
    },
    {
        id: "4",
        start: "2024-06-25T10:30:00",
        end: "2024-06-25T12:30:00",
        text: "Event 2"
    }
];
dp.init();
transformCalendarToBusinessDays();

function transformCalendarToBusinessDays() {
    document.querySelector(".weekText").innerHTML = dp.startDate.toString("dd/M/yyyy");

    //Hides saturday and sunday
    document.querySelector("#dp > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(6)").style.display = "none";
    document.querySelector("#dp > div:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(7)").style.display = "none";

    //Hides columns after events
    document.querySelector("#dp > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > table:nth-child(2) > tbody > tr > td:nth-child(6)").style.display = "none";
    document.querySelector("#dp > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > table:nth-child(2) > tbody > tr > td:nth-child(7)").style.display = "none";

    for (let i = 1; i <= ((endHour - startHour) * 2); i++) {
        document.querySelector("#dp > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > table:nth-child(1) > tbody > tr:nth-child(%1) > td:nth-child(6)".replace("%1", i)).style.display = "none";
        document.querySelector("#dp > div:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > table:nth-child(1) > tbody > tr:nth-child(%1) > td:nth-child(7)".replace("%1", i)).style.display = "none";
    }
}

dp.onEventMoved = function (args) {
    // console.log(args.e.text());
    // console.log(dp.events.list);
}

document.querySelector(".customIcon.back").addEventListener('click', function () {
    console.log('back');
    let newStartDate = dp.startDate.addDays(-7);
    dp.update({ startDate: newStartDate });
    transformCalendarToBusinessDays();
});
document.querySelector(".customIcon.next").addEventListener('click', function () {
    console.log('next');
    let newStartDate = dp.startDate.addDays(7);
    dp.update({ startDate: newStartDate });
    transformCalendarToBusinessDays();
});