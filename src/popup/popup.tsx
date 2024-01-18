import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion } from 'framer-motion'
import '../assets/tailwind.css'

// chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//   await chrome.scripting.executeScript({
//     target: { tabId: tabs[0].id },
//     files: ['contentScript.js'],
//   })
//   console.log('ran1')

//   // chrome.tabs.sendMessage(tabs[0].id, {
//   //   message: { isAudioEnabled, isVideoEnabled, recordOption },
//   // })
// })

const Test = function () {
  const [recordOption, setRecordOption] = useState<
    'window' | 'monitor' | 'browser'
  >('browser')
  const isScreen = recordOption === 'monitor'
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  return (
    <div className="min-w-[350px] p-4 font-work">
      <header className="flex items-center justify-between">
        <img className="logo object-contain" src="logo-2.png" alt="logo" />
        <div className="flex items-center gap-4">
          <img className="cursor-pointer" src="setting-2.svg" alt="settings" />
          <img
            className="cursor-pointer"
            src="close-circle.svg"
            alt="close"
            onClick={() => window.close()}
          />
        </div>
      </header>
      <p className=" pt-4 text-base text-[#413C6D] font-normal">
        This extension helps you record and share help videos with ease
      </p>
      <div className="flex items-center justify-center gap-8 mt-8">
        <div
          className=" text-center cursor-pointer"
          onClick={() => setRecordOption('monitor')}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto "
          >
            <motion.path
              d="M8.5865 2.66675H23.3998C28.1465 2.66675 29.3332 3.85341 29.3332 8.58675V17.0267C29.3332 21.7734 28.1465 22.9467 23.4132 22.9467H8.5865C3.85317 22.9601 2.6665 21.7734 2.6665 17.0401V8.58675C2.6665 3.85341 3.85317 2.66675 8.5865 2.66675Z"
              stroke="#928FAB"
              strokeWidth="1.5"
              animate={{
                stroke: isScreen ? '#120B48' : '#928FAB',
                strokeWidth: isScreen ? 2.5 : 1.5,
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M16 22.96V29.3333"
              stroke="#928FAB"
              strokeWidth="1.5"
              animate={{
                stroke: isScreen ? '#120B48' : '#928FAB',
                strokeWidth: isScreen ? 2.5 : 1.5,
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M2.6665 17.3333H29.3332"
              stroke="#928FAB"
              strokeWidth="1.5"
              animate={{
                stroke: isScreen ? '#120B48' : '#928FAB',
                strokeWidth: isScreen ? 2.5 : 1.5,
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M10 29.3333H22"
              stroke="#928FAB"
              strokeWidth="1.5"
              animate={{
                stroke: isScreen ? '#120B48' : '#928FAB',
                strokeWidth: isScreen ? 2.5 : 1.5,
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className={`text-base ${
              isScreen
                ? 'font-semibold text-[#120B48]'
                : ' font-medium text-[#928FAB]'
            }`}
          >
            Full screen
          </p>
        </div>
        <div
          className="text-center cursor-pointer"
          onClick={() => setRecordOption('browser')}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <motion.path
              d="M21.3332 17.2001V22.8001C21.3332 27.4667 19.4665 29.3334 14.7998 29.3334H9.19984C4.53317 29.3334 2.6665 27.4667 2.6665 22.8001V17.2001C2.6665 12.5334 4.53317 10.6667 9.19984 10.6667H14.7998C19.4665 10.6667 21.3332 12.5334 21.3332 17.2001Z"
              stroke="#120B48"
              animate={{
                strokeWidth: !isScreen ? 2.5 : 1.5,
                stroke: !isScreen ? '#120B48' : '#928FAB',
              }}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M29.3332 9.20008V14.8001C29.3332 19.4667 27.4665 21.3334 22.7998 21.3334H21.3332V17.2001C21.3332 12.5334 19.4665 10.6667 14.7998 10.6667H10.6665V9.20008C10.6665 4.53341 12.5332 2.66675 17.1998 2.66675H22.7998C27.4665 2.66675 29.3332 4.53341 29.3332 9.20008Z"
              stroke="#120B48"
              animate={{
                strokeWidth: !isScreen ? 2.5 : 1.5,
                stroke: !isScreen ? '#120B48' : '#928FAB',
              }}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p
            className={`text-base capitalize ${
              !isScreen
                ? 'font-semibold text-[#120B48]'
                : ' font-medium text-[#928FAB]'
            }`}
          >
            current tab
          </p>
        </div>
      </div>
      <DevicePermissions
        img="video-camera.svg"
        device="camera"
        enabled={isVideoEnabled}
        setEnabled={setIsVideoEnabled}
      />
      <DevicePermissions
        img="microphone.svg"
        device="audio"
        enabled={isAudioEnabled}
        setEnabled={setIsAudioEnabled}
      />
      <button
        onClick={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            async function (tabs) {
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  message: { isAudioEnabled, isVideoEnabled, recordOption },
                },
                function (_request) {
                  if (
                    chrome.runtime.lastError?.message ===
                    'Could not establish connection. Receiving end does not exist.'
                  ) {
                    console.log('ran error')
                    chrome.scripting
                      .executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['contentScript.js'],
                      })
                      .then(() => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                          message: {
                            isAudioEnabled,
                            isVideoEnabled,
                            recordOption,
                          },
                        })
                      })
                    console.warn(chrome.runtime.lastError.message)
                    // throw new Error('Error sending message via chrome.tabs.sendMessage');
                  }
                }
              )
            }
          )
        }}
        className="capitalize bg-[#120B48] border-none outline-none px-5 py-4 text-base text-white w-full mt-5 rounded-xl font-medium"
      >
        start recording
      </button>
    </div>
  )
}

const DevicePermissions = function ({
  img,
  device,
  enabled,
  setEnabled,
}: {
  img: string
  device: 'camera' | 'audio'
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="rounded-xl flex gap-4 items-center mt-4 border-[1px] border-[#100A42] p-3">
      <img src={img} alt={device} className=" w-8" />
      <p className="capitalize text-[#100A42] font-medium text-base">
        {device}
      </p>
      <motion.div
        transition={{
          backgroundColor: {
            duration: 0.3,
          },
        }}
        className={` flex rounded-3xl ml-auto w-11 h-[1.55rem] p-[0.2rem] cursor-pointer ${
          enabled ? 'justify-end bg-[#120B48]' : 'justify-start bg-[#928FAB]'
        }`}
        onClick={() => setEnabled(prev => !prev)}
      >
        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.3,
            },
          }}
          className="w-[1.15rem] h-[1.15rem] rounded-full bg-white"
        ></motion.div>
      </motion.div>
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<Test />)
