import DayPilot from '/src/JS/daypilot/daypilot-all.min.js'
const dp = new DayPilot.Calendar("dp", {
    locale: "it-it",
    viewType: "Week",
    headerDateFormat: "dddd",
    timeRangeSelectedHandling: "Disabled",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventClickHandling: "ContextMenu",
    theme: "cakrro",
    startDate: "2025-03-01",
    // businessBeginsHour: 8,
    // businessEndsHour: 20,
    businessBeginsHour: 4,
    businessEndsHour: 5,
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
dp.startDate = "2024-06-24";
dp.events.list = [
    {
        id: "1",
        start: DayPilot.Date.today().addHours(10),
        end: DayPilot.Date.today().addHours(12),
        text: "Event 1"
    }
];
dp.init();