import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

const inter = Inter({ subsets: ["latin"] });

const TIMER = 500;

export default function Home() {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const [beginTime, setBeginTime] = useState<number>();

  const [totalTimeActive, setTotalTimeActive] = useState(0);

  useEffect(() => {
    if (isMonitoring) {
      if (isActive) {
        setBeginTime(Date.now());
      } else if (!isActive && beginTime) {
        setTotalTimeActive((time) => {
          return time + Date.now() - beginTime;
        });
      }
    } else {
      setBeginTime(undefined);
      setTotalTimeActive(0);
    }
  }, [isActive, isMonitoring, beginTime]);

  const stopTimer = useRef(
    debounce(() => {
      console.log("event debounce call after " + TIMER + " ms of inactivity");
      setIsActive(false);
    }, TIMER)
  );

  const eventHandler = useCallback(() => {
    setIsActive(true);
    stopTimer.current();
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      window.addEventListener("mousemove", eventHandler);
    } else {
      window.removeEventListener("mousemove", eventHandler);
    }
    return () => window.removeEventListener("mousemove", eventHandler);
  }, [isMonitoring, eventHandler]);

  return (
    <>
      <Head>
        <title>activity_monitoring</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={() => setIsMonitoring((statut) => !statut)}>
          is monitoring mouse mouvement: {String(isMonitoring)}
        </button>
        <p>is active : {String(isActive)} </p>
        <p>total time (s) : {String(totalTimeActive / 1000)} </p>
      </main>
    </>
  );
}
