//currently doesn't work as chrome.action is disabled whenever "default_popup" is specified in manifest.json v3. Would leave it incase that changes in future versions.

chrome.action.onClicked.addListener(tab => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js'],
  })
})
