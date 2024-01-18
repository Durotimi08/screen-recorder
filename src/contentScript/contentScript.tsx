import { motion } from 'framer-motion'
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
} from 'react'

console.log('hello world')

const stop = chrome.runtime.getURL('stop.svg')
const pause = chrome.runtime.getURL('pause.svg')
const play = chrome.runtime.getURL('play.svg')
const cameraDisabled = chrome.runtime.getURL('video-slash.svg')
const microphone = chrome.runtime.getURL('microphone.svg')
const camera = chrome.runtime.getURL('video-camera.svg')
const trash = chrome.runtime.getURL('trash.svg')
let recordOptions
let recordInterval: NodeJS.Timeout
let mediaRecorder: MediaRecorder | null
let userStream: MediaStream = null
let captureStream: MediaStream = null
const fileReader = new FileReader()
let data1 = []

const ContentScript = function () {
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [recordTime, setRecordTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isCameraEnabled, setIsCameraEnabled] = useState(false)
  const [videoId, setVideoId] = useState('')
  async function toggleCamera() {
    if (userStream) {
      // If a stream exists, stop it
      const tracks = userStream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })
      userStream = null
      setIsCameraEnabled(false)
    } else {
      // If no stream exists, request a new one
      userStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 1280,
          height: 720,
        },
      })
      videoRef.current.srcObject = userStream
      setIsCameraEnabled(true)
    }
  }

  const startCapture = async function ({
    displayMediaOptions,
    isUserStreamEnabled,
  }: {
    displayMediaOptions: DisplayMediaStreamOptions
    isUserStreamEnabled: boolean
  }) {
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      )
      if (isUserStreamEnabled) {
        userStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: 1280,
            height: 720,
          },
        })
        videoRef.current.srcObject = userStream
        setIsCameraEnabled(true)
      }

      mediaRecorder = new MediaRecorder(captureStream)

      mediaRecorder.ondataavailable = function (e) {
        console.debug('Got blob data:', e.data)
        if (e.data && e.data.size > 0) {
          fileReader.readAsDataURL(e.data)
        }
        data1.push(e.data)
      }
      mediaRecorder.onstart = async function () {
        console.log('started')
        setRecordTime(0)
        recordInterval = setInterval(() => {
          setRecordTime(prev => prev + 1)
        }, 1000)
        try {
          const res = await fetch(
            'https://hng-chrome.onrender.com/start-recording',
            { method: 'POST' }
          )
          const { id, filename } = await res.json()
          console.log(id)
          setVideoId(id)
        } catch (err) {
          console.log(err)
        }
      }
      mediaRecorder.onresume = function () {
        setIsPaused(false)
        recordInterval = setInterval(() => {
          setRecordTime(prev => prev + 1)
        }, 1000)
      }
      mediaRecorder.onpause = function () {
        clearInterval(recordInterval)
        setIsPaused(true)
      }
      mediaRecorder.start(10000)
    } catch (err) {
      console.error(`Error: ${err}`)
      setIsRecording(false)
    }
    return captureStream
  }

  const popupListener = function (
    request: {
      message: {
        isAudioEnabled: boolean
        isVideoEnabled: boolean
        recordOption: 'window' | 'monitor' | 'browser'
      }
    },
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: any) => void
  ) {
    recordOptions = {
      displayMediaOptions: {
        video: {
          displaySurface: request.message.recordOption,
        },
        audio: request.message.isAudioEnabled,
        surfaceSwitching: 'include',
        selfBrowserSurface: 'exclude',
        systemAudio: 'include',
      },
      isUserStreamEnabled: request.message.isVideoEnabled,
    }

    setIsRecording(true)
    setIsCameraEnabled(request.message.isVideoEnabled)
    console.log('Message received in content script:', request.message)
  }

  useEffect(() => {
    fileReader.onload = function (event) {
      // 'event.target.result' contains the Base64 data
      const base64Data = event.target.result

      fetch(`https://hng-chrome.onrender.com/append-chunk/${videoId}`, {
        method: 'POST',
        body: JSON.stringify({
          chunkData: base64Data,
        }),
      })
        .then(res => res.json())
        .then(data => console.log(data))
    }

    if (!mediaRecorder) return
    mediaRecorder.onstop = async function (e) {
      console.log('stopping stream')
      if (!captureStream) return
      const tracks = captureStream.getTracks()
      tracks.forEach(track => {
        track.stop()
      })

      captureStream = null
      if (userStream) {
        const userTracks = userStream.getTracks()
        userTracks.forEach(track => {
          track.stop()
        })
        userStream = null
      }
      clearInterval(recordInterval)
      setIsRecording(false)
      console.log(data1)
      console.log(
        URL.createObjectURL(
          new Blob(data1, {
            type: 'video/mp4',
          })
        )
      )
      try {
        const res = await fetch(
          `https://hng-chrome.onrender.com/end-recording/${videoId}`,
          {
            method: 'POST',
          }
        )
        const data = await res.json()
        console.log(data)
      } catch (err) {
        console.log('end-recording error')
      }
      window.open(
        `https://screen-recorder-nine.vercel.app/new-video/${videoId}`,
        '_blank'
      )
    }
  }, [videoId, data1.length])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(popupListener)

    return () => chrome.runtime.onMessage.removeListener(popupListener)
  }, [])
  useEffect(() => {
    if (!isRecording) {
      setIsCameraEnabled(false)
      return
    }
    ;(async () => {
      const stream = await startCapture(recordOptions)

      console.log(stream)
    })()
  }, [isRecording])
  return isRecording ? (
    <motion.div
      draggable
      className="flex items-center gap-6 fixed bottom-0 left-0 z-[9999]"
    >
      <video
        autoPlay
        playsInline
        ref={videoRef}
        className=" w-36 h-36 rounded-full bg-black object-cover scale-x-[-1]"
      />
      <div className="flex items-center bg-[#141414] gap-8 py-4 px-10 h-max rounded-full border-[#BEBEBE] border-[10px]">
        <time>{secondsToHMS(recordTime)}</time>
        <div className=" w-3 h-3 shadow-[0px_0px_4px_4px_#c0040430] bg-[#C00404] rounded-full"></div>
        <div className="h-[69px] w-[1px] bg-[#E8E8E8]"></div>
        <Control
          onClick={() => {
            mediaRecorder[isPaused ? 'resume' : 'pause']()
          }}
          img={isPaused ? play : pause}
          name={isPaused ? 'play' : 'pause'}
        />
        <Control
          onClick={() => {
            mediaRecorder?.stop()
          }}
          img={stop}
          name="stop"
        />
        <Control
          onClick={toggleCamera}
          img={isCameraEnabled ? camera : cameraDisabled}
          name="camera"
        />
        <Control img={microphone} name="mic" />
        <Control
          onClick={() => setIsRecording(false)}
          isGray
          img={trash}
          name=""
        />
      </div>
    </motion.div>
  ) : (
    <></>
  )
}

// Extra components and helper functions
const Control = function ({
  img,
  name,
  isGray = false,
  ...props
}: {
  img: string
  name: string
  isGray?: boolean
} & ComponentPropsWithoutRef<'div'>) {
  return (
    <div className="cursor-pointer font-work" {...props}>
      <div
        className={`p-2 aspect-square w-11 rounded-full ${
          isGray ? 'bg-[#4B4B4B]' : 'bg-white'
        } cursor-pointer mx-auto grid place-content-center`}
      >
        <img
          className={`${
            name === 'pause' ? 'w-5' : 'w-8'
          } aspect-square object-contain`}
          src={img}
          alt={name}
        />
      </div>
      <p className="text-white font-medium mt-1 capitalize text-center min-h-[1rem]">
        {name}
      </p>
    </div>
  )
}

function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  // Add leading zeros if needed
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

export default ContentScript
