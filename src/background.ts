import { format, isWithinInterval, setHours, setMinutes } from 'date-fns';

chrome.alarms.create('checkWorkTime', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkWorkTime') {
    checkWorkTime();
  }
});

function checkWorkTime() {
  const now = new Date();
  const morningStart = setHours(setMinutes(now, 0), 9);
  const morningEnd = setHours(setMinutes(now, 0), 12);
  const afternoonStart = setHours(setMinutes(now, 0), 13);
  const afternoonEnd = setHours(setMinutes(now, 0), 18);

  const isWorkTime = 
    isWithinInterval(now, { start: morningStart, end: morningEnd }) ||
    isWithinInterval(now, { start: afternoonStart, end: afternoonEnd });

  if (isWorkTime) {
    chrome.storage.local.get(['isActive', 'lastNotificationTime'], (result) => {
      const lastNotificationTime = result.lastNotificationTime ? new Date(result.lastNotificationTime) : null;
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      if (!result.isActive && (!lastNotificationTime || lastNotificationTime < fiveMinutesAgo)) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: '专注时间',
          message: '工作时间已开始。是时候开始一个番茄工作周期了！',
          buttons: [{ title: '开始番茄钟' }],
          requireInteraction: true,
        });

        chrome.storage.local.set({ lastNotificationTime: now.toISOString() });
      }
    });
  }
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.tabs.create({ url: 'index.html' }, (tab) => {
      chrome.windows.update(tab.windowId!, { focused: true });
    });
  }
});