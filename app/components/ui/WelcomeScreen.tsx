"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { UserData } from "@/types";
import { TokenService } from "@/app/services/tokenService";

interface WelcomeScreenProps {
  onStart: () => void;
  userData?: UserData;
}

export default function WelcomeScreen({ onStart, userData }: WelcomeScreenProps) {
  // Extract user name from token if available
  const displayName = userData?.tokenPayload ? TokenService.getUserDisplayName(userData.tokenPayload) : "";
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center min-h-screen w-full bg-white"
    >
      <h2 className="text-center font-bold text-2xl leading-none tracking-normal bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] bg-clip-text text-transparent mb-6">
        Asistente Clave
      </h2>
      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 overflow-hidden">
        <Image src="/ia_circle.png" alt="Avatar Asistente Clave" width={96} height={96} className="object-cover object-top w-24 h-24" />
      </div>
      <div className="text-center mb-6 px-4">
        <p className="text-base font-normal text-gray-700">
          ¡Hola! <span className="font-bold">{displayName}</span>
          ,<br />
          Soy <span className="font-semibold bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] bg-clip-text text-transparent">Asistente Clave</span>
          , tu guía y asistente en <br /> nuestra aplicación. ¿En qué puedo ayudarte hoy?
        </p>
      </div>
      <button
        className="relative bg-[#3E4EB8] hover:bg-gradient-to-r from-[#9379E3] via-[#5E70D2] to-[#3A4CB1] rounded-lg text-white font-medium py-2 px-6 transition-all duration-300 group flex items-center min-w-max w-auto overflow-hidden shadow-none hover:shadow-[0_4px_24px_0_rgba(94,112,210,0.35),0_1.5px_8px_0_rgba(147,121,227,0.25)]"
        onClick={onStart}
        style={{
          transitionProperty: "background, width, padding, box-shadow",
        }}
      >
        <span className="relative z-10">Comenzar ahora</span>
        <span className="absolute right-4 opacity-0 translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.70898 13.5002H16.879L11.999 18.3802C11.609 18.7702 11.609 19.4102 11.999 19.8002C12.389 20.1902 13.019 20.1902 13.409 19.8002L19.999 13.2102C20.389 12.8202 20.389 12.1902 19.999 11.8002L13.419 5.20021C13.029 4.81021 12.399 4.81021 12.009 5.20021C11.619 5.59021 11.619 6.22022 12.009 6.61022L16.879 11.5002H5.70898C5.15898 11.5002 4.70898 11.9502 4.70898 12.5002C4.70898 13.0502 5.15898 13.5002 5.70898 13.5002Z"
              fill="white"
            />
          </svg>
        </span>
        <span className="inline-block w-0 group-hover:w-6 transition-all duration-300"></span>
      </button>
    </motion.div>
  );
}
