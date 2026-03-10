"use client";

import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import soundwaves from "@/constants/soundwaves.json";
import { addTosessionHistory } from "@/lib/actions/companion.actions";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  subject,
  name,
  topic,
  style,
  userName,
  userImage,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const sessionSavedRef = useRef(false);

  useEffect(() => {
    if (isSpeaking) lottieRef.current?.play();
    else lottieRef.current?.stop();
  }, [isSpeaking]);

  useEffect(() => {
    const onCallStart = () => {
      sessionSavedRef.current = false;
      setCallStatus(CallStatus.ACTIVE);
    };
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      if (!sessionSavedRef.current) {
        sessionSavedRef.current = true;
        addTosessionHistory(companionId);
      }
    };

    const onMessage = (message: Message) => {
      console.log("VAPI MESSAGE RECEIVED:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessages = { role: message.role, content: message.transcript };
        console.log("Adding to transcript:", newMessages);
        setMessages((prev) => [newMessages, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => console.error("VAPI ERROR:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
    };
  }, []);

  const toggleMicrophone = () => {
    if (callStatus !== CallStatus.ACTIVE) return;

    const muted = vapi.isMuted();
    vapi.setMuted(!muted);
    setIsMuted(!muted);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: {
        subject,
        topic,
        style,
      },
      clientMessages: ["transcript"],
      serverMessages: [],
    };

    // @ts-ignore
    vapi.start(configureAssistant(voice, style), assistantOverrides);
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    await vapi.stop();
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col w-full">
        <div className="companion-section">
          <div
            className="companion-avatar relative"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000 inset-0 flex items-center justify-center",
                callStatus === CallStatus.ACTIVE ? "opacity-0" : "opacity-100",
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duration-1000 inset-0",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0",
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                loop
                className="companion-lottie"
              />
            </div>
          </div>
          <p className="font-bold text-2xl mt-4 text-center">{name}</p>
        </div>

        <div className="user-section">
          <div className="flex flex-col gap-2 w-full">
            <div className="user-avatar">
              <Image
                src={userImage}
                alt={userName}
                width={130}
                height={130}
                className="rounded-full object-cover"
              />
            </div>
            <p className="font-bold text-xl">{userName}</p>
          </div>

          <button className="btn-mic w-full" onClick={toggleMicrophone}>
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>

          <button
            className={cn(
              "rounded-lg py-3 px-6 cursor-pointer transition-all w-full text-white font-semibold text-lg shadow-md hover:shadow-lg",
              callStatus === CallStatus.ACTIVE
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:opacity-90",
              callStatus === CallStatus.CONNECTING && "animate-pulse",
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
                ? "Connecting..."
                : "Start Session"}
          </button>
        </div>
      </section>

      <section className="transcript">
        <div className="transcript-message no-scrollbar">
          {messages.map((message, index) => {
            if (message.role === "assistant") {
              return (
                <p key={index} className="max-sm:text-sm">
                  {name.split(" ")[0].replace(/[.,]/g, "")}: {message.content}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-primary max-sm:text-sm">
                  {userName}: {message.content}
                </p>
              );
            }
          })}
        </div>

        <div className="transcript-fade" />
      </section>
    </section>
  );
};

export default CompanionComponent;
