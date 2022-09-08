/**
 * Start Button
 * Stop Button
 */

import { Box, Button } from "@mui/material";
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  Duration,
  format,
  formatDistanceStrict,
  intervalToDuration,
} from "date-fns";
import de from "date-fns/locale/de";
import { useEffect, useState } from "react";

type CountDown = Date | null;

interface TimerProps {
  start: CountDown;
  stop: CountDown;
}

const TestComponent: React.FC<TimerProps> = ({ start, stop }) => {
  const [intervalId, setIntervalId] = useState<number>();
  const [saveDuration, setSaveDuration] = useState<Duration>();
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    if (start && !intervalId) {
      setIntervalId(
        setInterval(() => {
          setNow(new Date());
        })
      );
    }
  }, [start]);

  useEffect(() => {
    console.log("stop && start && intervalId", {stop, start, intervalId});
    if (stop && start && intervalId) {
      const currentDuration = intervalToDuration({
        end: now,
        start,
      });


      setSaveDuration({
        seconds: (currentDuration.seconds ?? 0) + (saveDuration?.seconds ?? 0),
        minutes: (currentDuration.minutes ?? 0) + (saveDuration?.minutes ?? 0),
        ...currentDuration,
      });
      clearInterval(intervalId);
    }
  }, [stop, start]);

  if (start) {
    const duration = intervalToDuration({
      end: now,
      start,
    });

    return (
      <div>
        sec: {saveDuration?.seconds} <br />
        min: {saveDuration?.minutes} <br />
      </div>
    );
  }

  return <>123</>;
};

export const Timer: React.FC = () => {
  const [start, setStart] = useState<CountDown>(null);
  const [stop, setStop] = useState<CountDown>(null);

  const handleStart = () => {
    if (!start) {
      setStart(new Date());
    }
  };

  const handleStop = () => {
    setStop(new Date());
  };

  const calcResult = () => {
    console.log("calcResult", { start, stop });
    if (start && stop) {
      console.log("start", format(start, "yyyy-MM-dd HH:mm:ss"));
      console.log("stop", format(stop, "yyyy-MM-dd HH:mm:ss"));
      const seconds = differenceInSeconds(stop, start);
      const minuts = differenceInMinutes(stop, start);
      const hours = differenceInHours(stop, start);

      console.log({
        seconds,
        minuts,
        hours,
      });
    }
  };

  return (
    <Box>
      <Button onClick={handleStart}>Start</Button>
      <Button onClick={handleStop}>Stop</Button>
      <Button onClick={calcResult}>Result</Button>
      <TestComponent start={start} stop={stop} />
    </Box>
  );
};
