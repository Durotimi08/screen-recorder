# Screen-Recorder-Extension
![logo](https://github.com/Keith-Web3/Screen-Recorder-Extension/assets/96974022/973c0bf8-3b19-4aa1-a104-d9c2e4526ddf)

HelpMeOut Extension is a screen recorder Chrome extension that allows you to easily capture and share your screen. It's one of the tasks from the HNG10 internship. Please read [Usage](#Usage) to see how to start up the extension properly to avoid any errors.

## Table of Contents
* [Installation](#Installation)
* [Usage](#Usage)

## Installation
To get started with HelpMeOut Extension, follow these simple steps:

1. Fork the Repository: Click the "Fork" button on the upper-right corner of this repository to create a copy in your own GitHub account.

2. Clone the Project: Open your terminal and run the following command to clone your forked repository to your local machine. Replace <your-github-username> with your GitHub username.
```bash
    git clone https://github.com/<your-github-username>/Screen-Recorder-Extension    
```
3. Navigate to the Project Folder: Change your current directory to the project folder.
```bash
    cd Screen-Recorder-Extension
```
4. Install Dependencies: Install all the required project dependencies by running the following command:
```bash
    npm install
```
5. Compile the Files: Compile the extension's files by running:
```bash
    npm run watch
```
This will generate a `dist` folder containing the compiled extension files.

6. Unpack the Extension:
  * Open Google Chrome.
  * Go to [chrome://extensions/](chrome://extensions/) in your browser.
  * Enable the "Developer mode" toggle in the top right corner.
  * Click on the "Load unpacked" button.
  * Select the dist folder created in step 5.

That's it! You've successfully installed HelpMeOut Extension.

## Usage
With HelpMeOut Extension installed, you can start recording your screen by reloading your current tab (very important), clicking on the extension icon in your browser's toolbar and selecting your desired recording configuration.
