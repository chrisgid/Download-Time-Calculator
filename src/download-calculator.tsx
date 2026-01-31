import { useState } from 'react'
import type { SpeedUnit, SizeUnit } from './types';

interface Speed {
    value: number | null,
    unit: SpeedUnit
}

export default function DownloadCalculator() {
    const sizeUnits: SizeUnit[] = ["KB", "MB", "GB", "TB"];
    const defaultSizeUnit = sizeUnits[2];
    const speedUnits: SpeedUnit[] = ["Kbps", "Mbps", "Gbps", "KB/s", "MB/s", "GB/s"];
    const defaultSpeedUnit = speedUnits[1];

    const [speed, setSpeed] = useState<Speed>({ value: null, unit: defaultSpeedUnit});
    const [size, setSize] = useState<Size>({ value: null, unit: defaultSizeUnit});

    const seconds = calculateSeconds(speed, size);

    return (
        <>
            <SizeInput size={size} units={sizeUnits} onChange={setSize} />
            <SpeedInput speed={speed} units={speedUnits} onChange={setSpeed} />
            { seconds !== null ? <TimeOutput seconds={seconds} /> : null }
        </>
    )
}

interface SpeedInputProps {
    speed: Speed,
    units: SpeedUnit[],
    onChange: (newSpeed: Speed) => void
}

function SpeedInput({ speed, units, onChange }: SpeedInputProps) {
    const id = "speed";

    function handleUnitChange(e: React.ChangeEvent<HTMLSelectElement>) {
        onChange({
            ...speed, 
            unit: e.target.value as SpeedUnit
        });
    }

    function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({
            ...speed, 
            value: Number(e.target.value)
        });
    }

    return (
        <div>
            <label htmlFor={id} title="Your download speed">Speed</label>
            <input type="number" id={id} value={speed.value ?? ''} onChange={handleSpeedChange}></input>
            <select
                aria-label="Download speed unit"
                value={speed.unit}
                onChange={handleUnitChange}>
                {units.map((unit) => <option key={unit}>{unit}</option>)}
            </select>
        </div>
    )
}

interface SizeInputProps {
    size: Size,
    units: SizeUnit[],
    onChange: (newSize: Size) => void
}

interface Size {
    value: number | null,
    unit: SizeUnit
}

function SizeInput({ size, units, onChange }: SizeInputProps) {
    const id = "size";

    function handleUnitChange(e: React.ChangeEvent<HTMLSelectElement>) {
        onChange({
            ...size,
            unit: e.target.value as SizeUnit
        });
    }

    function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange({
            ...size,
            value: Number(e.target.value)
        });
    }

    return (
        <div>
            <label htmlFor={id} title="The size of your download">Size</label>
            <input type="number" id={id} value={size.value ?? ''} onChange={handleSpeedChange}></input>
            <select
                aria-label="Download size unit"
                value={size.unit}
                onChange={handleUnitChange}>
                {units.map((unit) => <option key={unit}>{unit}</option>)}
            </select>
        </div>
    );
}

function TimeOutput({seconds}: {seconds: number}) {
    return <div>Time: {secondsToTime(seconds)}</div>;
}

function calculateSeconds(speed: Speed, size: Size)
{
    if (speed.value === null || size.value === null) {
        return null;
    }

    const bytesSpeed = mapToBytes(speed.unit) * speed.value;
    const bytesSize = mapToBytes(size.unit) * size.value;
    return bytesSize / bytesSpeed;
}

const baseUnitToBytes: Record<string, number> = {
    "Kb": 128,
    "KB": 1024,
    "Mb": 131072,
    "MB": 1048576,
    "Gb": 134217728,
    "GB": 1073741824,
    "Tb": 137438953472,
    "TB": 1099511627776
};

function mapToBytes(unit: SpeedUnit | SizeUnit): number {
    const baseUnit = unit.substring(0, 2);
    return baseUnitToBytes[baseUnit];
}

function secondsToTime(seconds: number) {
    if (isNaN(seconds) || seconds === null) {
        return "";
    }

    if (seconds < 1) {
        return "Less than a second";
    }

    const years = Math.floor(seconds / 31536000);
    const days = Math.floor((seconds % 31536000) / 86400); 
    const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const secs = Math.round((((seconds % 31536000) % 86400) % 3600) % 60);

    const timeParts: string[] = [];

    if (years > 0) timeParts.push(years + " " + (years > 1 ? "years" : "year"));
    if (days > 0) timeParts.push(days + " " + (days > 1 ? "days" : "day"));
    if (hours > 0) timeParts.push(hours + " " + (hours > 1 ? "hours" : "hour"));
    if (minutes > 0) timeParts.push(minutes + " " + (minutes > 1 ? "minutes" : "minute"));
    if (secs > 0) timeParts.push(secs + " " + (secs > 1 ? "seconds" : "second"));

    if (timeParts.length === 1) {
        return timeParts[0];
    }

    return [timeParts.slice(0, -1).join(', '), timeParts.slice(-1)[0]].join(timeParts.length < 2 ? '' : ' and ');
}
