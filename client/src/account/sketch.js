// import { paper, view, Point, Color, Group, Matrix, Path, project } from "paper";
import { useEffect, useRef } from "react";

const GR = 1.61803;
const R = 80;
const D = 5;
const L = R * 2.5 * GR;
const MIN_A = Math.PI / 2;
const MAX_A = -GR / 4;
const alpha = (t) => MIN_A + t * (MAX_A - MIN_A);
const MIN_SPREAD = 0.05;
const MAX_SPREAD = GR / 10;
const spread = (t) => MIN_SPREAD + t * (MAX_SPREAD - MIN_SPREAD);
const OFFSET = { x: R / GR, y: -R / GR };
const TOT_FRAMES = 60;

const violet = "#150e56";
const white = "white";
const gwhite = "ghostwhite";
const RAINBOW = [
    "#D65129",
    "#EEB417",
    "#F4DC2A",
    "#49C219",
    "#1FB3E0",
    "#744DA8",
];

export default function Sketch() {
    const canvasRef = useRef(null);

    const drawRightWing = (ctx, length, angle, spread) => {
        ctx.save();
        ctx.translate(OFFSET.x, OFFSET.y);
        for (let i = 0; i < RAINBOW.length; i++) {
            if (i > 0) ctx.restore();

            ctx.save();
            ctx.translate(0, 10 * i);
            ctx.rotate(angle + spread * i);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(length - 30 * i, 0);
            ctx.bezierCurveTo(length / 3, 40, length / 10, 60, 0, 0);
            ctx.fillStyle = RAINBOW[i];
            ctx.fill();
        }
        ctx.restore();
        ctx.restore();
    };

    const drawLeftWing = (ctx, length, angle, spread) => {
        ctx.save();
        ctx.translate(-OFFSET.x, OFFSET.y);
        for (let i = 0; i < RAINBOW.length; i++) {
            if (i > 0) ctx.restore();
            ctx.save();
            ctx.translate(0, 10 * i);
            ctx.rotate(angle + spread * i);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-length + 30 * i, 0);
            ctx.bezierCurveTo(-length / 3, 40, -length / 10, 60, 0, 0);
            ctx.fillStyle = RAINBOW[i];
            ctx.fill();
        }
        ctx.restore();
        ctx.restore();
    };

    const drawCircle = (ctx) => {
        ctx.beginPath();
        ctx.arc(0, 0, R + D, 0, 2 * Math.PI);
        ctx.fillStyle = gwhite;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, R, 0, 2 * Math.PI);
        ctx.fillStyle = violet;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-R / 3, R / 2);
        ctx.lineTo(-R / 3, -R / 2);
        ctx.moveTo(-R / 3, 0);
        ctx.lineTo(R / 2, R / 2);
        ctx.moveTo(-R / 3, 0);
        ctx.lineTo(R / 2, -R / 2);
        ctx.strokeStyle = white;
        ctx.lineWidth = 7;
        ctx.stroke();
    };

    const draw = (ctx, frameCount) => {
        const t = frameCount / TOT_FRAMES;
        ctx.globalAlpha = t;
        drawRightWing(ctx, L, alpha(t), spread(t));
        drawLeftWing(ctx, L, -alpha(t), -spread(t));
    };

    let frameCount = 0;
    useEffect(() => {
        let animationFrameId;

        const canvas = canvasRef.current;
        const W = canvas.width;
        const H = canvas.height;
        const ctx = canvas.getContext("2d");

        const render = () => {
            if (frameCount <= TOT_FRAMES) ctx.clearRect(0, 0, W, H);
            ctx.save();
            ctx.translate(W / 2, H / 2);
            ctx.save();
            draw(ctx, frameCount);
            ctx.restore();
            drawCircle(ctx);
            ctx.restore();

            frameCount++;
            if (frameCount <= TOT_FRAMES)
                animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);

    return (
        <div className="headline-logo">
            <canvas ref={canvasRef} width="740" height="400">
                KIKI
            </canvas>
        </div>
    );
}
