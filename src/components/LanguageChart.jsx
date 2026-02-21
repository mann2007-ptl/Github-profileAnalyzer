import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    "#818cf8", "#06b6d4", "#10b981", "#f59e0b", "#ec4899",
    "#a855f7", "#f97316", "#3b82f6", "#14b8a6", "#ef4444",
];

export default function LanguageChart({ repos }) {
    const langMap = {};
    repos.forEach((r) => {
        if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
    });

    const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 9);
    const otherCount = sorted.slice(9).reduce((acc, [, c]) => acc + c, 0);
    if (otherCount > 0) top.push(["Other", otherCount]);

    if (top.length === 0) return null;

    const totalLangs = top.length;

    const data = {
        labels: top.map(([lang]) => lang),
        datasets: [
            {
                data: top.map(([, count]) => count),
                backgroundColor: top.map((_, i) => COLORS[i % COLORS.length]),
                borderColor: "#080d1a",
                borderWidth: 3,
                hoverOffset: 10,
                hoverBorderColor: "rgba(255,255,255,0.2)",
            },
        ],
    };

    // Center text plugin
    const centerTextPlugin = {
        id: "centerText",
        beforeDraw(chart) {
            const { ctx, chartArea: { left, right, top, bottom } } = chart;
            const cx = (left + right) / 2;
            const cy = (top + bottom) / 2;
            ctx.save();
            ctx.font = "bold 20px 'Outfit', sans-serif";
            ctx.fillStyle = "#eef2ff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(totalLangs, cx, cy - 8);
            ctx.font = "500 11px 'Inter', sans-serif";
            ctx.fillStyle = "#64748b";
            ctx.fillText("languages", cx, cy + 12);
            ctx.restore();
        },
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#94a3b8",
                    font: { size: 12, family: "'Inter', sans-serif" },
                    padding: 14,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 26, 46, 0.95)",
                borderColor: "rgba(99,102,241,0.3)",
                borderWidth: 1,
                titleColor: "#eef2ff",
                bodyColor: "#94a3b8",
                padding: 12,
                callbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const pct = ((ctx.raw / total) * 100).toFixed(1);
                        return ` ${ctx.label}: ${ctx.raw} repos (${pct}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="chart-section">
            <h3 className="section-title">Language Distribution</h3>
            <div className="chart-wrapper">
                <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
            </div>
        </div>
    );
}
