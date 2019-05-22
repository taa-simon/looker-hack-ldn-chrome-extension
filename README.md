# looker-hack-ldn-chrome-extension

This is a project built at the Looker Hack London event, 17th May 2019: https://looker.com/events/london-hackathon

This is a simple Chrome extension with one (not quite functional) feature - it will watch any tabs with Looker where queries are running, and when they complete send a browser notification to alert the user. When clicked, the notification takes the user back to the tab where the query was running.

![Notification example](/notification.png "Logo Title Text 1")

## Current status
So far, the extension watches each Looker tab (based on the host being *.looker.com) and check the DOM elements which display the spinner, or query completion information. Based on these it should recognise when a query has completed (and not been served from the cache), then sends a notification as shown above.

The content script (which is injected into the Looker tabs) isn't quite working right yet, and doesn't catch when queries complete. If the query is re-run after completion the notification is displayed. There is some issue here with the conditionals and the way the DOM mutates so it's not quite working as intended. It should be possible to use the DOM to recognise completed queries correctly but I haven't worked that out yet!
